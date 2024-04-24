import React, { useEffect, useRef, useState } from "react"
import "styles/tailwind.css"

import Navbar from "../Navbar"

interface Message {
  id: number
  text: string
}

const Render: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket("ws://0.0.0.0:8000/ws_fm_speech")

    // Event listener for receiving messages
    ws.onmessage = (event) => {
      const receivedMessage: Message = { id: messages.length, text: event.data }
      setMessages((prevMessages) => [...prevMessages, receivedMessage])
    }

    // Clean up function when the component unmounts
    return () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    // Scroll to the bottom of the message container on new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <>
      <Navbar currentPage="Speech To Text">
        <></>
      </Navbar>
      <>
        <div className="w-full max-w-screen-xl max-h-96 overflow-y-auto border border-gray-300 p-10 mt-20 bg-gray-100 rounded-lg mx-auto">
          {messages.map((message) => (
            <p
              key={message.id}
              className="text-gray-600 font-sans font-medium text-base py-2 border-b border-gray-300 mb-2"
            >
              {message.text}
            </p>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </>
    </>
  )
}

export default Render
