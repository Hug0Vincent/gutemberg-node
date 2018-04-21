/**
 *
 *  Controller for Gutemberg's document consultation
 *  @author adrien-thebault
 *
 */

app.controller("documentsController", function($scope, $rootScope, $location, $routeParams, $http, $timeout) {

  /** init variables **/

  $('#loader').show();
  $rootScope.pageTitle = 'Chargement';
  $scope.params = $routeParams;

  $scope.showMenu = true;
  $scope.sheets = [];
  $scope.overlays = [];
  $scope.fields = {};
  $scope.colors = {};
  $scope.fieldsShown = [];
  $scope._resultPremier  = [];
  $scope.editMode = false;
  $scope.readMode = 0;
  $scope.addAnnotMode = false;
  $scope.similarDocsLoaded = false;
  $scope.similar_docs = [];
  $scope.similar_items = [];
  $scope.toSearch = "";
  $scope.entities = [];
  $scope.real_document_type = null;


  $('#helpSearch').popup();

  /** go to cliked entity */
  $scope.goEntity = function(e) {

    console.log("E: ", e);
    $scope.currentSheet = e.sheet;
    var ids = e.id.split("-");
    $scope.currentId = "field-" + ids[1] + "-" + ids[2] + "-0";

    $('.field.active').removeClass('active');
    for(var i in $scope.currentSheet._areas) $('#field-' + ids[1] + '-' + ids[2] + '-' + i).addClass('active');
  };

  /** go to admin page */
  $scope.admin = function() {
    $location.path('/admin');
  }

  $scope.logoutUser = function() {
     $location.path('/');
     $rootScope.logout();
   }

  /** add sheet mode */

  $('#addannotmodal').modal({detachable: false});
  $scope.toggleAddMode = function() {

    $scope.addMode = !$scope.addMode;
    if($scope.addMode) $('#addannotmodal').modal('show');
    else $('#addannotmodal').modal('hide');

  }

  /**
  * change current read mode
  * 0 => "lecture"
  * 1 => "annotation"
  * 2 => "consultation"
  */

  $scope.modeRead = function() {

    if($scope.readMode == 0) return;

    $scope.readMode = 0;
    $scope.osd.clearOverlays();

  };

  $scope.modeAnnot = function() {

    if($scope.readMode == 1) return;

    $scope.readMode = 1;
    $scope.osd.goToPage($scope.currentPage);

  };

  $scope.modeConsult = function() {

    if($scope.readMode == 2) return;

    $scope.readMode = 2;
    $scope.osd.goToPage($scope.currentPage);

  };

  /**
  * search in current doc
  */

  $scope.searchCurrent = function() {

    /** display results */
    var handleSearchResults = function(r) {

      annots = r.data.result.annotations;
      for(var a in annots) {

        var sheet = null;

        for(var s in $scope.document._pages[$scope.currentPage]._sheets) {
            if($scope.document._pages[$scope.currentPage]._sheets[s].id == annots[a].sheetId) {
              sheet = s;
              break;
            }
        }

        if(sheet == null) continue;

        for(var i in $scope.document._pages[$scope.currentPage]._sheets[sheet]._areas) {

          if($scope.document._pages[$scope.currentPage]._sheets[sheet]._areas[i].id == annots[a]._source.areaId) {
            $('#field-' + $scope.currentPage + '-' + s + '-' + i).addClass('currentSearched');
            break;
          }
        }

      }

    }

    /** loaders */
    $('.currentSearched').removeClass('currentSearched');
    $('.ui.search').addClass('loading');

    /** fetch first 100 results */
    $http.get(API + "documents/search_current?size=100&id=" + $scope.document._pages[$scope.currentPage].id + "&text=" + $scope.toSearch).then(function(r) {

      handleSearchResults(r);

      /** then fetch ElasticSearch max's result number */
      $http.get(API + "documents/search_current?size=10000&id=" + $scope.document._pages[$scope.currentPage].id + "&text=" + $scope.toSearch).then(function(r2) {

        handleSearchResults(r2);
        $('.ui.search').removeClass('loading');

      }, function(e) {

        $rootScope.error = {
          title: "Oops! Une erreur s'est produite",
          description: "Impossible d'effectuer la recherche, veuillez ré-essayer.",
          canClose: true
        }

        $('#loader').hide();
        $('#error').modal({
          closable: $rootScope.error.canClose
        }).modal('show');

      });

    }, function(e) {

      $rootScope.error = {
        title: "Oops! Une erreur s'est produite",
        description: "Impossible d'effectuer la recherche, veuillez ré-essayer.",
        canClose: true
      }

      $('#loader').hide();
      $('#error').modal({
        closable: $rootScope.error.canClose
      }).modal('show');

    })
  };

  /** go to clicked doc */

  $scope.goDoc = function(id) {
    $location.path('/documents/' + id);
  }

  /** Set button background according to tiles background (piste d'idées)
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "'#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + "'";
}
app.directive('imageCheckbox', function() {
  return {
    link: function(scope, attr) {
      scope.bgCol = rgbToHex($scope.colors[id], $scope.colors[id], $scope.colors[id]);
      //scope.$apply();
    }
  }
})*/

  /**
  *   load document
  */

  $http.get(API + 'documents/' + $scope.params.id, { timeout: API_TIMEOUT }).then(function(r) {

    $scope.document = r.data;
    var toZoom = null;

    /** go through every page, sheet, area to prepare display */
    for(p in $scope.document._pages) {

      /** prepares entities dictionnary */
      $scope.entities.push({});
      for(var x in DOCUMENT_TYPES) {
        if(DOCUMENT_TYPES[x].id == $scope.document.docTypeId) {
          for(var s in DOCUMENT_TYPES[x].sheetTypes) $scope.entities[p][DOCUMENT_TYPES[x].sheetTypes[s].name] = [];
          break;
        }
      }

      /** sets current page to url setting or default to first one */
      if($scope.params.hasOwnProperty("page") && $scope.params.page == $scope.document._pages[p].id) $scope.params.page = parseInt(p) + 1;

      var _sheets = $scope.document._pages[p]._sheets;
      $scope.overlays[p] = [];

      for(x in _sheets) {

        /** an entity is what's described by a sheet */
        $scope.entities[p][_sheets[x].name].push({
          sheet: _sheets[x],
          id: 'sheet-' + p + '-' + x
        });

        /** define sheet color so every area of that sheet uses the same color */
        if(!$scope.colors[_sheets[x].id]) $scope.colors[_sheets[x].id] = {
          r: Math.floor(Math.random()*150 + 50),
          g: Math.floor(Math.random()*150 + 50),
          b: Math.floor(Math.random()*150 + 50)
        };



        /** computes sheet boundaries */
        hg = [_sheets[x].points[0].x, _sheets[x].points[0].y];
        hd = [_sheets[x].points[1].x, _sheets[x].points[1].y];
        bd = [_sheets[x].points[2].x, _sheets[x].points[2].y];
        bg = [_sheets[x].points[3].x, _sheets[x].points[3].y];

        /** create sheet overlay */

        var sheetId = 'sheet-' + p + '-' + x;

        $scope.overlays[p].unshift({

          id: sheetId,
          px: hg[0],
          py: hg[1],
          width:hd[0] - hg[0],
          height:bg[1] - hg[1],
          className:'sheet'

        });

        var _areas = _sheets[x]._areas;
        for(y in _areas) {

          /** compute area boundaries */

          hg = [_areas[y].points[0].x, _areas[y].points[0].y];
          hd = [_areas[y].points[1].x, _areas[y].points[1].y];
          bd = [_areas[y].points[2].x, _areas[y].points[2].y];
          bg = [_areas[y].points[3].x, _areas[y].points[3].y];

          /** zoom on that area if that's the one given in the url */

          if($scope.params.hasOwnProperty("area") && $scope.params.area == _areas[y].id)
            toZoom = new OpenSeadragon.Rect(hg[0], hg[1], hd[0] - hg[0], bg[1] - hg[1]);

          /** create area overlay */

          $scope.overlays[p].push({

            id: 'field-' + p + '-' + x + '-' + y,
            sheetId: sheetId,
            areaId: _areas[y].id,
            px: hg[0],
            py: hg[1],
            width:hd[0] - hg[0],
            height:bg[1] - hg[1],
            className:'field',

            onDraw: function(position, size, element) {

              /** retrieve overlay-specific variables */

              var id = element.id.split("-");

              var _page = $scope.document._pages[id[1]];
              if(typeof _page == "undefined") return;

              var _sheet = _page._sheets[id[2]];
              if(typeof _sheet == "undefined") return;

              var _area = _sheet._areas[id[3]];
              if(typeof _area == "undefined") return;

              var red = $scope.colors[_sheet.id].r;
              var green = $scope.colors[_sheet.id].g;
              var blue = $scope.colors[_sheet.id].b;

              /** some css */

              $('#' + element.id).css({

                position: "absolute",
                width: size.x,
                height: size.y,
                left: position.x,
                top: position.y,
                background: "rgb("+ red + "," + green +"," + blue +")",
                opacity: "0.3"

              });

              /** add class "searched" if it's the area given in the url */

              if($scope.params.hasOwnProperty("area") && $scope.params.area == _area.id) {
                $('#' + element.id).addClass('searched');
              }

            }

          });

        }

      }
    }

    /** ensure that the current page is the actual current page */
    $scope.currentPage = ($scope.params.hasOwnProperty("page")) ? $scope.params.page - 1 : 0;

    /** prepares everything related to document type */

    for(var x in DOCUMENT_TYPES) {
      if(DOCUMENT_TYPES[x].id == $scope.document.docTypeId) {

        $scope.document.type = x;
        $scope.real_document_type = DOCUMENT_TYPES[x];
        $scope.toCreateSheetType = $scope.real_document_type.sheetTypes[0].id;

        break;

      }
    }

    /** prepares entities so they can be easily displayed in the side menu */

    for(var x in $scope.real_document_type.sheetTypes) {

      for(var p in $scope.document._pages) {
        for(var e in $scope.entities[p][$scope.real_document_type.sheetTypes[x].name]) {

          first_field = $scope.real_document_type.sheetTypes[x].fieldTypes[0].name;
          if($scope.real_document_type.sheetTypes[x].fieldTypes.length > 1) second_field = $scope.real_document_type.sheetTypes[x].fieldTypes[1].name;

          e_title = '';
          for(var z in $scope.entities[p][$scope.real_document_type.sheetTypes[x].name][e].sheet._areas) {
            if($scope.entities[p][$scope.real_document_type.sheetTypes[x].name][e].sheet._areas[z].name == first_field && $scope.entities[p][$scope.real_document_type.sheetTypes[x].name][e].sheet._areas[z]._annotations.length > 0) {
              e_title = $scope.entities[p][$scope.real_document_type.sheetTypes[x].name][e].sheet._areas[z]._annotations[0].text;
              break;
            }
          }

          e_summary = '';
          if($scope.real_document_type.sheetTypes[x].fieldTypes.length > 1) {
            for(var z in $scope.entities[p][$scope.real_document_type.sheetTypes[x].name][e].sheet._areas) {
              if($scope.entities[p][$scope.real_document_type.sheetTypes[x].name][e].sheet._areas[z].name == second_field && $scope.entities[p][$scope.real_document_type.sheetTypes[x].name][e].sheet._areas[z]._annotations.length > 0) {
                e_summary = $scope.entities[p][$scope.real_document_type.sheetTypes[x].name][e].sheet._areas[z]._annotations[0].text;
                break;
              }
            }
          }

          $scope.entities[p][$scope.real_document_type.sheetTypes[x].name][e] = {
            title: e_title,
            summary: e_summary.slice(0,80) + '...',
            id: $scope.entities[p][$scope.real_document_type.sheetTypes[x].name][e].id,
            sheet: $scope.entities[p][$scope.real_document_type.sheetTypes[x].name][e].sheet
          }

        }
      }

    }

    /** page title */
    $rootScope.pageTitle = $scope.document.title;

    /** load openSeaDragon */
    $scope.openSeaDragon();
    $scope.osd.goToPage($scope.currentPage);
    $scope.modeAnnot();

    /** actually zoom on the needed area */
    if(toZoom != null) $timeout(function() {
      $scope.osd.viewport.fitBoundsWithConstraints($scope.osd.viewport.imageToViewportRectangle(toZoom), false);
    }, 500);

    $('#loader').hide();

    /**
     * Load similar documents once everything is loaded (a regarde comment ces documents sont compares, purement textuel ou au niveau de la structure)
     */

     $http.get(API + 'documents/like?size=3&id=' + $scope.params.id, { timeout: API_TIMEOUT }).then(function(r) {
// $scope.params.id = id du document similaire
//   $http.get(API + 'documents/search_similar?type=' + $scope.currentSheet.name + '&text=' + item_title + '&size=3').then(function(r) {


       //$scope.similar_docs = r.data.result + $scope._results;
       $scope.similar_docs = r.data.result;


       console.log(" YOOOOOO !!!!!!!" + $scope.similar_docs);
       $scope.similarDocsLoaded = true;

     }, function(r) {

       $rootScope.error = {
         title: "Oops! Une erreur s'est produite",
         description: "Impossible de charger les documents similaires.",
         canClose: true
       }

       $('#loader').hide();
       $('#error').modal({
         closable: $rootScope.error.canClose
       }).modal('show');

     });

  }, function(r) {

    $rootScope.error = {
      title: "Oops! Une erreur s'est produite",
      description: "Impossible de charger le document requis.",
      canClose: false
    }

    $('#loader').hide();
    $('#error').modal({
      closable: $rootScope.error.canClose
    }).modal('show');

  });

  /**
  *   Displays OSD
  */

  $scope.openSeaDragon = function() {

    $('#openseadragon').html('');

    tileSources = [];
    for(var i = 0; i < $scope.document._pages.length; i++) tileSources.push(IMG_URL + $scope.document._pages[i].image.split(".")[0] + ".dzi");

    $('#btn-next, #btn-previous, #btn-zoom-in, #btn-zoom-out, #btn-add').popup();

    $scope.osd = OpenSeadragon({
      id: "openseadragon",
      prefixUrl: "./vendor/openseadragon/images/",
      tileSources: tileSources,
      sequenceMode: true,
      nextButton: "btn-next",
      previousButton: "btn-previous",
      zoomInButton:   "btn-zoom-in",
      zoomOutButton:  "btn-zoom-out",
      overlays: (($scope.readMode == 0) ? [] : $scope.overlays[$scope.currentPage])
    });

    $scope.osd.addHandler("page", function(data) {

      $scope.currentPage = data.page;
      $scope.osd.overlays = (($scope.readMode == 0) ? []:$scope.overlays[data.page]);

      if(!$scope.$$phase) $scope.$apply();

    });

    $scope.osd.addHandler("animation-start", function(data) {
      $('.sheet').popup('hide');
    });

    $scope.osd.addViewerInputHook({ hooks: [{
        tracker: 'viewer', handler: 'dragHandler', hookHandler: function(e) {

          /** drag handler, used when creating a sheet so that OSD doesn't shift the view */

          if(!$scope.addMode) return;
          var elt = document.getElementById("selectionOverlay");

          if($scope.dragStart == null) {

            $scope.dragStart = $scope.osd.viewport.pointFromPixel(e.position);

            $scope.osd.addOverlay({
              element: elt,
              location: $scope.dragStart,
              width: 0,
              height: 0
            });

          } else {

            var current = $scope.osd.viewport.pointFromPixel(e.position);

            console.log(current.x - $scope.dragStart.x);
            console.log(current.y - $scope.dragStart.y);

            $scope.osd.updateOverlay(elt, new OpenSeadragon.Rect($scope.dragStart.x, $scope.dragStart.y, current.x - $scope.dragStart.x, current.y - $scope.dragStart.y), OpenSeadragon.Placement.TOP_LEFT);

          }

          console.log();

          e.preventDefaultAction = true;

        }
      },{
        tracker: 'viewer', handler: 'dragEndHandler', hookHandler: function(e) {

          /** at the end of the drag, create sheet */

          if(!$scope.addMode) return;

          var overlay = $scope.osd.getOverlayById("selectionOverlay");
          var loc = $scope.osd.viewport.viewportToImageCoordinates(overlay.location);
          var size = $scope.osd.viewport.viewportToImageCoordinates(new OpenSeadragon.Point(overlay.width, overlay.height));

          sheet_points = [{ x: loc.x, y: loc.y },{ x: loc.x + size.x, y: loc.y},{ x: loc.x + size.x, y: loc.y + size.y },{ x: loc.x, y: loc.y + size.y }]
          $http.post(API + 'sheets/add?access_token=' + $rootScope.auth_token, {
            points : sheet_points,
            sheetTypeId : $scope.toCreateSheetType,
            pageId : $scope.document._pages[$scope.currentPage].id
          }).then(function(r) {

            var sheetId = 'sheet-' + $scope.currentPage + '-' + $scope.document._pages[$scope.currentPage]._sheets.length;

            $scope.overlays[$scope.currentPage].unshift({

              id: sheetId,
              px: loc.x,
              py: loc.y,
              width:size.x,
              height:size.y,
              className:'sheet'

            });

            sheettype = null;
            for(var x in $scope.real_document_type.sheetTypes) {
              if($scope.real_document_type.sheetTypes[x].id == $scope.toCreateSheetType) {
                sheettype = $scope.real_document_type.sheetTypes[x];
                break;
              }
            }

            sheet = r.data;
            sheet.name = sheettype.name;


            $scope.document._pages[$scope.currentPage]._sheets.push(sheet);

            /** create an area of each type when creating a sheet */
            /** @todo: for some resaon some of these areas are not created, we should probably create them sequentially */

            for(var x in sheettype.fieldTypes) {

              ftype = sheettype.fieldTypes[x];

              $http.post(API + 'areas/add?access_token=' + $rootScope.auth_token, {
                points : sheet_points,
                fieldTypeId : ftype.id,
                sheetId : r.data.id
              }).then(function(r2) {

                $scope.document._pages[$scope.currentPage]._sheets[$scope.document._pages[$scope.currentPage]._sheets.length - 1]._areas.push(r2.data);

                hg = [r2.data.points[0].x, r2.data.points[0].y];
                hd = [r2.data.points[1].x, r2.data.points[1].y];
                bd = [r2.data.points[2].x, r2.data.points[2].y];
                bg = [r2.data.points[3].x, r2.data.points[3].y];

                $scope.overlays[$scope.currentPage].push({

                  id: 'field-' + $scope.currentPage + '-' + ($scope.document._pages[$scope.currentPage]._sheets.length - 1) + '-' + $scope.document._pages[$scope.currentPage]._sheets[$scope.document._pages[$scope.currentPage]._sheets.length - 1]._areas.length,
                  sheetId: sheetId,
                  areaId: r2.data.id,
                  px: hg[0],
                  py: hg[1],
                  width:hd[0] - hg[0],
                  height:bg[1] - hg[1],
                  className:'field',
                  onDraw: function(position, size, element) {

                    var id = element.id.split("-");

                    var _page = $scope.document._pages[id[1]];
                    var _sheet = _page._sheets[id[2]];
                    var _area = _sheet._areas[id[3]];

                    $('#' + element.id).css({

                      position: "absolute",
                      width: size.x,
                      height: size.y,
                      left: position.x,
                      top: position.y,
                      background: "rgb(0,0,255)",
                      opacity: "0.3"

                    });

                  }

                });

                $scope.osd.goToPage($scope.currentPage);

              }, function(p) {

                $rootScope.error = {
                  title: "Oops! Une erreur s'est produite",
                  description: "Impossible de créer la fiche d'annotations.",
                  canClose: true
                }

                $('#error').modal({
                  closable: $rootScope.error.canClose
                }).modal('show');

              });

              /** @todo as a tmp fix we only create the first area **/
              break;

            }

          }, function(p) {

            $rootScope.error = {
              title: "Oops! Une erreur s'est produite",
              description: "Impossible de créer la fiche d'annotations.",
              canClose: true
            }

            $('#error').modal({
              closable: $rootScope.error.canClose
            }).modal('show');

          });

          $scope.toggleAddMode();
          $scope.dragStart = null;
          e.preventDefaultAction = true;
          if(!$scope.$$phase) $scope.$apply();

        }
      },
      { tracker: 'viewer', handler: 'clickHandler',  hookHandler: function (e) {

        /** click tracker */
        /** used mainly to display sheet informations */

        var childof = false;
        var parent = document.getElementById("annotations");
        var node = e.originalEvent.target.parentNode;

        while (node != null) {
           if (node == parent) childof = true;
           node = node.parentNode;
        }

        if(childof) e.preventDefaultAction = true;
        if(childof || !e.quick) return;

        var element = e.originalEvent.target;
        var id = element.id.split("-");

        if(id[0] != "field") return;

        var _page = $scope.document._pages[id[1]];
        var _sheet = _page._sheets[id[2]];
        var _area = _sheet._areas[id[3]];

        hg = [_sheet.points[0].x, _sheet.points[0].y];
        hd = [_sheet.points[1].x, _sheet.points[1].y];
        bd = [_sheet.points[2].x, _sheet.points[2].y];
        bg = [_sheet.points[3].x, _sheet.points[3].y];

        //var toZoom = new OpenSeadragon.Rect(hg[0], hg[1], hd[0] - hg[0], bg[1] - hg[1]);
        //$scope.osd.viewport.fitBoundsWithConstraints($scope.osd.viewport.imageToViewportRectangle(toZoom), true);

        $scope.currentArea = _area;
        console.log("SHEET:", _sheet);
        $scope.currentSheet = _sheet;
        $scope.currentId = element.id;

        $('.sheet').popup('hide');

        $('.field.active').removeClass('active');
        for(var i in $scope.currentSheet._areas) $('#field-' + id[1] + '-' + id[2] + '-' + i).addClass('active');

        if($scope.readMode != 2) {

          var sheet_id = "sheet-" + id[1] + "-" + id[2];

          $('#' + sheet_id).popup({ variation: 'very wide', html: $scope.popupContent, on: 'manual', lastResort: true, onVisible: $scope.onVisibleCallback });
          setTimeout(function() {
            $('#' + sheet_id).popup('show');
            $scope.updatePopup();
          }, 100);

        }

        var sheet_type;
        for(var x in $scope.real_document_type.sheetTypes) {
          if($scope.real_document_type.sheetTypes[x].name == $scope.currentSheet.name) {
            sheet_type = $scope.real_document_type.sheetTypes[x];
            break;
          }
        }

        first_field = sheet_type.fieldTypes[0].name;
        if(sheet_type.fieldTypes.length > 1) second_field = sheet_type.fieldTypes[1].name;

        var item_title = "";
        for(var i in $scope.currentSheet._areas) {
          if($scope.currentSheet._areas[i].name == first_field && $scope.currentSheet._areas[i]._annotations.length > 0) {
            item_title = $scope.currentSheet._areas[i]._annotations[0].text;
            break;
          }
        }

        var item_summary = '';
        if(sheet_type.fieldTypes.length > 1) {
          for(var i in $scope.currentSheet._areas) {
            if($scope.currentSheet._areas[i].name == second_field && $scope.currentSheet._areas[i]._annotations.length > 0) {
              item_summary = $scope.currentSheet._areas[i]._annotations[0].text.slice(0,80); + '...'
              break;
            }
          }
        }

        $scope.selectedItem = {
          type: $scope.currentSheet.name,
          title: item_title,
          summary: item_summary
        }

        $scope.similar_items = [];

        $http.get(API + 'documents/search_similar?type=' + $scope.currentSheet.name + '&text=' + item_title + '&size=3').then(function(r) {
          var sheets = r.data.result.sheets;
          for(var s in sheets) {

            var sheet = sheets[s];
            if(sheet.id == $scope.currentSheet.id) continue;

            var similar_title = "";
            for(var i in sheet._areas) {
              if(sheet._areas[i].name == first_field && sheet._areas[i]._annotations.length > 0) {
                similar_title = sheet._areas[i]._annotations[0].text;
                break;
              }
            }

            var similar_summary = '';
            if(sheet_type.fieldTypes.length > 1) {
              for(var i in sheet._areas) {
                if(sheet._areas[i].name == second_field && sheet._areas[i]._annotations.length > 0) {
                  similar_summary = sheet._areas[i]._annotations[0].text.slice(0,80); + '...'
                  break;
                }
              }
            }

            $scope.similar_items.push({
              original: sheet,
              title: similar_title,
              summary: similar_summary
            });

          }
        });

        if(!$scope.$$phase) $scope.$apply();

        e.preventDefaultAction = true;

      }}, { tracker:'viewer', handler:'dblClickHandler', hookHandler : function(e) {

        /** double click tracker */
        /** used mainly to zoom on double clicked sheets */

        var childof = false;
        var parent = document.getElementById("annotations");
        var node = e.originalEvent.target.parentNode;

        while (node != null) {
           if (node == parent) childof = true;
           node = node.parentNode;
        }

        if(childof) {
          e.preventDefaultAction = true;
          return;
        }

        var element = e.originalEvent.target;
        var id = element.id.split("-");

        if(id[0] != "field") return;

        var _page = $scope.document._pages[id[1]];
        var _sheet = _page._sheets[id[2]];
        var _area = _sheet._areas[id[3]];

        hg = [_sheet.points[0].x, _sheet.points[0].y];
        hd = [_sheet.points[1].x, _sheet.points[1].y];
        bd = [_sheet.points[2].x, _sheet.points[2].y];
        bg = [_sheet.points[3].x, _sheet.points[3].y];

        var toZoom = new OpenSeadragon.Rect(hg[0], hg[1], hd[0] - hg[0], bg[1] - hg[1]);
        $scope.osd.viewport.fitBoundsWithConstraints($scope.osd.viewport.imageToViewportRectangle(toZoom), true);
        e.preventDefaultAction = true;

      }}
    ]});

  }

  /**
  *  add event listener as soon as popup is displayed
  */

  $scope.onVisibleCallback = function($module) {

    console.log("visible");

    /** add delete sheet buttons event listeners */
    $('[aria-func=deleteSheet]').off("click");
    $('[aria-func=deleteSheet]').click(function() {

      $http.post(API + 'sheets/delete?access_token=' + $rootScope.auth_token, {
        sheetId: $(this).attr('aria-data')
      }).then(function(r) {

        var ids = $scope.currentId.split("-");
        var id = 'sheet-' + ids[1] + '-' + ids[2];


        for(var x in $scope.document._pages[$scope.currentPage]._sheets) {
          if($scope.document._pages[$scope.currentPage]._sheets[x].id == $(this).attr('aria-data')) {
            $scope.document._pages[$scope.currentPage]._sheets.splice(x, 1);
            break;
          }
        }

        var deleteId = function(id) {
          for(var x in $scope.overlays[$scope.currentPage]) {
            if($scope.overlays[$scope.currentPage][x].id == id || ($scope.overlays[$scope.currentPage][x].hasOwnProperty('sheetId') && $scope.overlays[$scope.currentPage][x].sheetId == id)) {
              $scope.overlays[$scope.currentPage].splice(x, 1);
              deleteId(id);
              break;
            }
          }
        }

        deleteId(id);

        if(!$scope.$$phase) $scope.$apply();

        $('#' + id).popup('hide');
        $scope.osd.goToPage($scope.currentPage);

      }, function(e) {

        $rootScope.error = {
          title: "Oops! Une erreur s'est produite",
          description: "Impossible de supprimer la fiche d'annotation",
          canClose: true
        }

        $('#error').modal({
          closable: $rootScope.error.canClose
        }).modal('show');

      });

    });

    /** add delete area buttons event listeners */
    $('[aria-func=deleteArea]').off("click");
    $('[aria-func=deleteArea]').click(function() {

      var area_id = $(this).attr('aria-data');

      $http.post(API + 'areas/delete?access_token=' + $rootScope.auth_token, {
        areaId: area_id
      }).then(function(r) {

        var id = $scope.currentId.split("-");
        for(var x in $scope.document._pages[$scope.currentPage]._sheets[id[2]]._areas) {
          if($scope.document._pages[$scope.currentPage]._sheets[id[2]]._areas[x].id == area_id) {
            $scope.document._pages[$scope.currentPage]._sheets[id[2]]._areas.splice(x, 1);
            break;
          }
        }

        for(var x in $scope.overlays[$scope.currentPage]) {

          console.log(area_id);
          if($scope.overlays[$scope.currentPage][x].hasOwnProperty("areaId")) console.log($scope.overlays[$scope.currentPage][x].areaId);

          if($scope.overlays[$scope.currentPage][x].hasOwnProperty("areaId") && $scope.overlays[$scope.currentPage][x].areaId == area_id) {
            console.log($scope.overlays[$scope.currentPage][x].id);
            $scope.osd.removeOverlay($scope.overlays[$scope.currentPage][x].id);
            $scope.overlays[$scope.currentPage].splice(x, 1);
            break;
          }
        }

        if(!$scope.$$phase) $scope.$apply();
        $scope.updatePopup();

      }, function(e) {

        $rootScope.error = {
          title: "Oops! Une erreur s'est produite",
          description: "Impossible de supprimer la fiche d'annotation",
          canClose: true
        }

        $('#error').modal({
          closable: $rootScope.error.canClose
        }).modal('show');

      });

    });

    /** add delete annotation buttons event listeners */
    $('[aria-func=deleteAnnot]').off("click");
    $('[aria-func=deleteAnnot]').click(function() {

      var annotId = $(this).attr('aria-data');

      $http.post(API + 'manualannotations/remove?access_token=' + $rootScope.auth_token, {
        annotId: $(this).attr('aria-data')
      }).then(function(r) {

        var id = $scope.currentId.split("-");
        for(var x in $scope.document._pages[$scope.currentPage]._sheets[id[2]]._areas[id[3]]._annotations) {
          if($scope.document._pages[$scope.currentPage]._sheets[id[2]]._areas[id[3]]._annotations[x].id == annotId) {
            $scope.document._pages[$scope.currentPage]._sheets[id[2]]._areas[id[3]]._annotations.splice(x, 1);
            break;
          }
        }

        if(!$scope.$$phase) $scope.$apply();
        $scope.updatePopup();

      }, function(e) {

        $rootScope.error = {
          title: "Oops! Une erreur s'est produite",
          description: "Impossible de supprimer la fiche d'annotation",
          canClose: true
        }

        $('#error').modal({
          closable: $rootScope.error.canClose
        }).modal('show');

      });

    });

    /** add add annotation buttons event listeners */
    $('[aria-func=addAnnot]').off("click");
    $('[aria-func=addAnnot]').click(function() {

      console.log("clicked");

      area_id = $(this).attr('aria-data');
      val = $(this).prev().val();

      console.log("area_id : " + area_id);
      console.log("l'annotation est : " + val);

      $(this).addClass('loading');
      $scope.addAnnotation(area_id, val);
      $(this).removeClass('loading');

      $(this).prev().val('');

    });

    $('[aria-func=addField]').off("click");
    $('[aria-func=addField]').click(function() {

      console.log("clicked");

      fieldType = $(this).attr('aria-data');
      sheetId = $scope.currentSheet.id;
      var id = $scope.currentId.split("-");

      $http.post(API + 'areas/add?access_token=' + $rootScope.auth_token, {
        points : $scope.currentSheet.points,
        fieldTypeId : fieldType,
        sheetId : sheetId
      }).then(function(r2) {

        $http.get(API + 'sheets/' + sheetId + '/areas').then(function(r) {

          $scope.document._pages[id[1]]._sheets[id[2]]._areas = r.data;
          $scope.currentSheet._areas = r.data;

          if(!$scope.$$phase) $scope.$apply();
          $scope.updatePopup();

        }, function(p) {

          $rootScope.error = {
            title: "Oops! Une erreur s'est produite",
            description: "Impossible de créer le champ",
            canClose: true
          }

          $('#error').modal({
            closable: $rootScope.error.canClose
          }).modal('show');

        });

      }, function(p) {

        $rootScope.error = {
          title: "Oops! Une erreur s'est produite",
          description: "Impossible de créer le champ",
          canClose: true
        }

        $('#error').modal({
          closable: $rootScope.error.canClose
        }).modal('show');

      });

    });
  };

  /** generates popup content */
  /** for some reason we couldn't use angular preformated popups because OSD is taking the focus */

  $scope.popupContent = function() {

    console.log("popupContent");
    console.log("CURRENT: ", $scope.currentSheet);;

    var html = `<div class="header"><h3>${$scope.currentSheet.name}</h3></div><div id="annotations">
      <div class="ui feed">`;

    selected = {
      original: $scope.currentSheet,
      areas: {},
      fieldTypes: []
    }

    var sheetType;
    for (var x in DOCUMENT_TYPES[$scope.document.type].sheetTypes) {
      if(DOCUMENT_TYPES[$scope.document.type].sheetTypes[x].name == $scope.currentSheet.name) sheetType = DOCUMENT_TYPES[$scope.document.type].sheetTypes[x];
    }

    for(var x in sheetType.fieldTypes) {
      console.log("SHHET TYPE ", sheetType);
      selected.fieldTypes.push(sheetType.fieldTypes[x].name);
      selected.areas[sheetType.fieldTypes[x].name] = [];
    }

    for(var x in $scope.currentSheet._areas) {
      var a = $scope.currentSheet._areas[x];
      console.log("SELECTED ", selected);
      console.log("A ", a);
      selected.areas[a.name].push(a);
    }

    for(ifield in selected.fieldTypes) {

      html += `<div class="ui horizontal divider"><h4>${selected.fieldTypes[ifield]}${(selected.areas[selected.fieldTypes[ifield]].length > 1) ? 's' : ''}</h4></div>`;

      for(var x in selected.areas[selected.fieldTypes[ifield]]) {

        var area = selected.areas[selected.fieldTypes[ifield]][x];
        var annots = area._annotations;

        if(selected.fieldTypes.indexOf(area.name) == -1) continue;

        var fieldType_type = "text";
        for(var i in DOCUMENT_TYPES[$scope.document.type].fieldType) {
          if(DOCUMENT_TYPES[$scope.document.type].fieldType[i].name == area.name) fieldType_type = DOCUMENT_TYPES[$scope.document.type].fieldType[i].type;
        }

        html += `<div class="event">
          <div class="content">
            <div class="summary">
              <div class="header">${area.name}`;

        if($rootScope.user.type == 'Moderator' || $rootScope.user.type == 'Administrator') html += `&nbsp;<a aria-func="deleteArea" aria-data="${area.id}">(Supprimer)</a>`;

        html += `</div>
              <small>${annots.length} annotation${(annots.length > 1) ? 's' : ''}</small>
            </div>
            <div class="extra text">
              <ul>`;

        for(var i = 0; i < annots.length; i++) {

          a = annots[i];
          html += `<li>`;

          html += `<small>${(a.username) ? a.username : DOCUMENT_TYPES[$scope.document.type].defaultContributor}`;
          if(a.username && (($rootScope.user.type == 'Moderator' || $rootScope.user.type == 'Administrator') || ($rootScope.user.loggedIn && $rootScope.user.id == a.userId))) html += `&nbsp;<a aria-func="deleteAnnot" aria-data="${a.id}">(Supprimer)</a>`;

          if(a.date) html += ` - ${new Date(a.date).ddmmyyyy()}`;
          html += `&nbsp;:</small>`;

          html += `<p>${a.text}</p>
          </li>`;

        }

        html += `</ul>
            </div>
            <div class="meta">`;

        if($rootScope.user.loggedIn) html += `<form class="ui form"><strong>Ajouter une annotation</strong><div class="ui inline field">
              <input type="${fieldType_type}" alt="" />&nbsp;<button class="ui primary button" aria-func="addAnnot" aria-data="${area.id}">Ajouter</button>
            </div></form>`;

        html += `</div>
          </div>
        </div>`;

      }

      if($rootScope.user.loggedIn && (sheetType.fieldTypes[ifield].number == -1 || sheetType.fieldTypes[ifield].number > selected.areas[selected.fieldTypes[ifield]].length)) html += `<button class="ui primary button" aria-func="addField" aria-data="${sheetType.fieldTypes[ifield].id}">Ajouter un ${selected.fieldTypes[ifield]}</button>`

    }

    html += `</div></div>`;

    if($rootScope.user.type == 'Moderator' || $rootScope.user.type == 'Administrator') html += `<a class="ui button" aria-func="deleteSheet" aria-data="${$scope.currentSheet.id}">Supprimer ${$scope.currentSheet.name}</a>`;

    return html + `<a class="ui button" onclick="$('.sheet').popup('hide');">Fermer</a>`;

  }

  /** updates popup content */

  $scope.updatePopup = function() {

    console.log("updatePopup");
    var html = $scope.popupContent();

    var ids = $scope.currentId.split("-");

    $('#sheet-' + ids[1] + '-' + ids[2]).popup('change content', html);
    $scope.onVisibleCallback();

  };

  /** displays popup */

  $scope.showPopup = function() {

    var ids = $scope.currentId.split("-");
    $('#sheet-' + ids[1] + '-' + ids[2]).popup('show');
    $scope.updatePopup();

  }

  /** updates popup each time the current user or doc is updated */
  $scope.$watch('document', $scope.updatePopup, true);
  $scope.$watch('user', $scope.updatePopup, true);

  /**
  *  Add an annotation
  */

  $scope.addAnnotation = function(area_id, val) {

    console.log("addAnnotation");

    if($rootScope.user == null) {

      $rootScope.error = {
        title: "Oops! Action non autorisée.",
        description: "Vous devez être connecté pour pouvoir ajouter une annotation.",
        canClose: true
      }

      $('#loader').hide();

      $('#error').modal({
        closable: $rootScope.error.canClose
      }).modal('show');

    } else {

      $http.post(API + 'manualannotations/add?access_token=' + $rootScope.auth_token, {
        areaId : area_id,
        text : val,
        userId : $rootScope.user.id,
        username: $rootScope.user.name,
        userType : $rootScope.user.type
      }).then(function(p) {

        annot = p.data;
        annot.areaId = area_id;

        var id = $scope.currentId.split("-");
        for(var w in $scope.document._pages[id[1]]._sheets[id[2]]._areas) {
          if($scope.document._pages[id[1]]._sheets[id[2]]._areas[w].id == area_id) {
            $scope.document._pages[id[1]]._sheets[id[2]]._areas[w]._annotations.push(annot);
            break;
          }
        }

      }, function(p) {
        console.log("probleme : " + $rootScope.auth_token);

        $rootScope.error = {
          title: "Oops! Une erreur s'est produite",
          description: "Impossible d'ajouter l'annotation.",
          canClose: true
        }

        $('#error').modal({
          closable: $rootScope.error.canClose
        }).modal('show');

      });

    }

  }

  $scope.goSimilar = function(sheet) {
    $location.path('/documents/' + sheet.documentId + '/' + sheet.pageId + '/' + sheet.areaId);
  };

});
