const getDb = require('../utils/database').getDb;
let mongo = require('mongodb');

// const uuid = require('uuid/v4');

// const uuidv4 = require('uuid/v4');
// uuidv4(); //
class GroupConversation{
    // let conversation_id = 0;

    // save(user1,user2,conversation_id = ''){
    //     this.user1 = user1;
    //     this.user2 = user2;
    //     this.conversation_id = conversation_id;
    // }

    

    getMessages(id){
   
    //   console.log(id);
        const db = getDb();
        return db.collection('group_chats')
        .find({group_id:id}).toArray();
    }
    
    //3
    checkConversation(user,group){
      
    //  console.log('checking group iq')
    //  console.log(group)
        const db = getDb();
        let self = this;
    
        return db.collection('group_conversations')
                .find({group_id:group})
                .next().then((result) => {
                    // console.log(result);
                    return result
                }).catch((err) => {
                    
                });;


    }








    saveMessage(data){
        const db = getDb();
       const now = Math.floor(Date.now() / 1000);
        // return  db.collection('conversations') .insertOne({user1:1,user2:2,date_created:now});

        return  db.collection('group_chats').insertOne({
            group_id:data.group_id,
            sender:data.user,
            message:data.message,
            date_created:now});
    }

    //4
    insertConversation(user,group){
        const db3 = getDb();
       const now = Math.floor(Date.now() / 1000);

        return  db3.collection('group_conversations') 
        .insertOne({group_id:group,users:[user],date_created:now});
    }

    //1
    saveConversation(user,group_id){
       const db = getDb();
       const now = Math.floor(Date.now() / 1000);

       this.user = user;
       this.group = group_id;
      //2
       return this.checkConversation(user,group_id).then((result) => {
           console.log('checking group conversatyion');
        //    console.log(result);
            if(result == '' || result == null){
               this.status = 'new';
               return this.insertConversation(user,group_id);
            }else{
                var users = [];
               this.status = 'old';

                users = result.users;

               //check if exist
                if(!result['users'].includes(user)){
                        users.push(user)
                        db.collection('group_conversations')
                        .updateOne({group_id:group_id.toString()}, 
                        {$set:{users:users}})
                }else{
                    console.log('found user');

                }

             
                
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
module.exports = GroupConversation;