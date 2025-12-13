import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../context/chatContext";
import { Send, Moon, Sun } from "lucide-react";

// import { io } from "socket.io-client";

// import socket from '../connectWS';

// import {connectWS} from '../connectWS'
// import { useRef } from "react";

// ---- THEME (ONE PLACE TO CONTROL ALL COLORS) ----
const theme = {
  light: {
    bg: "#ebe7e2",
    primary: "#C62828",
    sidebar: "#EFECEC",
    text: "#1B1B1B",
    card: "#FFFFFF",
    border: "#D7D3D3",
  },
  dark: {
    bg: "#181414",
    primary: "#FF3B3B",
    sidebar: "#221E1E",
    text: "#FFFFFF",
    card: "#2A2626",
    border: "#3A3535",
  },
};

const ChatRoom = () => {
  const { name, room, socket } = useChat();
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";

  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
  {
    id: Date.now(),
    sender: "bot",
    text: "Welcome to the chat! 🎉",
    ts: Date.now()
  },
  {
    id: Date.now() + 1,
    sender: name,
    text: "Thank you! Happy to join 😊",
    ts: Date.now()
  }
]);


  const current = darkMode ? theme.dark : theme.light;

  // const socket = useRef(null)

   useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      console.log("Connected to WebSocket");
      socket.emit("joinRoom", { username: name, roomid: room });
    };

    const handleNotice = ({ username, id }) => {
      console.log(`${username} has joined room ${id}`);
    };

    const handleMessage = (msg) => {
      console.log("Received:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("connect", handleConnect);
    socket.on("roomNotice", handleNotice);
    socket.on("chatMessage", handleMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("roomNotice", handleNotice);
      socket.off("chatMessage", handleMessage);
    };
  }, []);



  // ---- AUTO SCROLL ----
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ----- SEND MESSAGE -----
  const sendMessage = () => {
  if (!message.trim()) return;

  const msg = {
    id: Date.now(),
    sender: name,
    text: message.trim(),
    ts: Date.now()
  };

  // setMessages(prev => [...prev, msg]);
  console.log(setMessages)
  console.log(msg)

  // emit
  console.log("Sending:", msg)
  socket.emit("chatMessage", msg)

  
  setMessage("");

  // Bot response
  // setTimeout(() => {
  //   const botMsg = {
  //     id: Date.now() + 1,
  //     sender: "bot",
  //     text: "Got your message! 👌",
  //     ts: Date.now()
  //   };

  //   setMessages(prev => [...prev, botMsg]);
  // }, 600);
};

  // ----- ENTER KEY -----
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      className="w-full min-h-screen flex transition-all duration-300"
      style={{ backgroundColor: current.bg, color: current.text }}
    >
      {/* LEFT SIDEBAR */}
      <div
        className="w-[22vw] shadow-xl p-6 flex flex-col items-center border-r transition-all duration-300"
        style={{ backgroundColor: current.sidebar, borderColor: current.border }}
      >
        {/* Avatar */}
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-bold shadow-lg"
          style={{ backgroundColor: current.primary, color: "#fff" }}
        >
          {firstLetter}
        </div>

        {/* User Info */}
        <div className="mt-6 text-center">
          <h1 className="text-xl font-bold">{name}</h1>
          <p className="text-sm tracking-wide opacity-70 mt-1">
            Room ID: {room}
          </p>
        </div>

        {/* Room Info */}
        <div className="mt-10 w-full">
          <h2 className="uppercase text-xs font-semibold opacity-70 mb-3">
            Room Info
          </h2>

          <div
            className="rounded-xl shadow-md p-4 border transition-all duration-300"
            style={{ backgroundColor: current.card, borderColor: current.border }}
          >
            <p className="text-sm leading-relaxed">
              You are now connected to the room. Start chatting with style!
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col transition-all duration-300">

        {/* TOP BAR */}
        <div
          className="py-4 px-6 shadow-md flex items-center justify-between transition-all duration-300"
          style={{ backgroundColor: current.primary, color: "#fff" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-semibold">
              {firstLetter}
            </div>
            <h1 className="text-xl font-semibold">{name}</h1>
          </div>

          {/* Dark / Light Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((msg, index) => {

  const isMe = msg.sender === name;  
  const isBot = msg.sender === "bot"; 
  const isUser = !isMe && !isBot;      // any real user except me

  // Alignment
  const alignment = isMe ? "ml-auto" : "ml-0";

  // Colors
  let bgColor = current.card;
  let textColor = current.text;

  if (isMe) {
    bgColor = current.primary;
    textColor = "#fff";
  }

  if (isBot) {
    bgColor = "#FFF4A3";   // Yellow bubble
    textColor = "#333";
  }

  if (isUser) {
    bgColor = current.card;  // Normal white bubble
    textColor = current.text;
  }

  return (
    <div
      key={index}
      className={`max-w-[60%] px-4 py-3 rounded-xl shadow-md ${alignment}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {msg.text}
    </div>
  );
})}



          {/* AUTO SCROLL TARGET */}
          <div ref={chatEndRef}></div>
        </div>

        {/* MESSAGE INPUT */}
        <div
          className="p-4 border-t flex items-center gap-3 transition-all duration-300"
          style={{ borderColor: current.border }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 py-3 rounded-full shadow-md outline-none transition"
            style={{
              backgroundColor: current.card,
              borderColor: current.border,
              color: current.text,
            }}
          />

          <button
            onClick={sendMessage}
            className="p-3 rounded-full shadow-md transition hover:brightness-110"
            style={{ backgroundColor: current.primary, color: "#fff" }}
          >
            <Send size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChatRoom;
