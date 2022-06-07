const express = require("express");
const axios = require('axios');
// var https = require('https');
var http = require("http");
// const util = require('util');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: 'null'
}));



app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});



// const port = process.env.PORT || 61120;
// const port = process.env.PORT || 8481;


//main
// const port = process.env.PORT || 4200;
const port =  1994;


// const port = 36939;
var server = http.createServer(app);
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const mongoConnect = require('./database').mongoConnect;
const getDb = require('../utils/database').getDb;
const mysql = require('./db');



console.log('entered-123------');



mongoConnect(()=>{
    server.listen(port, () => {
      console.log("server started");
    });
  
  })






  app.use('/test', async (req,res,next)=>{
    console.log('entered-------');



    res.send('cdcdcdcdcdcdcdcdcdcdcdc');
  })


  
  app.use('/test1', async (req,res,next)=>{
    console.log('entered-------');


    axios
  .post('http://192.168.157.240/project/cool_girls_app/processors/send-notification.php', {
    sender: 1,
    receiver: 1,
    message:'33333'
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    // console.log(res)
  })
  .catch(error => {
    console.error(error)
  })



    res.send();
  })

 
  app.use('/conversation', async (req,res,next)=>{
    console.log('entered-------');
    const db = getDb();
    var user_id = req.body.user

    if(isNaN(user_id)){  
      return false;
    }
    //fetch all single chats
    var all_result = [];
    var all_chats = [];
    var all_group_chat_id = '(';
    var count = 0;
    var data_status = false;
    var data = {
        status:'empty'
      }



    var result1 =   await db.collection('conversations').find({ users: { $in: [user_id] }});
    result1 = await result1.toArray();

    if(result = []){
      // res.send(data);
    }

      for (let index = 0; index < result1.length; index++) {
        element = result1[index];
      var result2 = await db.collection('chats').find({conversation_id: element.id})
                      .sort( { date_created: -1 } )
                      .limit( 1 )
                      .next();
                      var user_id2 = 0;
                      if(element.users[0] == user_id){
                        user_id2 = element.users[1];
                      }else{
                        user_id2 = element.users[0];
        
                      }



                        if(result2 != null){
                       

      var sql = `
      SELECT m.path AS avatar,
      u.id, u.first_name ,u.last_name FROM users u LEFT JOIN user_media m ON(m.user_id = u.id AND m.avatar = 1) 
      WHERE u.id != ${user_id} AND u.id =  ${user_id2} LIMIT 1`;

      // console.log();

      const rows = await mysql.execute(sql);
        data_status = true;
        

   
         data = {
          message_user_id : user_id2,
          avatar:rows[0][0].avatar,
          last_name:rows[0][0].last_name,
          first_name:rows[0][0].first_name,
          id:rows[0][0].id,
          sender: result2.sender,
          receiver: result2.receiver,
          message: result2.message,
          conversation_id: result2.conversation_id
        }

          all_chats.push(data);


  }else{

  }

    };

    if(data_status){
      var a = {
        status:'success',
        data:all_chats
      };
      res.send(a);
    }else{
      res.send(data);
    }


       

  })
  

  

    



  




  app.use('/group_conversation', async (req,res,next)=>{
    const db = getDb();
    var user_id = req.body.user
    //fetch all single chats
    var all_result = [];
    var all_chats = [];
    var all_group_chat_id = '(';
    var count = 0;
    var data_status = false;
    var data = {
        status:'empty'
      }



    var result1 =   await db.collection('group_conversations').find({ users: { $in: [user_id] }});
    result1 = await result1.toArray();

    console.log('checking result');
    console.log(result1);
    if(result = []){
      // res.send(data);
    }

      for (let index = 0; index < result1.length; index++) {


        group_element = result1[index];
        console.log('element.group_id');
        console.log(group_element);
        
      var result2 = await db.collection('group_chats').find({group_id: group_element.group_id})
                      .sort( { date_created: -1 } )
                      .limit( 1 )
                      .next();

              
                        console.log('checking group result')
                        console.log(result2);

                        var group_id = group_element.group_id;
                        console.log('group_id');
                        console.log(group_element);

      var sql = `
      SELECT groups.name, groups.banner FROM groups WHERE groups.active = 1 AND groups.deleted = 0 AND groups.id = ${group_id}`;

        console.log(sql);
      const rows = await mysql.execute(sql);
        console.log('checkoing await');
        console.log(rows[0]);
        data_status = true;
        

   
         data = {
          group_id : group_element.group_id,
          banner:rows[0][0].banner,
          name:rows[0][0].name,
          id:group_element.group_id,

          sender: result2.sender,
          // receiver: result2.receiver,
          message: result2.message,
          // date_created: result2.date_created
        }

          all_chats.push(data);
          console.log(all_chats);


  // }else{

  // }

    };

    if(data_status){
      var a = {
        status:'success',
        data:all_chats
      };
      res.send(a);
    }else{
      res.send(data);
    }


       

  })
  




  app.use('/group_conversation2',(req,res,next)=>{
    const db = getDb();

    var user_id = req.body.user
    //fetch all single chats
    let all_result = [];
    let all_chat_id = '(';
    let all_group_chat_id = '(';
    let count = 1;
    db.collection('conversations').find({ users: { $in: [user_id] }})
   .toArray().then((result) => {


            // all_result = result;
            result.forEach(element => {
             

              if(count > 1){
                all_chat_id += ',';
              }

              if(element.users[0] == user_id){
                all_chat_id += element.users[1];
              }else{
                all_chat_id += element.users[0];

              }
              count++;
  
      
            });

            // 
            all_chat_id += ')';

              db.collection('group_conversations').find({ users: { $in: [user_id] }})
              .toArray().then((result2) => {
                count = 1;
                // all_result += result;
              
                  // all_result = result;
                  result2.forEach(element => {
             

                        if(count > 1){
                          all_group_chat_id += ',';
                        }

                        all_group_chat_id += element.group_id;

                        count++;
      
            });


            all_group_chat_id += ')';

          
            


            // mysql.execute('SELECT * FROM users limit 1')
            //         .then(([rows,fieldData]) => {
            //             // console.log(fieldData);
            //             // console.log(result);
            //             res.send(rows);
            //         }).catch((err) => {
            //             console.log(err);
            //     });







          
          
            }).catch((err) => {
                
            });;












  }).catch((err) => {
      
  });;
  // console.log('there');

    //fetch all group chats



    //send json
    // console.log('entered');
    //   a = [{a:2344,b:5}];
    // res.send(a);


    //fetch a




          //   mysql.execute('SELECT * FROM users limit 1')
          // .then(([rows,fieldData]) => {
          //     // console.log(fieldData);
          //     // console.log(result);
          //     res.send(rows);
          // }).catch((err) => {
          //     console.log(err);
          // });
            

  })


  app.use('/', async (req,res,next)=>{
    res.send('<h3>dcdcdcdcdcdcdc</h3>');
  })
 





module.exports = server;
// module.exports = app;




