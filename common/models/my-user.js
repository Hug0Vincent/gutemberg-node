'use strict';

var config = require('../../server/config.json');
var path = require('path');

module.exports = function(Myuser) {
  //send verification email after registration
  /*Myuser.afterRemote('create', function(context, userInstance, next) {
    console.log('> user.afterRemote triggered');

    var options = {
      type: 'email',
      to: userInstance.email,
      from: 'noreply@loopback.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/',
      host: "node.gutemberg.ovh",
      protocol: "http",
      port: 80,
      user: Myuser
    };

    userInstance.verify(options, function(err, response, next) {
      console.log('----------email confirmation---------');
      //if (err) return next(err);

      console.log('> verification --------- email sent:', response);


      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' -
            'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });*/
  

  Myuser.upgrade = function(user, callback) {
    var Administrator = Myuser.app.models.Administrator;
    var Moderator = Myuser.app.models.Moderator;
    Moderator.findById(user.id).then(function(modFind){
      if(modFind==null){
        Administrator.findById(user.id).then(function(adminFind){
          if(adminFind != null){
            adminFind.destroy().then(function(){
              Myuser.create(adminFind).then(function(Myuser){
                if(Myuser != null){

                  callback(null, Myuser);
                } else {
                    var err = new Error;
                    err.name = "Bad id";
                    err.message = "Bad id - user not found";
                    callback(null, err)
                }
              });
            });

          } else {
              var err = new Error;
              err.name = "Bad id";
              err.message = "Bad id - user not found";
              callback(null, err)
          }
        });
      }else{
        modFind.destroy();
        Myuser.create(modFind).then(function(Myuser){
          if(Myuser != null){
            modFind.destroy().then(function(){
              callback(null, Myuser);
            });

          } else {
              var err = new Error;
              err.name = "Bad id";
              err.message = "Bad id - user not found";
              callback(null, err)
          }

        });
      }
    });
  };
  Myuser.remoteMethod('upgrade', {
    accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
    description: "Upgrade a user into a User",
    returns: {
      arg: 'body',
      root: true,
      type: 'object'
    }
  });
};
