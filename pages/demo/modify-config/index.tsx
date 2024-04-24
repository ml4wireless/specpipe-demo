import { Container, Grid } from "@mui/material"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { AudioControl, ToggleAudio } from "components/audio-control"
import ControlButtons from "components/control-button"
import FMDeviceSelector from "components/fm-device-selector"
import { FrequencySlider, ResampleRateSlider, SampleRateSlider } from "components/slider"

import getBaseAPI from "../api"
import Navbar from "../Navbar"

const baseAPI: string = getBaseAPI()

export default function Render() {
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

  const handleModifyClick = () => {
    updateFMDevice(deviceName, (freq * 1000000).toString(), sampleRate.toString() + "k", resampleRate.toString() + "k")
    setIsPlaying(false) // stop audio when changing frequency
  }

  const handleResetClick = () => {
    setCurrentDevice(deviceName)
  }

  const handleAudioClick = () => {
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
