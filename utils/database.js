const mongo = require('mongodb').MongoClient;


let _db;
const mongoConnect = callback => {

  // mongodb+srv://coolgirls:<password>@cluster0.p49sb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
        mongo.connect('mongodb+srv://coolgirls:SvcpilotNnc123*@cluster0.p49sb.mongodb.net/conversations?retryWrites=true&w=majority')
        .then(client => {
        console.log('mongo db connected')
        _db = client.db('coolgirls');


      //   var myobj = { name: "Company Inc", address: "Highway 37" };
      //   _db.collection("customers").insertOne(myobj, function(err, res) {
      //    if (err) throw err;
      //    console.log("1 document inserted");
      //   //  _db.close();
      //  });
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

  