/**
 *
 *  Controller for Gutemberg's home
 *  @author adrien-thebault
 *
 */

app.controller("homeController", function($scope, $rootScope, $location) {

  /** init variables */

  $rootScope.pageTitle = 'Home';
  $scope.terms = '';

  $scope.advancedSearch = false;
  $scope.documentType = DOCUMENT_TYPES[Object.keys(DOCUMENT_TYPES)[0]].id;
  $scope.documentTypes = DOCUMENT_TYPES;
  $scope.documentTypeFilter = false;
  $scope.dateFilter = false;
  $scope.dateFilterType = "0";
  $scope.date0 = $scope.datea = $scope.dateb = $scope.datec = $scope.dated = $scope.date1 = $scope.datee = new Date();

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

    console.log(path);
    $location.path(path);

  };

});
