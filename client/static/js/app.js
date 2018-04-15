/**
*
*   Gutemberg
*   @author adrien-thebault
*
*/

/**
* Constants
**/

var API = '/api/';
var API_TIMEOUT = 3*1000;
var IMG_URL = 'http://localhost:8900/images/';
var DOCUMENT_TYPES = {};

/*
* Load app config before anything else
*/

new Promise(function(fullfill, reject) {
  $.get(API + 'DocumentTypes', function(r) {

    console.log(r);

    for(var i in r) DOCUMENT_TYPES[r[i].name] = r[i];
    console.log(DOCUMENT_TYPES);
    fullfill();

  }).fail(function(e) {

    $('body').html('<h1>Could not load app, please retry');

  });
}).then(function() {
  angular.bootstrap(document, ['app'])
});

/**
* Gutemberg
**/

var app = angular.module("app", ['ngSanitize', 'ngRoute', 'LocalStorageModule']);
var load_promises = [];

app.config(function($routeProvider, $locationProvider, $httpProvider) {

  /** Routing */

  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'homeController'
  }).when('/search/:terms', {
    templateUrl: 'search.html',
    controller: 'searchController'
  }).when('/adv_search/:terms/:doctype/:dateFilterType/:date0/:date1', {
    templateUrl: 'search.html',
    controller: 'searchController'
  }).when('/adv_search/:terms/:doctype/:dateFilterType/:date0', {
    templateUrl: 'search.html',
    controller: 'searchController'
  }).when('/documents/:id', {
    templateUrl: 'documents.html',
    controller: 'documentsController'
  }).when('/documents/:id/:page', {
    templateUrl: 'documents.html',
    controller: 'documentsController'
  }).when('/documents/:id/:page/:area', {
    templateUrl: 'documents.html',
    controller: 'documentsController'
  }).when('/admin', {
    templateUrl: 'admin.html',
    controller: 'adminController'
  }).otherwise({
    redirectTo: '/404'
  });

  /** HTTP */

  $httpProvider.defaults.cache = false;

});

app.run(function($rootScope, $http, localStorageService) {

  /** if user is logged in, just load back its account */

  $rootScope.user_loaded = false;

  $rootScope.user = {
    loggedIn: true,
<<<<<<< HEAD
    email: 'cadioumaxime@gmail.com',
    password: '1234',
    name: 'Maxime',
    job: 'Etudiant',
    type: 'Administrator'
=======
    email: null,
    password: null,
    name: null,
    job: null,
    type: null
>>>>>>> 5a8f77e2653f712887d998a0e878a85d97c609ea
  };

  var tmp_user = localStorageService.get('user');

  if(tmp_user != null) {

    /**
    *
    *   we try to login again with saved credentials to avoid
    *   deleted accounts to stay logged in
    *
    */

    $http.post(API + tmp_user.type + 's/login', { email: tmp_user.email, password: tmp_user.password }).then(function(r) {

      $rootScope.auth_token = r.data.id;
      console.log("test r datat id : " + r.data.id);

      $http.get(API + tmp_user.type + 's/' + r.data.userId + '?access_token=' + $rootScope.auth_token).then(function(ru) {

        ru.data.password = tmp_user.password;
        $rootScope.user = ru.data;
        $rootScope.user.loggedIn = true;
        $rootScope.user.type = tmp_user.type;

        localStorageService.set('user', $rootScope.user);
        $rootScope.user_loaded = true;

      }, function() {

        localStorageService.set('user', null);
        $rootScope.user_loaded = true;

        $rootScope.error = {
          title: "Connexion impossible",
          description: "Ce compte utilisateur ne semble pas exister.",
          canClose: true
        }

        $('#error').modal({
          closable: $rootScope.error.canClose
        }).modal('show');

        $rootScope.user = {
          loggedIn: false,
          email: null,
          password: null,
          name: null,
          job: null,
          type: null
        };

      });

    }, function(e) {

      localStorageService.set('user', null);
      $rootScope.user_loaded = true;

      $rootScope.error = {
        title: "Connexion impossible",
        description: "Ce compte utilisateur ne semble pas exister.",
        canClose: true
      }

      $('#error').modal({
        closable: $rootScope.error.canClose
      }).modal('show');

      $rootScope.user = {
        loggedIn: false,
        email: null,
        password: null,
        name: null,
        job: null,
        type: null
      };

    });

  } else $rootScope.user_loaded = true;

  /** Show login modal */

  $rootScope.login = function() {

    $('#loginModal').modal('show');
    $('#registerModal').modal('hide');

  }

  $rootScope.loginTest = function() {

        console.log('--------------------');

      }

  /** Show register modal */

  $rootScope.register = function() {

    $('#registerModal').modal('show');
    $('#loginModal').modal('hide');

  }

  /**
  *   fetch user account
  *   "user_types" must stay empty at function call (ie. $rootScope.doLogin())
  */

  $rootScope.doLogin = function(user_types) {
    console.log("doLogin")


    if(typeof user_types == 'undefined') user_types = ["MyUser", "Moderator", "Administrator"];
    var user_type = user_types.shift();
    console.log("user type "+user_type);
    $('#loader').show();

    /**
    *
    *   this function first tries to log as a normal user, it it does not work
    *   it then tries to log as a moderator and finally as an administrator
    *
    */

    // first access_token
    console.log("mail : " + $rootScope.user.email+" password : "+$rootScope.user.password);
    $http.post(API + user_type + 's/login', { email: $rootScope.user.email, password: $rootScope.user.password }).then(function(r) {

      console.log("r "+r);
      $rootScope.auth_token = r.data.id;


      // then get user info
      $http.get(API + user_type + 's/' + r.data.userId + '?access_token=' + $rootScope.auth_token).then(function(ru) {

        ru.data.password = $rootScope.user.password;
        $rootScope.user = ru.data;
        $rootScope.user.loggedIn = true;
        $rootScope.user.type = user_type;

        localStorageService.set('user', $rootScope.user);

        $rootScope.success = {
          title: "Connexion réussie.",
          description: "Vous êtes à présent connecté !",
          canClose: true
        }

        $('#success').modal({
          closable: $rootScope.success.canClose
        }).modal('show');

      }, function() {

        // as long as we have not tried all the user types, try again with what's left
        if(user_types.length > 0) $rootScope.doLogin(user_types);
        else {

          $rootScope.error = {
            title: "Connexion impossible",
            description: "Veuillez vérifier vos identifiants.",
            canClose: true
          }

          $('#error').modal({
            closable: $rootScope.error.canClose
          }).modal('show');

        }

      });

    }, function(e) {

      // as long as we have not tried all the user types, try again with what's left
      if(user_types.length > 0) $rootScope.doLogin(user_types);
      else {

        $rootScope.error = {
          title: "Connexion impossible",
          description: (e.data.error) ? e.data.error.message : "Veuillez vérifier vos identifiants.",
          canClose: true
        }

        $('#error').modal({
          closable: $rootScope.error.canClose
        }).modal('show');

      }

    });

    $('#loader').hide();

  }

  /**
  *
  *   Register user
  *
  */

  $rootScope.doRegister = function() {
    console.log("doRegister")
    console.log("rootScope : "+$rootScope.user.email+$rootScope.user.password+"<");

    $('#loader').show();

    $http.post(API + 'MyUsers', {
      email: $rootScope.user.email,
      password: $rootScope.user.password,
      name: $rootScope.user.name,
      job: $rootScope.user.job
    }).then(function() {

      $rootScope.success = {
        title: "Inscription réussie.",
        description: "Un e-mail vous a été envoyé afin de valider votre compte, cliquez sur le lien de validation, puis connectez-vous.",
        canClose: true
      }

      $('#success').modal({
        closable: $rootScope.success.canClose
      }).modal('show');

    }, function(e) {

      $rootScope.error = {
        title: "Inscription impossible",
        description: (e.data.error) ? e.data.error.message : "Veuillez ré-essayer plus tard.",
        canClose: true
      }

      $('#error').modal({
        closable: $rootScope.error.canClose
      }).modal('show');

    });

    $('#loader').hide();

  }

  /**
  *
  *   Log out
  *
  */

  $rootScope.logout = function() {

    localStorageService.set('user', null);
    localStorageService.set('auth_token', null);

    $rootScope.user = {
      loggedIn: false,
      email: null,
      password: null,
      name: null,
      job: null,
      type: null
    };


    $rootScope.auth_token = null;
    //$rootScope.auth_token = $rootScope.user.loggedIn;

  }

});

/**
*
*   just a small function to display a date
*   as dd/mm/yyyy
*
*/

Date.prototype.ddmmyyyy = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
        ].reverse().join('/');
};
