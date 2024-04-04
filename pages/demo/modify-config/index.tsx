import StopCircleIcon from "@mui/icons-material/StopCircle"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"
import { Container } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import axios from "axios"
import { AckPolicy, DeliverPolicy, connect, consumerOpts } from "nats.ws"
import React, { useEffect, useRef, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import ControlButtons from "components/control-button"
import FMDeviceSelector from "components/fm-device-selector"
import { FrequencySlider, ResampleRateSlider, SampleRateSlider } from "components/slider"

import getBaseAPI from "../api"
import Navbar from "../navbar"

const baseAPI: string = getBaseAPI()
function waitForAudioSourceToEnd(audioSource: AudioBufferSourceNode) {
  return new Promise((resolve) => {
    audioSource.onended = resolve
  })
}

export default function Render() {
  const [fmDeviceNames, setFMDeviceNames] = useState([])
  const [deviceName, setDeviceName] = useState("")
  const [freq, setFreq] = useState(0) // in MHz
  const [sampleRate, setSampleRate] = useState(0) // in kHz
  const [resampleRate, setResampleRate] = useState(0) // in kHz
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    getFMDevices()
  }, [])

  useEffect(() => {
    toggleAudio(deviceName, isPlaying)
  }, [isPlaying])

  async function stopAudio() {
    if (audioContextRef.current && audioContextRef.current.state === "running") {
      audioContextRef.current.close()
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }

  async function toggleAudio(deviceName: string, isPlaying: boolean) {
    const nc = await connect({
      servers: ["ws://ec2-13-56-236-180.us-west-1.compute.amazonaws.com:5222"],
      token: "mytoken",
    })

    const js = nc.jetstream()
    if (!isPlaying) {
      stopAudio()
      return
    }

    const opts = {
      ack_policy: AckPolicy.Explicit,
      deliver_policy: DeliverPolicy.New,
    }

    const pullSub = await js.pullSubscribe("specpipe.data.fm.dev0-mock", consumerOpts(opts))
    const pullBatch = 10

    try {
      setInterval(() => {
        pullSub.pull({ batch: pullBatch, no_wait: true })
      }, 200)

      let dat = new Uint8Array(2 * 8192 * pullBatch)
      let i = 0

      for await (const msg of pullSub) {
        const tmp = new Uint8Array(msg.data)
        dat.set(tmp, i)
        i += msg.data.length
        msg.ack()

        if (i == dat.length) {
          audioContextRef.current = new AudioContext()
          const audioContext = audioContextRef.current

          const audioBuffer = audioContext.createBuffer(1, 8192 * pullBatch, 32000)
          const channelData = audioBuffer.getChannelData(0)

          const dataView = new DataView(dat.buffer)
          const maxValue = Math.pow(2, 16) / 2
          for (let i = 0; i < dat.length; i += 2) {
            channelData[i / 2] = dataView.getInt16(i, true) / maxValue
          }

          const source = audioContext.createBufferSource()

          source.buffer = audioBuffer

          source.connect(audioContext.destination)
          source.start(0)

          await waitForAudioSourceToEnd(source)

          dat = new Uint8Array(2 * 8192 * pullBatch)
          i = 0
        }
      }
    } catch (error) {
      console.error("Error playing audio:", error)
    }
  }

  async function setCurrentDevice(deviceName: string) {
    if (deviceName === null || deviceName === undefined) {
      throw new Error("deviceName is required")
    }
    try {
      const api = baseAPI + `/fm/devices/${deviceName}`
      const response = await axios.get(api)
      const device = response.data.device
      const freq = parseFloat(device.freq) / 1000000
      const sampleRate = Number(device.sample_rate.slice(0, -1)) // remove "k" from the response
      const resampleRate = Number(device.resample_rate.slice(0, -1)) // remove "k" from the response
      setDeviceName(device.name)
      setFreq(freq)
      setSampleRate(sampleRate)
      setResampleRate(resampleRate)
    } catch (error) {
      console.error("Error fetching:", error)
      throw new Error(`Error fetching when getting FM devices: ${error}`)
    }
  }

  async function getFMDevices() {
    try {
      const api = getBaseAPI() + `/fm/devices`
      const response = await axios.get(api)
      const deviceNames = response.data.devices.map((device: { name: string }) => device.name)
      setFMDeviceNames(deviceNames)
      if (deviceName === "") {
        setCurrentDevice(deviceNames[0])
      }
    } catch (error) {
      console.error("Error fetching:", error)
      throw new Error(`Error fetching when getting FM devices: ${error}`)
    }
  }

  const handleModifyClick = () => {
    updateFMDevice(deviceName, (freq * 1000000).toString(), sampleRate.toString() + "k", resampleRate.toString() + "k")
  }

  const handleResetClick = () => {
    setCurrentDevice(deviceName)
  }

  const handleAudioClick = (deviceName: string) => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying)
  }

  async function updateFMDevice(device_name: string, freq: string, sample_rate?: string, resample_rate?: string) {
    if (!freq && !sample_rate && !resample_rate) {
      throw new Error("At least one parameter is required")
    }
    const api = getBaseAPI() + `/fm/devices/${device_name}`
    try {
      const response = await axios.put(api, { freq: freq, sample_rate: sample_rate, resample_rate: resample_rate })
      if (response.status === 200) {
        toast.success("FM Device updated successfully")
      } else {
        toast.error("Error updating FM Device")
      }
    } catch (error) {
      toast.error("Error updating FM Device")
    }
  }
  return (
    <>
      <Navbar currentPage="Modify Configuration">
        <></>
      </Navbar>
      {/* Device Selector */}
      <Container maxWidth="sm">
        <ToastContainer limit={2} autoClose={3500} />
        <FMDeviceSelector deviceName={deviceName} fmDeviceNames={fmDeviceNames} setCurrentDevice={setCurrentDevice} />
        <IconButton aria-label="playAudioBtn" onClick={() => handleAudioClick(deviceName)}>
          {isPlaying ? <StopCircleIcon /> : <VolumeUpIcon />}
        </IconButton>
      </Container>
      {/* Frequency Display */}
      <Container maxWidth="md">
        <p className="item-center flex justify-center text-13xl">{freq}</p>
        <p className="item-center flex justify-center text-6xl">MHz</p>
      </Container>

      <Container maxWidth="md">
        {/* Sliders */}
        <FrequencySlider freq={freq} setFreq={setFreq} />
        <SampleRateSlider sampleRate={sampleRate} setSampleRate={setSampleRate} />
        <ResampleRateSlider resampleRate={resampleRate} setResampleRate={setResampleRate} />
        {/* Control Buttons */}
        <ControlButtons handleModifyClick={handleModifyClick} handleResetClick={handleResetClick} />
      </Container>
    </>
  )
}
