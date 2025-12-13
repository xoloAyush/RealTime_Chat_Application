import React from 'react'
import Mainroutes from './routes/Mainroutes'
import { ChatProvider } from './context/chatContext'

const App = () => {
  return (
    <ChatProvider>
      <Mainroutes/>
    </ChatProvider>
  )
}

export default App
