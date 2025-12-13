import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router";
import {useChat} from '../context/chatContext'

// import { io } from "socket.io-client";

// import {connectWS} from '../connectWS'
// import { useRef } from "react";

// const JoinPage = ({ name, room, setName, setRoom }) => {
const JoinPage = () => {
  // const [name, setName] = useState('');
  // const [room, setRoom] = useState('');

  const { name, room, setName, setRoom, socket } = useChat()

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });

  let navigate = useNavigate();

  // const socket = useRef(null)

  const joinHandler = (e) => {
  e.preventDefault();

  const username = e.target.name.value;
  const roomid   = e.target.room.value;

  console.log(username)

  if (!socket.connected) socket.connect();

    const handleConnect = () => {
      console.log("Connected to WebSocket");
    };

    const handleRoomNotice = ({ username, id }) => {
      console.log(`${username} has joined room ${id}`);
    };

    socket.on("connect", handleConnect);
    socket.on("roomNotice", handleRoomNotice);

    socket.emit('joinRoom', 
    { username, roomid })

  // Save into context
  setName(username);
  setRoom(roomid);

  navigate('/chatroom');

  e.target.reset(); // this now works because inputs are uncontrolled

    return () => {
      socket.off("connect", handleConnect);
      socket.off("roomNotice", handleRoomNotice);
    };

  
};


  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  // ★ Smooth trailing motion
  useEffect(() => {
    const speed = 0.12; // adjust smoothness here (0.05 = very smooth, 0.2 = fast)

    const follow = () => {
      setSmoothPos(prev => ({
        x: prev.x + (cursorPos.x - prev.x) * speed,
        y: prev.y + (cursorPos.y - prev.y) * speed,
      }));
      requestAnimationFrame(follow);
    };

    follow();
  }, [cursorPos]);

  return (
    <div 
      className="relative w-full min-h-screen bg-[#EFEAE3] flex justify-center items-center px-4 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* IMAGE BACKGROUND REVEAL */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxhcHRvcCUyMHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",

          /* ★ Now using smoothPos instead of cursorPos */
          maskImage: `radial-gradient(circle 100px at ${smoothPos.x}px ${smoothPos.y}px, white 98%, transparent 99%)`,
          WebkitMaskImage: `radial-gradient(circle 100px at ${smoothPos.x}px ${smoothPos.y}px, white 98%, transparent 99%)`,

          zIndex: 0
        }}
      />

      <div 
  className="
    absolute 
    top-[20%] 
    right-[38%] 
    w-[70vh] 
    h-[70vh] 
    rounded-full 
    bg-[linear-gradient(to_top_right,#fe650c,#FE330C,#fe650c)] 
    blur-[20px] 
    -z-10
    animate-skew
  "
></div>

      {/* ★★ YOUR ORIGINAL UI (UNTOUCHED) ★★ */}
      <div className="relative z-10 
        w-full sm:w-[70vw] md:w-[50vw] lg:w-[35vw] 
        bg-[#ebe7e2] shadow-[#646261] px-6 py-8 rounded-xl shadow-lg inset-shadow-2xs">



        <h1 className="font-bold text-[8vw] sm:text-[5vw] md:text-[3vw] mb-10 text-center">
          Join ChatRoom
        </h1>

        <form onSubmit={joinHandler} className="flex flex-col gap-6">

          {/* Name */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <label className="sm:w-[38%] text-[4vw] sm:text-[2.3vw] md:text-[1.2vw] font-semibold">
              Name:
            </label>
            <input required name="name" className="bg-zinc-100 px-3 py-2 rounded w-full" />

          </div>

          {/* ChatRoom ID */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <label className="sm:w-[38%] text-[4vw] sm:text-[2.3vw] md:text-[1.2vw] font-semibold">
              ChatRoom ID:
            </label>
            <input required name="room" className="bg-zinc-100 px-3 py-2 rounded w-full" />

          </div>

          {/* Button */}
          <button 
            className="
              relative overflow-hidden
              font-semibold w-full px-3 rounded py-2 text-white 
              bg-[#f44d2c] transition-all duration-300 ease-out
              hover:shadow-lg shadow-[#e45b5b]

              after:content-['']
              after:absolute
              after:left-0
              after:top-full
              after:w-full
              after:h-full
              after:bg-[#e32c2c]
              after:transition-all after:duration-300
              after:z-0
              hover:after:top-0
            "
          >
            <span className="relative z-10">Join</span>
          </button>

        </form>
      </div>
      {/* END OF YOUR ORIGINAL FORM */}
    </div>
  );
}

export default JoinPage;
