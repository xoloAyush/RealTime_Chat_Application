import app from './src/app.js'
import { createServer } from "http";
import { Server } from "socket.io";

import cors from 'cors'
import crypto from "crypto";

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// const room = 'group'

io.on("connection", (socket) => {
  console.log(`user is connected ${socket.id}`);

  // const roomid = socket.roomid
const userID = crypto.randomUUID();

  socket.on('joinRoom', async ({ username, roomid }) => {
    console.log(`${username} is joining room: ${roomid}`);

  socket.username = username;  // store username
  socket.roomid = roomid; // <--- SAVE ROOM ID ON SOCKET

    socket.join(roomid);

    socket.to(roomid).emit("roomNotice", {
      username,
      id: userID,
      roomid
    });

  });

  // FIXED POSITION (NOT inside joinRoom)
  socket.on('chatMessage', (msg) => {
  const roomid = socket.roomid;
  if (!roomid) return;

  msg.sender = socket.username; // enforce correct sender identity

  io.to(roomid).emit('chatMessage', msg);
});

  socket.on('typing', (name)=>{
    const roomid = socket.roomid;
    socket.to(roomid).emit('typing', name)
  })
  socket.on('stopTyping', (name)=>{
    const roomid = socket.roomid;
    socket.to(roomid).emit('stopTyping', name)
  })

});


app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});


httpServer.listen(5000,"127.0.0.1",()=>{
    console.log('server runs on port 5000')
})