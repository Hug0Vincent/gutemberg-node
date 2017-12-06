'use strict';

module.exports = function(Area) {

	Area.add = function(area, callback){

		  var Page = Area.app.models.Page;
      var Document = Area.app.models.Document;
      var Sheet = Area.app.models.Sheet;
      var FieldType = Area.app.models.FieldType;

      if(area.points.length == 4){
        Area.create({
      		modifiable: (area.modifiable || true),
      		points: area.points,
          name: "",
      	}).then(function(a){

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
      		}

      		new Promise(function(fullfill, reject){
      			sheetRec(area.sheetId, fullfill, reject);
      		}).then(function(){
      			Document.findById(page.documentId).then(function(doc){
              console.log(area.fieldTypeId);
              FieldType.findById(area.fieldTypeId).then(function(ft){
        				a.sheet(sheets[0]);
                a.fieldtype(ft);
                a.name = ft.name;
        				a.save();

                for(var s in sheets) {
                  if(s == 0)
                  	sheets[s].areas.create(a);
                  else
                   	sheets[s].sheets.updateById(sheets[s - 1].id, sheets[s - 1]);
                  sheets[s].save();
                }

                page.sheets.updateById(sheets[sheets.length - 1].id, sheets[sheets.length - 1]);
                page.save();

                doc.pages.updateById(page.id, page);
                doc.save();

								callback(null, a);

              });
      			});
      		});
      	});
    }else
      callback(null, {Error: "Not enough points"});
	}


    Area.delete = function(area, callback){

      var Page = Area.app.models.Page;
      var Document = Area.app.models.Document;
      var Sheet = Area.app.models.Sheet;
      var FieldType = Area.app.models.FieldType;

      if(typeof area.areaId != 'undefined'){
        Area.findById(area.areaId).then(function(a){
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
                Area.destroyById(area.areaId);
                for(var s in sheets) {
                  if(s == 0)
                    sheets[s].areas.unset(area.areaId);
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
        callback(null, "fuck yeah");
      }else
        callback(null, {Error: "Missing area"});
  }

	Area.remoteMethod('add', {
      accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
      description: "Recursively adds manual annotation to the document",
      returns: {
        arg: 'body',
        root: true,
        type: 'object'
      }
    });

  Area.remoteMethod('delete', {
      accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
      description: "Recursively adds manual annotation to the document",
      returns: {
        arg: 'body',
        root: true,
        type: 'object'
      }
    });

};
