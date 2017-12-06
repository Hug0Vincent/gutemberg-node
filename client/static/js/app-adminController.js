/**
 *
 *  Controller for Gutemberg's admin
 *  @author adrien-thebault
 *
 */

app.controller("adminController", function($scope, $rootScope, $location, $http, $timeout) {

  /** init variables */

  $rootScope.pageTitle = 'Administration';

  $scope.users = [];
  $scope.moderators = [];
  $scope.administrators = [];

  /** load data */

  $scope.load = function() {

    /** load users */

    $http.get(API + 'myusers?access_token=' + $rootScope.auth_token).then(function(r) {
      $scope.users = r.data;
    }, function(e) {

      $rootScope.error = {
        title: "Oops! Une erreur s'est produite",
        description: "Impossible de récupérer la liste des utilisateurs",
        canClose: true
      }

      $('#loader').hide();
      $('#error').modal({
        closable: $rootScope.error.canClose
      }).modal('show');

    });

    /** load moderators */

    $http.get(API + 'moderators?access_token=' + $rootScope.auth_token).then(function(r) {
      $scope.moderators = r.data;
    }, function(e) {

      $rootScope.error = {
        title: "Oops! Une erreur s'est produite",
        description: "Impossible de récupérer la liste des modérateurs",
        canClose: true
      }

      $('#loader').hide();
      $('#error').modal({
        closable: $rootScope.error.canClose
      }).modal('show');

    });

    /** load administrators */

    $http.get(API + 'administrators?access_token=' + $rootScope.auth_token).then(function(r) {
      $scope.administrators = r.data;
    }, function(e) {

      $rootScope.error = {
        title: "Oops! Une erreur s'est produite",
        description: "Impossible de récupérer la liste des administrateurs",
        canClose: true
      }

      $('#loader').hide();
      $('#error').modal({
        closable: $rootScope.error.canClose
      }).modal('show');

    });
  }

  /** promote user to given type */

  $scope.promoteTo = function(type, id) {
    $('#content .segment').addClass('loading');
    $http.post(API + type + 's/upgrade?access_token=' + $rootScope.auth_token, {
      id: id
    }).then(function(r) {

      $('#content .segment').removeClass('loading');
      $scope.load();

    }, function(e) {

      $('#content .segment').removeClass('loading');

      $rootScope.error = {
        title: "Oops! Une erreur s'est produite",
        description: "Impossible de promouvoir l'utilisateur",
        canClose: true
      }

      $('#loader').hide();
      $('#error').modal({
        closable: $rootScope.error.canClose
      }).modal('show');

    })
  }

  /** deletes user of a given type */

  $scope.delete = function(type, id) {
    $('#content .segment').addClass('loading');
    $http.delete(API + type + 's/' + id + '?access_token=' + $rootScope.auth_token).then(function(r) {

      $('#content .segment').removeClass('loading');
      $scope.load();

    }, function(e) {

      $('#content .segment').removeClass('loading');

      $rootScope.error = {
        title: "Oops! Une erreur s'est produite",
        description: "Impossible de supprimer l'utilisateur",
        canClose: true
      }

      $('#loader').hide();
      $('#error').modal({
        closable: $rootScope.error.canClose
      }).modal('show');

    });
  }

  $scope.logoutAdmin = function() {
    $location.path('/');
    $rootScope.logout();
  }

  /** start loading as soon as current user has been retrieved */

  $scope.timeout = function() {

    if($rootScope.user_loaded) {

      $('#content .segment').removeClass('loading');

      if($rootScope.user.type != 'Administrator') $location.path('/');
      else $scope.load();

    } else {
      Console.load(">-----timeout");
      $timeout($scope.timeout, 100);
    }
  };

  $('#content .segment').addClass('loading');
  $scope.timeout();

});
