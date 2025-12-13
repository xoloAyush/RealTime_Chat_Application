import { createContext, useContext, useState, useEffect } from "react";
import socket from "../connectWS";  // <-- correct!

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

  // const socket = useRef(null)

  const [name, setName] = useState("");

  const [room, setRoom] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("chat-room") || "";
    }
    return "";
  });

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("chat-name", name);
  //   }
  // }, [name]);

  useEffect(() => {
    if (typeof window !== "undefined" && room) {
      localStorage.setItem("chat-room", room);
    }
  }, [room]);

  return (
    <ChatContext.Provider value={{ name, setName, room, setRoom, socket }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
