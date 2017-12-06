'use strict';

module.exports = function(Readlist) {

	Readlist.add = function(readlist, callback){
		var MyUser = Readlist.app.models.MyUser;
		var Page = Readlist.app.models.Page;
		var AutomaticAnnotation = Readlist.app.models.AutomaticAnnotation;
		var ManualAnnotation = Readlist.app.models.ManualAnnotation;
      	var Area = Readlist.app.models.Area;
      	var Sheet = Readlist.app.models.Sheet;
      	var Document = Readlist.app.models.Document;

		if( (typeof readlist.title == 'undefined') || (typeof readlist.annotId == 'undefined') || (typeof readlist.userId == 'undefined') || (typeof readlist.modifiable == 'undefined') )
			callback(null, {"Parameters": "Missing (title, pageId, annotId or userId ?)"});
		else{
			Readlist.create({
				title: readlist.title,
				date: Date.now(),
				modifiable: readlist.modifiable
			}).then(function(rlist){

				var sheets = [];
				var page;
				var annotation;

				var sheetRec = function(sheetId, fullfill, reject){
					Sheet.findById(sheetId).then(function(sheet){
						sheets.push(sheet);
						if(sheet.$parent == 'Page'){
							Page.findById(sheet.parentId).then(function(p){
								page = p;
								fullfill();
							});
						}else
							sheetRec(sheet.parentId, fullfill, reject);
					});
				};

				var findAnnot = function(annotId, fullfill, reject){
					AutomaticAnnotation.findById(annotId).then(function(annot){
						if(annot != null){
							annotation = annot;
							fullfill();
						}else{
							ManualAnnotation.findById(annotId).then(function(annot){
								if(annot != null){
									annotation = annot;
									fullfill();	
								}else
									callback(null, {Error: "No annotation found with this ID"});
							});
						}
					});
				};
				new Promise(function(fullfill, reject){
					findAnnot(readlist.annotId, fullfill, reject);
				}).then(function(){
					Area.findById(annotation.areaId).then(function(area){
						new Promise(function(fullfill, reject){
							sheetRec(area.sheetId, fullfill, reject);
						}).then(function(){
							MyUser.findById("5912f13e53a1290122e3db5d").then(function(user){
								rlist.annotations.add(annotation).then(function(){
									rlist.pages.add(page).then(function(){
										rlist.myuser(user);		
										rlist.save();
										annotation.readlist.add(rlist).then(function(){
											annotation.save();
											page.readlist.add(rlist).then(function(){
												page.save();	
												user.readlist.create(rlist).then(function(){
													user.save();
													console.log(rlist);
												});
											});
										});
									});
								});	
							});
						});
					});
				});
				callback(null, rlist);
			});
		}
	};

    Readlist.remoteMethod('add', {
      accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
      description: "Recursively adds manual annotation to the document",
      returns: {
        arg: 'body',
        root: true,
        type: 'object'
      }
    });

};
