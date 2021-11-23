const getDb = require('../utils/database').getDb;
let mongo = require('mongodb');

// const uuid = require('uuid/v4');

// const uuidv4 = require('uuid/v4');
// uuidv4(); //
class Conversation{
    // let conversation_id = 0;

    // save(user1,user2,conversation_id = ''){
    //     this.user1 = user1;
    //     this.user2 = user2;
    //     this.conversation_id = conversation_id;
    // }

    
    getMessages(id){
      console.log('GET MESSAGE ID-------------------');
      console.log(id);
        const db = getDb();
        return db.collection('chats')
        .find({conversation_id:id}).toArray();
    }
    checkConversation(user1,user2){
      
        console.log('checking conversation 1121111');
        console.log(user1 + '-' + user2);
        const db = getDb();
        let self = this;
        // return db.collection('conversations').find( { $where: function() {
        //     return (user1 != 100  && user2 != 200) ;
        // }}).toArray().then((result) => {
        //     return result
        // }).catch((err) => {
            
        // });;

// db.things.find({ words: { $in: ["text", "here"] }});
        return db.collection('conversations').find({ users: { $all: [user1, user2] }}).toArray().then((result) => {
                return result
            }).catch((err) => {
                
            });;


    }








    saveMessage(id,message){
        const db = getDb();
       const now = Math.floor(Date.now() / 1000);
        // return  db.collection('conversations') .insertOne({user1:1,user2:2,date_created:now});

        return  db.collection('chats').insertOne({sender:message.sourceId,receiver:message.targetId,message:message.message,conversation_id:id,date_created:now});
                               


    }

    insertConversation(id,user1,user2){

        console.log('insertConversation id');
        console.log(id);
        const db3 = getDb();
       const now = Math.floor(Date.now() / 1000);

        return  db3.collection('conversations') .insertOne({id:id,users:[user1,user2],date_created:now});
    }
    saveConversation(id,user1,user2){
       const db = getDb();
       const now = Math.floor(Date.now() / 1000);

       this.user1 = user1;
       this.user2 = user2;
      
       return this.checkConversation(user1,user2).then((result) => {
            if(result == ''){
               this.status = 'new';
               return this.insertConversation(id,user1,user2);
            }else{
               this.status = 'old';
                return result[0]['id']; 
            }
        }).catch((err) => {
            
        });
       
    //    var myobj = { name: "Company Inc", address: "Highway 37" };
    //    db.collection("customers").insertOne(myobj, function(err, res) {
    //     if (err) throw err;
    //     db.close();
    //   });
        // var conversation_id
        let self = this;
        

        // return db.collection('conversations').find( { $where: function() {
        //     return (user1 == 2  && user2 == 1) || (user1 == 7  && user2 == 2)
        //  } } ).toArray(function(err, result) {
        //                 if (err) throw err;

        //                 if(result == ''){

                            
        //                     return  db.collection('conversations') .insertOne({user1:self.user1,user2:self.user2,date_created:now})
        //                     .then(result=> {
                     
        //                          return result.insertedId
        //                         //  return ;
                     
        //                         //   return    db.collection('chats').insertOne({sender:this.user1,receiver:this.user2,message:this.message,conversation_id:3,date_created:now})
        //                         //      .then(result=> {
        //                         //       return result.insertedId
                                         
        //                         //      }).catch((err) => {
                             
        //                         //      });
                     
        //                     }).catch((err) => {
        //                      //  
                     
        //                     });



        //                 }else{
        //                     return result[0]['_id'];
        //                 }
                       


        //               });

        // > db.findDocumentsHaving2Demo.find({$and: [
        //     {Values: {$elemMatch: {$gte: 77, $lte: 78}}},
        //     {Values: {$elemMatch: {$gte:90 , $lte: 110}}},
        //     {'Values.2': {$exists: false}}
        //  ]});

        
//         // db.inventory.find( { status: "A", qty: { $lt: 30 } } )





     
    }
}
module.exports = Conversation;