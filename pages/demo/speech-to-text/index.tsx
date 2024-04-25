import { Container, Grid } from "@mui/material"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "styles/tailwind.css"

import { AudioControl, ToggleAudio } from "components/audio-control"
import FMDeviceSelector from "components/fm-device-selector"

import Navbar from "../Navbar"
import getBaseAPI from "../api"

interface Message {
  id: number
  text: string
}

const baseAPI: string = getBaseAPI()

const Render: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [fmDeviceNames, setFMDeviceNames] = useState([])
  const [deviceName, setDeviceName] = useState("")
  const [freq, setFreq] = useState(0) // in MHz
  const [sampleRate, setSampleRate] = useState(0) // in kHz
  const [resampleRate, setResampleRate] = useState(0) // in kHz
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    getFMDevices()
  }, [])

  useEffect(() => {
    ToggleAudio(deviceName, isPlaying, audioContextRef)
  }, [isPlaying])

  useEffect(() => {
    // Initialize WebSocket connection
    const sampleRateHz = Math.round(sampleRate * 1000)
    const ws = new WebSocket(`ws://0.0.0.0:8000/ws/fm_speech/${deviceName}/${sampleRateHz}`)

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

  const handleAudioClick = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying)
  }

  useEffect(() => {
    // Scroll to the bottom of the message container on new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  async function setCurrentDevice(deviceName: string) {
    if (deviceName === null || deviceName === undefined) {
      throw new Error("deviceName is required")
    }
    try {
      const api = baseAPI + `/fm/devices/${deviceName}`
      const response = await axios.get(api, {
        validateStatus: (status) => {
          return status === 200 || status === 404
        },
      })
      if (response.status === 200) {
        const device = response.data.device
        const freq = parseFloat(device.freq) / 1000000
        const sampleRate = Number(device.sample_rate.slice(0, -1)) // remove "k" from the response
        const resampleRate = Number(device.resample_rate.slice(0, -1)) // remove "k" from the response
        setDeviceName(device.name)
        setFreq(freq)
        setSampleRate(sampleRate)
        setResampleRate(resampleRate)
        setIsPlaying(false) // stop audio when changing device
      } else {
        setDeviceName(deviceName)
        setFreq(0)
        setSampleRate(0)
        setResampleRate(0)
        setIsPlaying(false) // stop audio when changing device
      }
    } catch (error) {
      console.error("Error fetching:", error)
      throw new Error(`Error fetching when getting FM device: ${error}`)
    }
  }

  async function getFMDevices() {
    try {
      const api = getBaseAPI() + `/fm/devices`
      const response = await axios.get(api)
      let deviceNames = response.data.devices.map((device: { name: string }) => device.name)
      deviceNames.sort()
      deviceNames.unshift("dev0-mock") // add mock device to default
      setFMDeviceNames(deviceNames)
      if (deviceName === "") {
        setCurrentDevice(deviceNames[0])
      }
    } catch (error) {
      console.error("Error fetching:", error)
      throw new Error(`Error fetching when getting FM devices: ${error}`)
    }
  }

  return (
    <>
      <Navbar currentPage="Speech To Text">
        <></>
      </Navbar>
      <Container maxWidth="sm">
        <ToastContainer limit={2} autoClose={3500} />
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <FMDeviceSelector
              deviceName={deviceName}
              fmDeviceNames={fmDeviceNames}
              setCurrentDevice={setCurrentDevice}
            />
          </Grid>
          <Grid container item xs={1} alignItems="center" justifyContent="center">
            <AudioControl isPlaying={isPlaying} handleAudioClick={handleAudioClick} />
          </Grid>
        </Grid>
      </Container>
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
