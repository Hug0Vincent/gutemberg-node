'use strict';

module.exports = function(Document) {

  var DEBUG = true;
  var Promise = require('bluebird');
  var http = require('http');
  var fs = require('fs');

  Document.load_json = function(filepath, fullfill, reject){

    var data;
    var queue = [];
    var promises = [];
    var saveQueue = [];

    var count = {
      documents: 0,
      pages: 0,
      sheets: 0,
      areas: 0,
      points: 0,
      annotations: 0,
      saved: 0
    };

    var progressInterval = setInterval(function() {
      console.log(`${count.documents} : ${count.pages} : ${count.sheets} : ${count.areas} : ${count.annotations} | ${count.saved} / ${count.pages + count.sheets + count.areas + count.annotations}`)
    }, 1000);

    var addAnnot = function(params) {

      var idDoc = params[0];
      var idPag = params[1];
      var sheetId = params[2];
      var inputId = params[3];
      var annotId = params[4];
      var doc = params[5];
      var pag = params[6];
      var sheet = params[7];
      var area = params[8];

      if(data[idDoc].pages[idPag].sheetsIndex[sheetId].listInputs[inputId].annotations[annotId].type=='annotationAutomatic') {

        promises.push(AutomaticAnnotation.create({modifiable:data[idDoc].pages[idPag].sheetsIndex[sheetId].listInputs[inputId].annotations[annotId].modifiable, text:data[idDoc].pages[idPag].sheetsIndex[sheetId].listInputs[inputId].annotations[annotId].textAuto}).then(function(annot){

          count.annotations++;

          annot.area(area);
          annot.save();
          count.saved++;

          area.annotations.create(annot);

        }));

      }

    };

    var addInput = function(params) {

      var idDoc = params[0];
      var idPag = params[1];
      var sheetId = params[2];
      var inputId = params[3];
      var doc = params[4];
      var pag = params[5];
      var sheet = params[6];

      if(data[idDoc].pages[idPag].sheetsIndex[sheetId].listInputs[inputId].type=="area") {
          promises.push(DocumentType.find({where: {name:data[idDoc].type}}).then(function(listDoc){
            if(listDoc.length > 0){
              return SheetType.find({where: {name:data[idDoc].pages[idPag].sheetsIndex[sheetId].name, docTypeId: listDoc[0].id}}).then(function(listSheet){
                if(listSheet.length > 0){
                  return FieldType.find({where: {name: data[idDoc].pages[idPag].sheetsIndex[sheetId].listInputs[inputId].name, sheetTypeId: listSheet[0]}}).then(function(listTypeField){
                    Area.create({name:data[idDoc].pages[idPag].sheetsIndex[sheetId].listInputs[inputId].name, points:data[idDoc].pages[idPag].sheetsIndex[sheetId].listInputs[inputId].points, fieldTypeId:listTypeField[0]}).then(function(area) {

                      count.areas++;
                      area.sheet(sheet);

                      //for(var pointId in data[idDoc].pages[idPag].sheetsIndex[sheetId].listInputs[inputId].points) queue.push([addInputPoint, [idDoc, idPag, sheetId, inputId, pointId, doc, pag, sheet, area]]);
                      for(var annotId in data[idDoc].pages[idPag].sheetsIndex[sheetId].listInputs[inputId].annotations) addAnnot([idDoc, idPag, sheetId, inputId, annotId, doc, pag, sheet, area]);//queue.push([addAnnot, [idDoc, idPag, sheetId, inputId, annotId, doc, pag, sheet, area]]);

                      saveQueue.push([function(params) {

                        var area = params[0];
                        var sheet = params[1];

                        area.save();
                        count.saved++;

                        promises.push(sheet.areas.create(area));

                      }, [area, sheet]]);

                    });
                  });
                }
              });
            }
          }));

      }

    };

    var addSheet = function(params) {

      var idDoc = params[0];
      var idPag = params[1];
      var sheetId = params[2];
      var doc = params[3];
      var pag = params[4];

      promises.push(DocumentType.find({where: {name:data[idDoc].type}}).then(function(listDoc){
        if(listDoc.length > 0){
          return SheetType.find({where: {name:data[idDoc].pages[idPag].sheetsIndex[sheetId].name, docTypeId: listDoc[0].id}}).then(function(listSheet){
            return Sheet.create({name:data[idDoc].pages[idPag].sheetsIndex[sheetId].name, points:data[idDoc].pages[idPag].sheetsIndex[sheetId].points, sheetType: listSheet[0]}).then(function(sheet) {

              count.sheets++;
              sheet.parent(pag);

              //for(var pointId in data[idDoc].pages[idPag].sheetsIndex[sheetId].points) queue.push([addPoint, [idDoc, idPag, sheetId, pointId, doc, pag, sheet]]);
              for(var inputId in data[idDoc].pages[idPag].sheetsIndex[sheetId].listInputs) addInput([idDoc, idPag, sheetId, inputId, doc, pag, sheet]);//queue.push([addInput, [idDoc, idPag, sheetId, inputId, doc, pag, sheet]]);

              saveQueue.push([function(params) {

                var sheet = params[0];
                var pag = params[1];

                sheet.save();
                count.saved++;

                promises.push(pag.sheets.create(sheet));

              }, [sheet, pag]]);

            });
          });
        }

    }));

    };

    var addPage = function(params) {

      var idDoc = params[0];
      var idPag = params[1];
      var doc = params[2];

      promises.push(Page.create({image:data[idDoc].pages[idPag].image}).then(function(pag) {

        count.pages++;

        pag.document(doc);
        for(var sheetId in data[idDoc].pages[idPag].sheetsIndex) addSheet([idDoc, idPag, sheetId, doc, pag]);//queue.push([addSheet, [idDoc, idPag, sheetId, doc, pag]]);

        saveQueue.push([function(params) {

          var pag = params[0];
          var doc = params[1];

          pag.save();
          count.saved++;

          promises.push(doc.pages.create(pag));

        }, [pag, doc]]);

      }));

    };

    var addDoc = function(idDoc) {

      var date = data[idDoc].date.split('/').reverse().join('/');
      if(data[idDoc].hasOwnProperty('type')){
        promises.push(DocumentType.find({where: {name:data[idDoc].type}}).then(function(typeDoc){
          if(typeDoc.length>0){
            count.documents++;
            return Document.create({date: date, title: data[idDoc].title, docType:typeDoc[0]}).then(function(doc) {

              for(var idPag in data[idDoc].pages.reverse()) queue.push([addPage, [idDoc, idPag, doc]]);
              saveQueue.push([function(params) {

                var doc = params[0];

                doc.save();
                count.saved++;


              }, [doc]])

            });

          } else {
            console.log("ERROR DOCUMENT -- "+count.documents+1+" - ID TYPE MISSING");
          }



        }));
      } else {
        console.log("ERROR DOCUMENT !! "+count.documents+1+" - ID TYPE MISSING");
      }


    };

    var consumeSaveQueue = function() {

      if(saveQueue.length == 0) {

        console.log("Document imported !");
        if(typeof fullfill != "undefined") fullfill();
        return;

      }

      if(saveQueue.length%100 == 0) console.log(`${count.documents} : ${count.pages} : ${count.sheets} : ${count.areas} : ${count.annotations} | ${count.saved} / ${count.pages + count.sheets + count.areas + count.annotations}`);

      var q = saveQueue.pop();
      (q[0])(q[1]);

      Promise.all(promises).then(consumeSaveQueue);

    };

    var consumeQueue = function() {

      if(queue.length == 0) {

        clearInterval(progressInterval);
        consumeSaveQueue();

      }
      else {

        var q = queue.shift();
        (q[0])(q[1]);

        Promise.all(promises).then(consumeQueue);

      }

    };

    var obj = fs.readFileSync(filepath, 'utf8');
    var data = JSON.parse(obj);

    for(var idDoc in data) addDoc(idDoc);
    Promise.all(promises).then(consumeQueue);

  }

  Document.multi_load_json = function(mask) {

    var glob = require("glob");
    var count = 0; var total = 0;

    var consumeFiles = function(files) {

      var file = files.pop();

      new Promise(function(f,r) {

        console.log("Loading " + file);
        Document.load_json(file, f, r);

      }).then(function() {

        count++;
        console.log("Documents added : " + count + " / " + total);

        if(files.length > 0) consumeFiles(files);

      });

    };

    glob(mask, {}, function(err, files) {

      total = files.length;
      consumeFiles(files);

    });

  }

  Document.destroyAllModel = function(){

    /* Elements in MongoDB, alphabetical order */
    //Administrator.destroyAll();
    Area.destroyAll();
    AutomaticAnnotation.destroyAll();
    DocumentType.destroyAll();
    Document.destroyAll();
    FieldType.destroyAll();
    ManualAnnotation.destroyAll();
    //Moderator.destroyAll();
    //MyUser.destroyAll();
    Page.destroyAll();
    Point.destroyAll();
    ReadList.destroyAll();
    SheetType.destroyAll();
    Sheet.destroyAll();

    /* API call to ES to dump the database */
    var http_options = {
      url: 'http://127.0.0.1',
      port: 9200,
      path: "_all",
      method: "DELETE",
      headers: {
          'content-type': 'application/json'
      }
    };

    var post_req = http.request(http_options, function(res_http){
      res_http.setEncoding('utf8');
      var chunck = '';
      res_http.on('data', (d) => { chunck += d; });
      res_http.on('end', () => {
        console.log("You must see {\"acknowledged\":true}, if you do then it's successfull !")
        console.log(chunck)
      });
    });
    post_req.end();

  }


  /* Range = -1 if we are looking for all dates before the one in parameter
   * Range = 0 if we are looking for the exact date in parameter
   * Range = 1 if we are looking for all dates after the one in parameter
   * Range = 2 if we are looking for the dates between date1 and date2 (both in date) */
  Document.search = function(type, date, title, range, size, callback) {

    var to_client = [];
    var tmp = {};
    /* Creating the path/request according to the parameters */
    var path = 'gutemberg-bdd/_search?pretty&type=Document&size=' + ( size || 10 ) + '&q=';

    if ( (typeof range != 'undefined') && (typeof date != 'undefined') ){
      if(range == 0)
        path += '(date:' + date + ')';
      else if(range == -1)
        path += '(date:[*%20TO%20' + date + '])';
      else if(range == 1)
        path += '(date:['+ date + '%20TO%20*])';
      else if(range == 2)
        path += '(date:[' + date.split(" ")[0] + '%20TO%20' + date.split(" ")[1] + '])';
    }

    if( (typeof date != 'undefined') && (typeof title != 'undefined') )
      path += 'AND';

    if (typeof title != 'undefined'){
      path += '(title:*' + title.split(" ")[0] +'*)';
    }

    if( ( (typeof date != 'undefined') && (typeof type != 'undefined') ) || ( (typeof title != 'undefined') && (typeof type != 'undefined') ) )
      path += 'AND';

    if (typeof type != 'undefined'){
      path += '(docTypeId:' + type +')';
    }

    /* Options for the HTTP request */
    var http_options = {
      url: 'http://127.0.0.1',
      port: 9200,
      path: path,
      headers: {
          'content-type': 'application/json',
      }
    };

    var post_req = http.request(http_options, function(res_http){
      res_http.setEncoding('utf8');
      var chunck = '';
      res_http.on('data', (d) => { chunck += d; });
      res_http.on('end', () => {
        tmp = JSON.parse(chunck);
        if(typeof tmp.hits != 'undefined'){
          for(var i = 0; i < tmp.hits.hits.length; i++){
            to_client.push({'id':tmp.hits.hits[i]._id, 'title': tmp.hits.hits[i]._source.title, 'date': tmp.hits.hits[i]._source.date, 'type': (tmp.hits.hits[i]._source.docTypeId || 0), 'total':tmp.hits.total });
          }
        }else{
          to_client.push({total: 0});
        }
        callback(null, to_client);
      });
    });
    post_req.end();
  }


  /* Renvoie les informations sur les annotations qui contiennent le texte 'text'
   * Et qui appartiennent à des documents dont la date est celle recherchée */
  Document.advanced_search = function(type, date, title, range, text, user, size, callback){

    var Annotation = Document.app.models.Annotation;

    var tmp_doc = {};
    var tmp_annot = {};
    var to_client = { hits: { hits: [], total: 0 } };

    var copyDoc = function(nul, doc){
      tmp_doc = doc;
      console.log(doc);
      Annotation.search(text, user, size, copyAnnot);
    }

    var copyAnnot = function(nul, annot){
      tmp_annot = annot.hits.hits;
      to_client.hits.total = annot.hits.total;
      copyBoth();
    }

    var copyBoth = function(){
      for(var j = 0; j < tmp_doc.length; j++){
        for(var i = 0; i < tmp_annot.length; i++){
          if(tmp_annot[i].document_id == tmp_doc[j].id)
            to_client.hits.hits.push(tmp_annot[i]);
        }
      }
      callback(null, to_client);
    }

    Document.search(type, date, title, range, size, copyDoc);

  }


  Document.all_search = function(text, size, callback){

    var Annotation = Document.app.models.Annotation;
    var to_client = { hits: { hits: { doc: [], annot: []}, total: 0 } };

    var copyDoc = function(nul, doc){
      console.log(doc);
      to_client.hits.total += (doc.length > 0) ? doc[0].total : 0;
      for(var i = 0; i < doc.length; i++)
        to_client.hits.hits.doc.push(doc[i]);
      Annotation.search(text, undefined, size, copyAnnot);
    }

    var copyAnnot = function(nul, annot){
      to_client.hits.total += annot.hits.total;
      for(var i = 0; i < annot.hits.hits.length; i++)
        to_client.hits.hits.annot.push(annot.hits.hits[i]);
      callback(null, to_client);
    }

    Document.search(undefined, undefined, text, undefined, size, copyDoc);
  }

  Document.all_advanced_search = function(type, date, title, range, text, user, size, callback){

    var Annotation = Document.app.models.Annotation;
    var to_client = { hits: { hits: { doc: [], annot: []}, total: 0 } };

    var copyDoc = function(nul, doc){
      for(var i = 0; i < doc.length; i++)
          to_client.hits.hits.doc.push(doc[i]);
      Document.advanced_search(type, date, title, range, text, user, size, copyAnnot);
    }

    var copyAnnot = function(nul, annot){
      console.log(annot);
      to_client.hits.total += annot.hits.total;
      for(var i = 0; i < annot.hits.hits.length; i++)
        to_client.hits.hits.annot.push(annot.hits.hits[i]);
      callback(null, to_client);
    }

    if( (typeof date != 'undefined') && (typeof range == 'undefined') )
      Document.search(type, date, title, 0, size, copyDoc);
    else
      Document.search(type, date, title, range, size, copyDoc);

  }

  Document.like = function(id, size, callback){

    var document_like = [];
    var my_doc = {};
    var to_client = {};

    var getDoc = function(id, fullfill, reject){
      Document.findById(id, { fields: { title: true, date: true }}).then(function(document) {
        my_doc.document_title = document.title;
        my_doc.document_date = document.date;
        fullfill();
      });
    }

    new Promise(function(fullfill, reject){
      getDoc(id, fullfill, reject);
    }).then(function(){
      var path = 'gutemberg-bdd/_search?pretty&q=(title:' + my_doc.document_title + ')OR(date:[' + my_doc.document_date.setMonth(my_doc.document_date.getMonth() - 1) + '%20TO%20' + my_doc.document_date.setMonth(my_doc.document_date.getMonth() + 2) + '])';
      var http_options = {
        url: 'http://127.0.0.1',
        port: 9200,
        path: path + "&size=" + ( size || 10 ),
        headers: {
            'content-type': 'application/json',
        }
      };

      var post_req = http.request(http_options, function(res_http){
        res_http.setEncoding('utf8');
        var chunck = '';
        res_http.on('data', (d) => { chunck += d; });
        res_http.on('end', () => {
          to_client = JSON.parse(chunck);
          if(typeof to_client.hits != 'undefined'){
            for(var i = 0; i < to_client.hits.hits.length; i++){
              if(to_client.hits.hits[i]._id != id)
                document_like.push({id: to_client.hits.hits[i]._id, title: to_client.hits.hits[i]._source.title, date: to_client.hits.hits[i]._source.date, type: to_client.hits.hits[i]._source.type});
            }
            callback(null, document_like);
          }else
            callback(null, {hits:{hits:[]}, total: 0});
        });
      });
      post_req.end();

    });
  }

  Document.search_current = function(id, text, size, callback){

    var Annotation = Document.app.models.Annotation;

    var matching = {'total': 0, 'annotations': []};

    var checkIfValid = function(nul, doc){
      for(var i = 0; i < doc.hits.hits.length; i++){
        if(doc.hits.hits[i].page_id == id){
          matching.annotations.push(doc.hits.hits[i]);
          matching.total++;
        }
      }
      callback(null, matching);
    }

    Annotation.search(text, undefined, size, checkIfValid);
  }

  Document.search_similar = function(type, text, size, callback){

    var Annotation = Document.app.models.Annotation;
    var AutomaticAnnotation = Document.app.models.AutomaticAnnotation;
    var ManualAnnotation = Document.app.models.ManualAnnotation;
    var Area = Document.app.models.Area;
    var Sheet = Document.app.models.Sheet;
    var Page = Document.app.models.Page;

    var promises = [];

    var matching = {'total': 0, 'sheets': []};
    var annotation = {};

    var findAnnot = function(annotId, fullfill_bis, reject){
      AutomaticAnnotation.findById(annotId).then(function(annot){
        console.log("error id "+annotId);
        if(annot != null){
          annotation = annot;
          fullfill_bis();
        }else{
          console.log("error id "+annotId);
          ManualAnnotation.findById(annotId).then(function(annot){
        if(annot != null){
              annotation = annot;
              fullfill_bis();
            }else
              callback(null, {Error: "No annotation found with this ID"});
          });
        }
      });
    };

    var checkType = function(id, doc, fullfill, reject){
      new Promise(function(fullfill_bis, reject){
        findAnnot(id, fullfill_bis, reject);
      }).then(function(){
        
        console.log("error id "+annotation.areaId);
        console.log("error id "+area.sheetId);
        console.log("error id "+sheet.parentId);

        Area.findById(annotation.areaId).then(function(area){
          Sheet.findById(area.sheetId).then(function(sheet){
            Page.findById(sheet.parentId, {fields : {documentId: true}}).then(function(d) {
              if(sheet.name == type){
                sheet.documentId = d.documentId;
                sheet.pageId = sheet.parentId;
                sheet.areaId = annotation.areaId;
                matching.sheets.push(sheet);
                matching.total++;
                console.log(matching);
              }
              fullfill();
            });
          });
        });
      });
    };

    var checkIfValid = function(nul, doc){
      for(var i = 0; i < doc.hits.hits.length; i++)
        promises.push(new Promise(function(fullfill, reject){
          checkType(doc.hits.hits[i]._id, doc.hits.hits[i], fullfill, reject);
        }));
      Promise.all(promises).then(function() {

        var tmp = {}; var r = [];

        for(var i in matching.sheets) tmp[matching.sheets[i].id] = matching.sheets[i];
        for(var i in tmp) r.push(tmp[i]);
        matching.sheets = r;

        callback(null, matching);
      });
    };

    Annotation.search(text, undefined, size, checkIfValid);

  }

  Document.remoteMethod(
    'search', {
      http: {
        path: '/search',
        verb: 'get'
      },
      /* Params it accepts */
      accepts:[{
        arg: 'type',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'date',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'title',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'range',
        type: 'string',
        http: {
          source: 'query'
        }
      },
       {
        arg: 'size',
        type: 'number',
        http: {
          source: 'query'
        }
      }],
    /* Returns : */
      returns: {
        arg: 'result',
        type: 'string'
      }
    }
  );

  Document.remoteMethod(
   'like', {
     http: {
       path: '/like',
       verb: 'get'
     },
     /* Params it accepts */
     accepts:[{
       arg: 'id',
       type: 'string',
       http: {
         source: 'query'
       }
     },
     {
       arg: 'size',
       type: 'string',
       http: {
         source: 'query'
       }
     }],
   /* Returns : */
     returns: {
       arg: 'result',
       type: 'string'
     }
   }
  );

  Document.remoteMethod(
   'all_search', {
     http: {
       path: '/all_search',
       verb: 'get'
     },
     /* Params it accepts */
     accepts:[{
       arg: 'text',
       type: 'string',
       http: {
         source: 'query'
       }
     },
     {
       arg: 'size',
       type: 'string',
       http: {
         source: 'query'
       }
     }],
   /* Returns : */
     returns: {
       arg: 'result',
       type: 'string'
     }
   }
  );

  Document.remoteMethod(
   'search_current', {
     http: {
       path: '/search_current',
       verb: 'get'
     },
     /* Params it accepts */
     accepts:[{
       arg: 'id',
       type: 'string',
       http: {
         source: 'query'
       }
     },
     {
       arg: 'text',
       type: 'string',
       http: {
         source: 'query'
       }
     },
     {
       arg: 'size',
       type: 'string',
       http: {
         source: 'query'
       }
     }],
   /* Returns : */
     returns: {
       arg: 'result',
       type: 'string'
     }
   }
  );

  Document.remoteMethod(
   'search_similar', {
     http: {
       path: '/search_similar',
       verb: 'get'
     },
     /* Params it accepts */
     accepts:[{
       arg: 'type',
       type: 'string',
       http: {
         source: 'query'
       }
     },
     {
       arg: 'text',
       type: 'string',
       http: {
         source: 'query'
       }
     },
     {
       arg: 'size',
       type: 'string',
       http: {
         source: 'query'
       }
     }],
   /* Returns : */
     returns: {
       arg: 'result',
       type: 'string'
     }
   }
  );

  Document.remoteMethod(
    'advanced_search',{
      http:{
        path: '/advanced_search',
        verb: 'get'
      },
      accepts:[{
        arg: 'type',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'date',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'title',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'range',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'text',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'user',
        type: 'string',
        http: {
          source: 'query'
        }
      },
       {
        arg: 'size',
        type: 'number',
        http: {
          source: 'query'
        }
      }],
     returns: {
        arg: 'result',
        type: 'string'
      }
    }
  );

  Document.remoteMethod(
    'all_advanced_search',{
      http:{
        path: '/all_advanced_search',
        verb: 'get'
      },
      accepts:[{
        arg: 'type',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'date',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'title',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'range',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'text',
        type: 'string',
        http: {
          source: 'query'
        }
      },
      {
        arg: 'user',
        type: 'string',
        http: {
          source: 'query'
        }
      },
       {
        arg: 'size',
        type: 'number',
        http: {
          source: 'query'
        }
      }],
     returns: {
        arg: 'result',
        type: 'string'
      }
    }
  );
}
