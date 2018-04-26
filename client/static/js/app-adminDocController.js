/**
 *
 *  Controller for Gutemberg's admin
 *  @author adrien-thebault
 *
 */



app.controller('adminDocController', ['$scope', '$rootScope', '$location', '$http', '$timeout', 'FileUploader', function($scope, $rootScope, $location, $http, $timeout, FileUploader){
          var uploader = $scope.uploader = new FileUploader({
              url: '/upload'
          });

          var uploaderConfig = $scope.uploaderConfig = new FileUploader({
              url: '/uploadConfig'
          });

/*
          $scope.load_config = function() {
              alert("called load_config");
              console.log(app);

              //$scope.app.models.DocumentType.load_json("/home/gutemberg/dev/gutemberg-node/configMatricule.json");
              $http.post(API + 'documenttypes/load_json?access_token=' + $rootScope.auth_token, {
                ('/home/gutemberg/dev/gutemberg-node/configMatricule.json').toJSON()
              }).then(function(p) {
                console.log("oui");


              }, function(p) {

                $rootScope.error = {
                  title: "Oops! Une erreur s'est produite",
                  description: "Impossible d'ajouter le fichier de configuration.",
                  canClose: true
                }

                $('#error').modal({
                  closable: $rootScope.error.canClose
                }).modal('show');

              });

          }
          */


      /** go to admin page */
    $scope.admin_annot = function() {
      $location.path('/admin_annot');
    }

    /** go to admin page */
    $scope.admin_document = function() {
      $location.path('/admin_document');
    }




  $scope.logoutAdmin = function() {
    $location.path('/');
    $rootScope.logout();
  }


          // FILTERS

          // a sync filter
          uploader.filters.push({
              name: 'syncFilter',
              fn: function(item /*{File|FileLikeObject}*/, options) {
                  console.log('syncFilter');
                  return this.queue.length < 10;
              }
          });

          // an async filter
          uploader.filters.push({
              name: 'asyncFilter',
              fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                  console.log('asyncFilter');
                  setTimeout(deferred.resolve, 1e3);
              }
          });

          uploader.filters.push({
            name: 'jsonFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|json|zip|'.indexOf(type) !== -1;
            }

        });


          // CALLBACKS

          uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
              console.info('onWhenAddingFileFailed', item, filter, options);
          };
          uploader.onAfterAddingFile = function(fileItem) {
              console.info('onAfterAddingFile', fileItem);
          };
          uploader.onAfterAddingAll = function(addedFileItems) {
              console.info('onAfterAddingAll', addedFileItems);
          };
          uploader.onBeforeUploadItem = function(item) {
              console.info('onBeforeUploadItem', item);
          };
          uploader.onProgressItem = function(fileItem, progress) {
              console.info('onProgressItem', fileItem, progress);
          };
          uploader.onProgressAll = function(progress) {
              console.info('onProgressAll', progress);
          };
          uploader.onSuccessItem = function(fileItem, response, status, headers) {
              console.info('onSuccessItem', fileItem, response, status, headers);
          };
          uploader.onErrorItem = function(fileItem, response, status, headers) {
            $rootScope.error = {
              title: "Oops! Une erreur s'est produite",
              description: "Format json ou zip",
              canClose: true
            }

            $('#loader').hide();
            $('#error').modal({
              closable: $rootScope.error.canClose
            }).modal('show');

              console.info('onErrorItem', fileItem, response, status, headers);
          };
          uploader.onCancelItem = function(fileItem, response, status, headers) {
              console.info('onCancelItem', fileItem, response, status, headers);
          };
          uploader.onCompleteItem = function(fileItem, response, status, headers) {
              console.info('onCompleteItem', fileItem, response, status, headers);
          };
          uploader.onCompleteAll = function() {
              console.info('onCompleteAll');
          };

          console.info('uploader', uploader);





//Uploader configuration

          uploaderConfig.filters.push({
            name: 'jsonFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|json|'.indexOf(type) !== -1;
            }
          });


          // CALLBACKS

          uploaderConfig.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
              console.info('onWhenAddingFileFailed', item, filter, options);
          };
          uploaderConfig.onAfterAddingFile = function(fileItem) {

          };
          uploader.onAfterAddingFile = function(fileItem) {

            if(uploader.queue.length > 1){
                uploader.queue.splice(0, uploader.queue.splice.length -1);
            }
            console.info('onAfterAddingFile', fileItem);
          };
          uploaderConfig.onAfterAddingAll = function(addedFileItems) {
              console.info('onAfterAddingAll', addedFileItems);
          };
          uploaderConfig.onBeforeUploadItem = function(item) {
              console.info('onBeforeUploadItem', item);
          };
          uploaderConfig.onProgressItem = function(fileItem, progress) {
              console.info('onProgressItem', fileItem, progress);
          };
          uploaderConfig.onProgressAll = function(progress) {
              console.info('onProgressAll', progress);
          };
          uploaderConfig.onSuccessItem = function(fileItem, response, status, headers) {
              console.info('onSuccessItem', fileItem, response, status, headers);
          };
          uploaderConfig.onErrorItem = function(fileItem, response, status, headers) {
              console.info('onErrorItem', fileItem, response, status, headers);
          };
          uploaderConfig.onCancelItem = function(fileItem, response, status, headers) {
              console.info('onCancelItem', fileItem, response, status, headers);
          };
          uploaderConfig.onCompleteItem = function(fileItem, response, status, headers) {
              console.info('onCompleteItem', fileItem, response, status, headers);
          };
          uploaderConfig.onCompleteAll = function() {
              console.info('onCompleteAll');
          };

          console.info('uploaderConfig', uploaderConfig);


}]);
