const mongoConnect = require('./utils/database').mongoConnect;
const Conversation = require('./models/Conversation');
const Conversation2 = require('./models/GroupConversation');
const server = require('./utils/connect');
const crypto = require("crypto");
const axios = require('axios');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

console.log('pppppppppppppp');

// var io = require("socket.io")(server);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const conversation = new Conversation;
const GroupConversation = new Conversation2;
let conversation_id = '';



//middlewre

var clients = {};
var group_clients = {};
var notification_clients = {};







console.log('tttttttttttttttttttt');



io.on("connection", (socket) => {
  console.log("connetetd");
  console.log(socket.id, "has joined");

  
  socket.on("notifications", (user) => {
    console.log('user enetrred');
    notification_clients[user] = socket;
    const id = crypto.randomBytes(16).toString("hex");
    
   
  });



  
  
  socket.on('joinRoom', ( username, room ) => {

    socket.join(room);

    
    // io.sockets.in(room).emit('group_message', {message: 'hello'});

    GroupConversation.saveConversation(username,room)
    .then(result => {
      
      // console.log('result1');
      // console.log(result);
     
      GroupConversation.getMessages(room).then((result2) => {
        console.log('result2');
        // if(result != ''){
        //   clients[user1].emit("old_group_message", result);
        // }
        io.sockets.in(room).emit('group_old_message', result2);
        
      }).catch((err) => {
        
      });;
      // console.log(conversation_id)
    }).catch((err) => {
      console.log(err);
     });;
    // console.log(clients);
  });
 








  socket.on("group_message", (data) => {
    console.log(data);

    // let targetId = msg.targetId;

    
    GroupConversation.saveMessage(data).then(result => {
        console.log(result);
        io.sockets.in(data.group_id).emit('group_message', {message: data.message,sender:data.user});
      }).catch((err) => {

        console.log(err);
       });;


   
  });






  



  
  socket.on("signin", (user1,user2) => {
    console.log('checking users');
    console.log(user1);
    console.log(user2);
    clients[user1] = socket;
    const id = crypto.randomBytes(16).toString("hex");
    
    conversation.saveConversation(id,user1,user2)
    .then(result => {
      console.log('result2....');
      console.log(result)
      
      if(conversation.status == 'new'){
        conversation_id = id;
      }else{
        conversation_id = result;
      }
      console.log('conversation_id....');
      console.log(conversation_id);
      
      conversation.getMessages(conversation_id).then((result) => {
        console.log('result3....');
        console.log(result);
        if(result != ''){
        console.log('result3....-------------------');

          clients[user1].emit("old_message", result);
        }
        
      }).catch((err) => {
        console.log(err)
      });;
      // console.log(conversation_id)
    }).catch((err) => {
      console.log(err);
     });;
    // console.log(clients);
  });
 
  socket.on("message", (msg) => {
    console.log(msg);
    console.log('---tat----');
    let targetId = msg.targetId;

    if(conversation_id == ''){
      console.log('empty');
    }

     conversation.saveMessage(conversation_id,msg).then(result => {
        console.log(result);
        if (clients[targetId]){
          clients[targetId].emit("message", msg);
        }


        if (notification_clients[msg.targetId]){
        notification_clients[msg.targetId].emit("receive_notification", {
          'type':'message'
        });
        }

        
        const qs = require('qs');
// axios
//   .post('http://192.168.157.240/project/cool_girls_app/processors/send-notification.php', qs.stringify({
//     sender: msg.sourceId,
//     receiver: msg.targetId,
//     message:msg.message
// })
// )
  // .then(res => {
  //   // console.log(`statusCode: ${res.status}`)
  //   // console.log(res)
  // })
  // .catch(error => {
  //   console.error(error)
  // })





      }).catch((err) => {

        console.log(err);
       });;


   
  });
});


function handleErrors(err){
  console.log(err);
}

io.on('connect_error', err => handleErrors(err));
io.on('connect_failed', err => handleErrors(err));
io.on('disconnect', err => handleErrors(err));

// 

