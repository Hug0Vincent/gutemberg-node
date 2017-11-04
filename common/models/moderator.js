'use strict';

var config = require('../../server/config.json');
var path = require('path');


module.exports = function(Moderator) {
  Moderator.afterRemote('create', function(context, userInstance, next) {
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
      user: Moderator
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
    Moderator.upgrade = function(user, callback) {
      var MyUser = Moderator.app.models.MyUser;
      var Administrator = Moderator.app.models.Administrator;
      MyUser.findById(user.id).then(function(userFind){
        if(userFind!=null){
          userFind.destroy().then(function(){
            Moderator.create(userFind).then(function(mod){
              callback(null, mod);
            });
          });

        } else {
          Administrator.findById(user.id).then(function(adminFind){
            if(adminFind!=null){
              adminFind.destroy().then(function(){
                Moderator.create(adminFind).then(function(mod){
                  callback(null, mod);
                });
              });

            }else{
              var err = new Error;
              err.name = "Bad id";
              err.message = "Bad id - user not found";
              callback(null, err);
            }
          });

        }
      });
    };
    Moderator.remoteMethod('upgrade', {
      accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
      description: "Upgrade a user into a moderator",
      returns: {
        arg: 'body',
        root: true,
        type: 'object'
      }
    });
};
