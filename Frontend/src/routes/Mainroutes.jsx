import React from 'react'
import { Routes, Route} from 'react-router-dom'
import ChatRoom from '../pages/ChatRoom'
import JoinPage from '../pages/JoinPage'
import { useState } from 'react'

// const Mainroutes = () => {

//   const [name, setName] = useState('');
//     const [room, setRoom] = useState('');  

//   return (
//     <div>
//         <Routes>
//             <Route 
//   path="/" 
//   element={<JoinPage name={name} room={room} setName={setName} setRoom={setRoom} />} 
// />

//             <Route path='/chatroom' element={<ChatRoom name={name} room={room}/>}/>
//         </Routes>
//     </div>
//   )
// }

// export default Mainroutes

const Mainroutes = () => {
  return (
    <Routes>
      <Route path="/" element={<JoinPage />} />
      <Route path="/chatroom" element={<ChatRoom />} />
    </Routes>
  );
};

export default Mainroutes;
