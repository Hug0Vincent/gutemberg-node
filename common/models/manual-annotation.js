'use strict';

module.exports = function(Manualannotation) {

  Manualannotation.once('dataSourceAttached', function(obj) {

    Manualannotation.add = function(annot, callback) {

      var MyUser = Manualannotation.app.models.MyUser;
      var Area = Manualannotation.app.models.Area;
      var Sheet = Manualannotation.app.models.Sheet;
      var Page = Manualannotation.app.models.Page;
      var Document = Manualannotation.app.models.Document;
      var MyUser = Manualannotation.app.models.MyUser;
      var Moderator = Manualannotation.app.models.Moderator;
      var Administrator = Manualannotation.app.models.Administrator;

      annot.userType = "MyUser";

      Manualannotation.create({
        text: annot.text,
        date: Date.now(),
        username: annot.username,
        modifiable: true
      }).then(function(annotation){

        var sheets = [];
        var page;
        var user;

        var findUser = function(fullfill, reject){
          if(annot.userType == 'MyUser')
            MyUser.findById(annot.userId).then(function(u){
              user = u;
              fullfill();
            });
          else if (annot.userType == 'Moderator')
            Moderator.findById(annot.userId).then(function(u){
              user = u;
              fullfill();
            });
          else if (annot.userType == 'Administrator')
            Administrator.findById(annot.userId).then(function(u){
              user = u;
              fullfill();
            });
        };

        var sheetRec = function(sheetId, fullfill, reject) {
          Sheet.findById(sheetId).then(function(sheet) {

            sheets.push(sheet);

            if(sheet.$parent == 'Page') Page.findById(sheet.parentId).then(function(p) {
              page = p;
              fullfill();
            }); else sheetRec(sheet.parentId, fullfill, reject);

          });
        };

          Area.findById(annot.areaId).then(function(area) {

            new Promise(function(fullfill, reject) {
              sheetRec(area.sheetId, fullfill, reject);
            }).then(function() {
              Document.findById(page.documentId).then(function(doc) {
                new Promise(function(fullfill, reject){
                  findUser(fullfill, reject);
                }).then(function(){
                  console.log(user);
                  annotation.user(user);
                  annotation.area(area);
                  annotation.save();

                  area.annotations.create(annotation);
                  area.save();

                  for(var s in sheets) {

                    if(s == 0) sheets[s].areas.updateById(annot.areaId, area);
                    else sheets[s].sheets.updateById(sheets[s - 1].id, sheets[s - 1]);

                    sheets[s].save();

                  }

                  page.sheets.updateById(sheets[sheets.length - 1].id, sheets[sheets.length - 1]);
                  page.save();

                  doc.pages.updateById(page.id, page);
                  doc.save();
                });
              });
            });

        });

        callback(null, annotation);

      });

    };

    Manualannotation.remove = function(annot, callback) {

      var MyUser = Manualannotation.app.models.MyUser;
      var Area = Manualannotation.app.models.Area;
      var Sheet = Manualannotation.app.models.Sheet;
      var Page = Manualannotation.app.models.Page;
      var Document = Manualannotation.app.models.Document;

      Manualannotation.findById(annot.annotId).then(function(an){
        Manualannotation.destroyAll({id: annot.annotId});
        Area.findById(an.areaId).then(function(a){
          var sheets = [];
          var page;

          var sheetRec = function(sheetId, fullfill, reject){
            Sheet.findById(sheetId).then(function(sheet){
              sheets.push(sheet);
              if(sheet.$parent == 'Page')
                Page.findById(sheet.parentId).then(function(p){
                  page = p;
                  fullfill();
                });
              else
                sheetRec(sheet.parentId, fullfill, reject);
            });
          };

          new Promise(function(fullfill, reject){
            sheetRec(a.sheetId, fullfill, reject);
          }).then(function(){
            Document.findById(page.documentId).then(function(doc){

              a.annotations.unset(annot.annotId);

              for(var s in sheets){
                if(s == 0)
                  sheets[s].areas.updateById(an.areaId, a);
                else
                  sheets[s].sheets.updateById(sheets[s - 1].id, sheets[s - 1]);
                sheets[s].save();
              }

              page.sheets.updateById(sheets[sheets.length - 1].id, sheets[sheets.length - 1]);
              page.save();

              doc.pages.updateById(page.id, page);
              doc.save();
            });
          });
        });
      callback(null, {"ok":"ok"});
      });
    };

    Manualannotation.remoteMethod('add', {
      accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
      description: "Recursively adds manual annotation to the document",
      returns: {
        arg: 'body',
        root: true,
        type: 'object'
      }
    });

    Manualannotation.remoteMethod('remove', {
      accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
      description: "Recursively adds manual annotation to the document",
      returns: {
        arg: 'body',
        root: true,
        type: 'object'
      }
    });


  });

};
