/**
 *
 *  Controller for Gutemberg's search results
 *  @author adrien-thebault
 *
 */

app.controller("searchController", function($scope, $rootScope, $location, $routeParams, $http) {

  /** init variables */

  $scope.params = $routeParams;

  $scope.terms = $scope.params.terms;
  $rootScope.pageTitle = $scope.params.terms;

  $scope.advancedSearch = false;
  $scope.documentType = DOCUMENT_TYPES[Object.keys(DOCUMENT_TYPES)[0]].id;
  $scope.documentTypes = DOCUMENT_TYPES;
  $scope.documentTypeFilter = false;
  $scope.dateFilter = false;
  $scope.dateFilterType = "0";
  $scope.date0 = $scope.datea = $scope.dateb = $scope.datec = $scope.dated = $scope.date1 = $scope.datee = new Date();

  $scope.lazyLoadDone = false;
  $scope._results = {};
  $scope.document_types = DOCUMENT_TYPES;
  $scope._colors = ["red","orange","yellow","olive","green","teal","blue","violet","purple","pink","brown","grey","black"];
  $scope.colors = {};

  var z = 0;
  for(var i in DOCUMENT_TYPES) {
    $scope._results[i] = { annots:[], docs:[] };
    $scope.colors[i] = $scope._colors[z];
    z++;
  }

  /** change date for the advanced search
  **  don't know why it doesn't work without that function */

  $scope.changeDate = function(i, val) {

    if(i == 0) $scope.date0 = $scope.datea = $scope.dateb = $scope.datec = $scope.dated = val;
    else $scope.date1 = $scope.datee = val;

  }

  /** performs search according to selected options **/

  $scope.search = function() {

    var path;

    if($scope.advancedSearch && ($scope.documentTypeFilter || $scope.dateFilter)) {

      path = '/adv_search/' + $scope.terms + '/' + (($scope.documentTypeFilter) ? $scope.documentType : '*') + '/';
      if($scope.dateFilter) {

        path += $scope.dateFilterType + '/';

        if($scope.dateFilterType != "2") path += $scope.date0.toISOString().slice(0, 10);
        else path += $scope.date0.toISOString().slice(0, 10) + '/' + $scope.date1.toISOString().slice(0, 10);

      } else path += '0/*';

    } else path = '/search/' + $scope.terms;

    $location.path(path);

  };

  /** get doctype name from doctype id */

  var doctypeFromId = function(id) {

    var doctype = null;
    for(i in DOCUMENT_TYPES) {
      if(DOCUMENT_TYPES[i].id == id) {
        doctype = DOCUMENT_TYPES[i].name;
        break;
      }
    }

    return doctype;

  }

  /** prepares search results so they can be displayed easily */

  $scope.results = function(r) {

    if (r.hits.total > 0) { // Checks if there is at least 1 document returned

      tmp_results = [];
      for(var i in DOCUMENT_TYPES) tmp_results[i] = { annots:[], docs:[] };

      for(var i = 0; i < r.hits.hits.doc.length; i++) {

        var doc = r.hits.hits.doc[i];
        tmp_results[doctypeFromId(doc.type)].docs.push(doc);

      }

      var split_terms = $scope.terms.split(" ");

      for(var i = 0; i < r.hits.hits.annot.length; i++) {

        var hit = r.hits.hits.annot[i];

        var word_pos = 0;

        for(x in split_terms) {

          word_pos = hit._source.text.indexOf(split_terms[x]);
          if(word_pos != -1) break;

        }

        var begin = Math.max(word_pos - 80, 0);
        var end = Math.min(hit._source.text.length, word_pos + 80);

        hit.source = hit._source.text.slice(begin, end);
        for(var t in split_terms) hit.source = hit.source.replace(new RegExp("(" + split_terms[t] + ")", 'g'), '<span>$1</span>');

        if(begin != 0) hit.source = "..." + hit.source;
        if(end != hit._source.text.length) hit.source = hit.source + "...";

        tmp_results[hit.document_type].annots.push(hit);

      }

      $scope.nb = r.hits.hits.annot.length + r.hits.hits.doc.length;
      $scope._results = tmp_results;

    } else {

      $scope.nb = 0;
      $scope._results = null;

    }

  };

  /** go to correct result page */

  $scope.go = function(hit) {
    $location.path('/documents/' + hit.document_id + '/' + hit.page_id + '/' + hit._source.areaId);
  }

  $scope.goDoc = function(id) {
    $location.path('/documents/' + id);
  }

  /** performs standard research */
  if(!$scope.params.hasOwnProperty("doctype")) {

    /** first, load 10 first results */
    $http.get(API + '/documents/all_search?text=' + $scope.terms + '&size=10').then(function(r) {

      $scope.results(r.data.result);

      /** then, load what's left */
      if(r.data.result.hits.total > 10) {

        $http.get(API + '/documents/all_search?text=' + $scope.terms + '&size=' + r.data.result.hits.total).then(function(r2) {
          $scope.results(r2.data.result);
          $scope.lazyLoadDone = true;
        }, function(r2) {

          $rootScope.error = {
            title: "Oops! Une erreur s'est produite",
            description: "Impossible de charger la totalité des résultats, certains résultats peuvent ne pas apparaître.",
            canClose: true
          }

          $('#loader').hide();

          $('#error').modal({
            closable: $rootScope.error.canClose
          }).modal('show');

        });

      } else $scope.lazyLoadDone = true;

    }, function(r) {

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

  /* advanced search */
  } else {

    /** restores settings */

    $scope.advancedSearch = true;
    $scope.documentType = $scope.params['doctype'];
    $scope.documentTypeFilter = ($scope.documentType != '*');

    if($scope.params['date0'] != '*') {

      $scope.dateFilter = true;
      $scope.dateFilterType = $scope.params['dateFilterType'];
      $scope.date0 = $scope.datea = $scope.dateb = $scope.datec = $scope.dated = new Date($scope.params['date0']);
      $scope.date1 = $scope.datee = ($scope.params.hasOwnProperty('date1')) ? new Date($scope.params['date1']) : new Date();

    } else $scope.dateFilterType = "-1";

    var date = ($scope.params['dateFilterType'] == 2) ? new Date($scope.params['date0']).toISOString().slice(0, 10) + ' ' + new Date($scope.params['date1']).toISOString().slice(0, 10) : (($scope.params['date0'] == '*') ? new Date().toISOString().slice(0, 10) : new Date($scope.params['date0']).toISOString().slice(0, 10));

    var path = "";

    if($scope.params['doctype'] != "*") path += "&type=" + $scope.params['doctype'];
    if($scope.params['date0'] != '*') path += '&range= ' + $scope.params['dateFilterType'] + '&date=' + (($scope.params['dateFilterType'] == 2) ? new Date($scope.params['date0']).toISOString().slice(0, 10) + ' ' + new Date($scope.params['date1']).toISOString().slice(0, 10) : new Date($scope.params['date0']).toISOString().slice(0, 10));

    /** same as standard search */
    $http.get(API + '/documents/all_advanced_search?text=' + $scope.terms + '&size=10' + path).then(function(r) {

      $scope.results(r.data.result);

      if(r.data.result.hits.total > 10) {

        $http.get(API + '/documents/all_advanced_search?text=' + $scope.terms + '&size=' + r.data.result.hits.total + path).then(function(r2) {
          $scope.results(r2.data.result);
          $scope.lazyLoadDone = true;
        }, function(r2) {

          $rootScope.error = {
            title: "Oops! Une erreur s'est produite",
            description: "Impossible de charger la totalité des résultats, certains résultats peuvent ne pas apparaître.",
            canClose: true
          }

          $('#loader').hide();

          $('#error').modal({
            closable: $rootScope.error.canClose
          }).modal('show');

        });

      } else $scope.lazyLoadDone = true;

    }, function(r) {

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

  }

});
