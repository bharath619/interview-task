import Mongo from "mongodb"
var db:Mongo.MongoClient;
export  function initDB(fn:Function) {
     Mongo.connect("mongodb://127.0.0.1:27017",{ useUnifiedTopology: true } ).then(client=>{
         db = client
         fn(null)
     }).catch(err=>{
         fn(err)
     })
}

export function getDB():Mongo.MongoClient{
    return db
}
