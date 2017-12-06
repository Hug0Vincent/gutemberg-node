'use strict';

module.exports = function(Documenttype) {
  Documenttype.load_json = function(filepath){

    var listType = ['number','text','date'];

    var obj = fs.readFileSync(filepath, 'utf8');
    var data = JSON.parse(obj);

    for(var cpt in data){
      if(data[cpt].hasOwnProperty('name') && data[cpt].hasOwnProperty('sheetType')){
        Documenttype.find({where: {name: data[cpt].name}}).then(function(res){
          if(res.length==0){
            Documenttype.create({name:data[cpt].name, defaultContributor: data[cpt].defaultContributor}).then(function(docType){
                var listPromiseSheet = Array();
                for(var cpt1 in data[cpt].sheetType){
                  var sheetT = data[cpt].sheetType[cpt1];
                  if(sheetT.hasOwnProperty('name') && sheetT.hasOwnProperty('fieldType')){
                    SheetType.create({name: sheetT.name, docType: docType}).then(function(sheet){
                      var listPromiseField = Array();
                      var listPromiseField2 = Array();
                      var k = 0;
                      for(var idF in sheetT.fieldType){
                        var fieldT = sheetT.fieldType[idF];
                        if(fieldT.hasOwnProperty('name') && fieldT.hasOwnProperty('required') && fieldT.hasOwnProperty('type') && fieldT.hasOwnProperty('number') && listType.indexOf(fieldT.type) > -1){
                            if(k>0){
                              var promTemp = listPromiseField2[k-1].then(function(s){
                                var fieldT = sheetT.fieldType[s+1];
                                return FieldType.create({name: fieldT.name, required: fieldT.required, type: fieldT.type, number: fieldT.number, sheetType: sheet}).then(function(fType){
                                  return sheet.fieldType.create(fType).then(function(){
                                    return s+1;
                                  });
                              })});
                              listPromiseField.push(promTemp);
                              listPromiseField2.push(promTemp);
                            } else {
                              var prom = FieldType.create({name: fieldT.name, required: fieldT.required, type: fieldT.type, number: fieldT.number, sheetType: sheet}).then(function(fType){
                                return sheet.fieldType.create(fType).then(function(){
                                  return 0;
                                });
                              });
                              listPromiseField.push(prom);
                              listPromiseField2.push(prom);
                            }
                            k=k+1;
                        }
                      }
                      listPromiseSheet.push(Promise.all(listPromiseField).then(function(temp){
                        return docType.sheetType.create(sheet);
                      }));
                    });
                  }
                }
            });
          } else {
            var doc = res[0];
            doc.name = data[cpt].name;
            doc.defaultContributor = data[cpt].defaultContributor;
            var listPromise = Array();
            var updateField = function(fieldT, listFT){
              var ft = listFT[0];
              ft.name = fieldT.name;
              ft.required = fieldT.required;
              ft.type = fieldT.type;
              ft.number = fieldT.number;
              return ft.save().then(function(sav){
                return doc.fieldType.updateById(ft.id, ft);
              });
            }

            var listPromiseSheet = Array();
            for(var idSh in data[cpt].sheetType){
              var sheetT = data[cpt].sheetType[idSh];
              listPromiseSheet.push(SheetType.find({where: {name: sheetT.name, docTypeId: doc.id}}).then(function(listSheet){
                if(listSheet.length > 0){
                  var sh = listSheet[0];
                  var listPromiseField = Array();
                  for(var idFd in sheetT.fieldType){
                    var fieldT = sheetT.fieldType[idFd];
                    listPromiseField.push(FieldType.find({where: {name: fieldT.name, }}))
                  }
                }
              }));
            }

            for(var cpt1 in data[cpt].fieldType){
              var fieldT = data[cpt].fieldType[cpt1];
              if(fieldT.hasOwnProperty('name') && fieldT.hasOwnProperty('required') && fieldT.hasOwnProperty('type') && fieldT.hasOwnProperty('number') && fieldT.hasOwnProperty('idType') && listType.indexOf(fieldT.type) > -1){
                listPromise.push(FieldType.find({where: {idType: fieldT.idType, docTypeId: doc.id}}).then(updateField.bind(null, fieldT)));
              }
            }
            Promise.all(listPromise).then(function(){
              doc.save();
            });
          }

        });

      } else {
        console.log("ERROR CREATION DOCTYPE NUMBER "+(cpt+1));
      }

    }

  }
};
