const mongoConnect = require('./utils/database').mongoConnect;
const Conversation = require('./models/Conversation');
const server = require('./utils/connect');
const crypto = require("crypto");

var io = require("socket.io")(server);
const conversation = new Conversation;
let conversation_id = '';


//middlewre

var clients = {};

io.on("connection", (socket) => {
  console.log("connetetd");
  console.log(socket.id, "has joined");
  
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





