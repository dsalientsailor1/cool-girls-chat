const mongoConnect = require('./utils/database').mongoConnect;
const Conversation = require('./models/Conversation');
const Conversation2 = require('./models/GroupConversation');
const server = require('./utils/connect');
const crypto = require("crypto");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');


var io = require("socket.io")(server);
const conversation = new Conversation;
const GroupConversation = new Conversation2;
let conversation_id = '';



//middlewre

var clients = {};
var group_clients = {};
var notification_clients = {};

io.on("connection", (socket) => {
  console.log("connetetd");
  console.log(socket.id, "has joined");


  // socket.on('join', function (data) {
  //   socket.join(data.email); // We are using room of socket io
  // });

  
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













    // console.log(username);
    // const user = userJoin(socket.id, username, room);
    
    // console.log('xsxsxsxsxsxsxssx');
    // socket.join(user.room);
    // console.log(user.room);

    // Welcome current user
    // socket.emit('group_message', formatMessage(botName, 'Welcome to ChatCord!'));
    // clients[user1].emit("old_message", result);
    // Broadcast when a user connects
    // socket.emit( 'group_message',
    // 'ddcdcdcdcdcdc');

    // socket.broadcast
    //   .to(user.room)
    //   .emit(
    //     'group_message',
    //     'ddcdcdcdcdcdc'
    //   );

    // Send users and room info
    // io.to(user.room).emit('roomUsers', {
    //   room: user.room,
    //   users: getRoomUsers(user.room)
    // });
  // });

































  
  // socket.on("notification_signin", (user) => {
  //   console.log('checking users');
  //   console.log(user);
  //   notification_clients[user] = socket;
  //   // const id = crypto.randomBytes(16).toString("hex");
 
    





   
  
  //   // Listen for chatMessage
  //   socket.on('chatMessage', msg => {
  //     const user = getCurrentUser(socket.id);
  //     io.to(user.room).emit('message', formatMessage(user.username, msg));
  //   });
  
  //   // Runs when client disconnects
  //   socket.on('disconnect', () => {
  //     const user = userLeave(socket.id);
  
  //     if (user) {
  //       io.to(user.room).emit(
  //         'messdage',
  //         formatMessage(botName, `${user.username} has left the chat`)
  //       );
  
  //       // Send users and room info
  //       io.to(user.room).emit('roomUsers', {
  //         room: user.room,
  //         users: getRoomUsers(user.room)
  //       });
  //     }
  //   });





















  //   setTimeout(() => {
  //     console.log('sending');
  //     notification_clients[user].emit("notification", 'test');
  //   }, 5000);


  //  setInterval(() => {
  //     console.log('sending');
  //     notification_clients[user].emit("notification", 'test');
  //   }, 500);
    
  
  //   // console.log(clients);
  // });


  // socket.on("group_signin", (user_id,group_id) => {
  //   console.log('checking users');
  //   console.log(user_id);
  //   console.log(group_id);
  //   group_clients[group_id][user_id] = socket;

  //   console.log(group_clients);
  //   const id = crypto.randomBytes(16).toString("hex");
    
  //   // conversation.saveConversation(id,user1,user2)
  //   // .then(result => {
  //   //   console.log('result2....');
  //   //   console.log(result)
      
  //   //   if(conversation.status == 'new'){
  //   //     conversation_id = id;
  //   //   }else{
  //   //     conversation_id = result;
  //   //   }
  //   //   console.log('conversation_id....');
  //   //   console.log(conversation_id);
      
  //   //   conversation.getMessages(conversation_id).then((result) => {
  //   //     console.log('result3....');
  //   //     console.log(result);
  //   //     if(result != ''){
  //   //       clients[user1].emit("old_message", result);
  //   //     }
        
  //   //   }).catch((err) => {
        
  //   //   });;
  //   //   // console.log(conversation_id)
  //   // }).catch((err) => {
  //   //   console.log(err);
  //   //  });;




  //   // console.log(clients);
  // });
 
  // socket.on("message", (msg) => {
  //   console.log(msg);
  //   let targetId = msg.targetId;

  //   if(conversation_id == ''){
  //     console.log('empty');
  //   }
  //    conversation.saveMessage(conversation_id,msg).then(result => {
  //       console.log(result);
  //       if (clients[targetId]){
  //         clients[targetId].emit("message", msg);
  //       }
  //     }).catch((err) => {

  //       console.log(err);
  //      });;


   
  // });



















  
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
          clients[user1].emit("old_message", result);
        }
        
      }).catch((err) => {
        
      });;
      // console.log(conversation_id)
    }).catch((err) => {
      console.log(err);
     });;
    // console.log(clients);
  });
 
  socket.on("message", (msg) => {
    console.log(msg);
    let targetId = msg.targetId;

    if(conversation_id == ''){
      console.log('empty');
    }
     conversation.saveMessage(conversation_id,msg).then(result => {
        console.log(result);
        if (clients[targetId]){
          clients[targetId].emit("message", msg);
        }
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
