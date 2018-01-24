'use strict';

module.exports = function(Annotation) {

	var Promise = require('bluebird');
	var http = require('http');
	var fs = require('fs');

	/* Search through the database via ElasticSearch
	 * param : the words we are looking for, in one sentence like "worda wordb wordc"
	 * size : the size of the sample MAX we want to recieve */
	Annotation.search = function(param, user, size, callback) {

		/* To access the other Documents Types */
	 	var Area = Annotation.app.models.Area;
  	var Sheet = Annotation.app.models.Sheet;
  	var Page = Annotation.app.models.Page;
  	var Document = Annotation.app.models.Document;
		var DocumentType = Annotation.app.models.DocumentType;
  	var split;

	  /* Splitting the words passed in parameter to add them one by one at the request */
		var path = 'gutemberg-bdd/_search?pretty&q='
		if( typeof param != 'undefined'){
			split = param.split(" ");
			path += '(text:*' + split[0] + '*)';
			for(var i = 1; i < split.length; i++)
	    		path += 'AND(text:*' + split[i] + '*)';
		}

    if( (typeof user != 'undefined') && (typeof param != 'undefined') )
    	path += 'AND';

    if(typeof user != 'undefined')
    	path += '(user:' + user + ')';

		/* Options for the HTTP request (query to ElasticSearch) */
		var http_options = {
			url: 'http://127.0.0.1',
		   	port: 9200,
		   	path: path + "&size=" + (size || 10),
				headers: {
					'content-type': 'application/json',
			}
		};

		console.log("Search path : " + http_options.path);

		var to_client = {};
		var promises = [];

		/* Get the IDs of the sheet and page and add them to the response */
		var getIds = function(p, fullfill, reject) {

			Area.findById(p._source.areaId, { fields: { sheetId: true }}).then(function(area) {
				p.sheetId = area.sheetId;
				Sheet.findById(area.sheetId, { fields: { parentId: true }}).then(function(sheet) {
					Page.findById(sheet.parentId, { fields: { documentId: true }}).then(function(page) {
						p.page_id = sheet.parentId;
						Document.findById(page.documentId, { fields: { title: true, date:true, docTypeId: true } }).then(function(document) {
							p.document_id = page.documentId;
							p.document_title = document.title;
							p.document_date = document.date;
							DocumentType.findById(document.docTypeId, { fields: { name:true }}).then(function(doctype) {
								p.document_type = doctype.name;
								fullfill();
							});
						});
					});
				});
			});
		}



		/* Requesting ES */
		var post_req = http.request(http_options, function(res_http) {

			res_http.setEncoding('utf8');
			var chunck = '';
		  res_http.on('data', (d) => { chunck += d; });
		  res_http.on('end', () => {

		  	to_client = JSON.parse(chunck);
				console.log("TOCLIENT : ", to_client);

				if(typeof to_client.hits != 'undefined') {

					for(var i = 0; i < to_client.hits.hits.length; i++)
						promises.push(new Promise(function(fullfill, reject) {
							//console.log("GETID", to_client.hits.hits[i]);
							getIds(to_client.hits.hits[i], fullfill, reject);
						}));

					Promise.all(promises).then(function() {
						callback(null, to_client);
					});

				} else {
					callback(null, { hits:{hits:[]}, total: 0 });
				}

				});

    	});

    	post_req.end();

	};

	Annotation.remoteMethod(
    'search', {
      http: {
        path: '/search',
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
	  /* Returns : */
      returns: {
        arg: 'result',
        type: 'string'
      }
    }
	);

};
