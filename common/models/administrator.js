'use strict';

var config = require('../../server/config.json');
var path = require('path');

module.exports = function(Administrator) {
  Administrator.afterRemote('create', function(context, userInstance, next) {
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
      user: Administrator
    };

    userInstance.verify(options, function(err, response, next) {
      if (err) return next(err);

      console.log('> verification --------- email sent:', response);


      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' -
            'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });

  Administrator.upgrade = function(user, callback) {
    var MyUser = Administrator.app.models.MyUser;
    var Moderator = Administrator.app.models.Moderator;
    MyUser.findById(user.id).then(function(userFind){
      if(userFind==null){
        Moderator.findById(user.id).then(function(modFind){
          if(modFind != null){
            modFind.destroy().then(function(){
              Administrator.create(modFind).then(function(admin){
                if(admin != null){

                  callback(null, admin);
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
        userFind.destroy().then(function(){
          Administrator.create(userFind).then(function(admin){
            if(admin != null){

              callback(null, admin);
            } else {
                var err = new Error;
                err.name = "Bad id";
                err.message = "Bad id - user not found";
                callback(null, err)
            }

          });
        });

      }
    });
  };
  Administrator.remoteMethod('upgrade', {
    accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
    description: "Upgrade a user into a Administrator",
    returns: {
      arg: 'body',
      root: true,
      type: 'object'
    }
  });

};
