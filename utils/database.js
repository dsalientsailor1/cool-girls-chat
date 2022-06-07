const mongo = require('mongodb').MongoClient;


let _db;
const mongoConnect = callback => {


  // const uri =
  // "mongodb+srv://sample-hostname:27017/?maxPoolSize=20&w=majority";

  // // mongodb+srv://coolgirls:<password>@cluster0.p49sb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
       

  // const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
  // 'mongodb+srv://coolgirl_coolgirls:SvcpilotNnc123*@127.0.0.1/conversations?retryWrites=true&w=majority


  


  
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/coolgirl_coolgirls";
// var url = "mongodb+srv://coolgirls:SvcpilotNnc123*@cluster0.vuedel2.mongodb.net/?retryWrites=true&w=majority";




  mongo.connect(url)
        .then(client => {
        console.log('mongo db connected')
        _db = client.db('coolgirl_coolgirls');


        callback();
  
  }).catch(err => {
    console.log(err)
    throw err;
  });
};
const getDb = () => {
    if(_db){
        return _db
    }
    throw 'No db';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

  