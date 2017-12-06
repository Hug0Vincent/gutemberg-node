'use strict';

module.exports = function(Sheet) {

	Sheet.add = function(sheet, callback){

		var Page = Sheet.app.models.Page;
    var Document = Sheet.app.models.Document;
    var SheetType = Sheet.app.models.SheetType;

    if(sheet.points.length == 4){
      Sheet.create({
      	points: sheet.points,
        name: ""
      }).then(function(s){
      	Page.findById(sheet.pageId).then(function(p){
      		Document.findById(p.documentId).then(function(d){
            SheetType.findById(sheet.sheetTypeId).then(function(st){
              s.parent(p);
              s.sheetType(st);
              s.name = st.name;
              s.save();
                
              p.sheets.create(s);
              p.save();

              d.pages.updateById(p.id, p);
              d.save();
             });
     			});
     		});
     		callback(null, s);
     	});
    }else
      callback(null, {Error: "Not enough points"});
	}

  Sheet.delete = function(sheet, callback){

    var Page = Sheet.app.models.Page;
    var Document = Sheet.app.models.Document;
    var SheetType = Sheet.app.models.SheetType;

    var page = {};
    var sheets = [];

    var sheetRec = function(sheetId, fullfill, reject){
      Sheet.findById(sheetId).then(function(s){
        sheets.push(s);
        if(s.$parent == 'Page')
          Page.findById(s.parentId).then(function(p){
            page = p;
            fullfill();
          });
        else
          sheetRec(s.parentId, fullfill, reject);
      });
    };

    Sheet.findById(sheet.sheetId).then(function(shee){
      Sheet.destroyById(sheet.sheetId);
      if(shee.$parent != 'Page'){
        new Promise(function(fullfill, reject){
          sheetRec(shee.parentId, fullfill, reject);
        }).then(function(){
          Document.findById(page.documentId).then(function(doc){
            for(var s in sheets){
              if(s == 0)
                sheets[s].sheets.unset(sheet.sheetId);
              else
                sheets[s].sheets.updateById(sheets[s - 1].id, sheets[s - 1]);
              sheets[s].save;
            }

              page.sheets.updateById(sheets[sheets.length - 1].id, sheets[sheets.length - 1]);
              page.save();

              doc.pages.updateById(page.id, page);
              doc.save();
          });
        });
      }else{
        Page.findById(shee.parentId).then(function(page){
          Document.findById(page.documentId).then(function(doc){

              page.sheets.unset(sheet.sheetId);
              page.save();

              doc.pages.updateById(page.id, page);
              doc.save();
          });
        });
      }
    });
    callback(null, "fuckyeah");

  }

	Sheet.remoteMethod('add', {
      accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
      description: "Recursively adds manual annotation to the document",
      returns: {
        arg: 'body',
        root: true,
        type: 'object'
      }
    });

  Sheet.remoteMethod('delete', {
      accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
      description: "Recursively adds manual annotation to the document",
      returns: {
        arg: 'body',
        root: true,
        type: 'object'
      }
    });

};
