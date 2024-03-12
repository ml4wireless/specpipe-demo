import Navbar from "../Navbar"
import getBaseAPI from "../api"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { Box, InputLabel, MenuItem, FormControl, Select, Container, Typography, Slider, Button } from "@mui/material"
import BuildIcon from "@mui/icons-material/Build"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const baseAPI: string = getBaseAPI()

export default function Render() {
  const [fmDeviceNames, setFMDeviceNames] = useState([])
  const [deviceName, setDeviceName] = useState("")
  const [freq, setFreq] = useState(0) // in MHz
  const [sampleRate, setSampleRate] = useState(0) // in kHz
  const [resampleRate, setResampleRate] = useState(0) // in kHz
  useEffect(() => {
    getFMDevices()
  }, [])

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
      <Container maxWidth="sm">
        <ToastContainer limit={2} autoClose={3500} />
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">FM Device</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={deviceName}
              label="FM Device"
              onChange={() => setCurrentDevice(deviceName)}
            >
              {fmDeviceNames.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Container>

      <Container maxWidth="md">
        <p className="item-center flex justify-center text-13xl">{freq}</p>
        <p className="item-center flex justify-center text-6xl">MHz</p>
      </Container>

      <Container maxWidth="md">
        {/* Frequency */}
        <Typography id="freq-slider" variant="h5" gutterBottom>
          Frequency: {freq} MHz
        </Typography>
        <Slider
          value={freq}
          valueLabelDisplay="auto"
          shiftStep={0.1}
          step={0.1}
          marks
          min={88}
          max={108}
          onChange={(event, value) => setFreq(Number(value))}
        />
        {/* Sample Rate */}
        <Typography id="sample-rate-slider" variant="h5" gutterBottom>
          Sample Rate: {sampleRate} kHz
        </Typography>
        <Slider
          aria-label="Sample Rate"
          value={sampleRate}
          valueLabelDisplay="auto"
          shiftStep={0.1}
          step={0.1}
          marks
          min={10}
          max={500}
          onChange={(event, value) => setSampleRate(Number(value))}
        />
        {/* Resample Rate */}
        <Typography id="resample-rate-slider" variant="h5" gutterBottom>
          Resample Rate: {resampleRate} kHz
        </Typography>
        <Slider
          aria-label="Resample Rate"
          value={resampleRate}
          valueLabelDisplay="auto"
          shiftStep={0.1}
          step={0.1}
          marks
          min={10}
          max={50}
          onChange={(event, value) => setResampleRate(Number(value))}
        />
        <Container className="flex items-center justify-center p-10">
          <Button
            variant="contained"
            size="large"
            className="mr-8 h-12 w-32 border-primary-900 bg-primary-900"
            onClick={handleModifyClick}
            startIcon={<BuildIcon />}
          >
            Modify
          </Button>
          <Button
            variant="contained"
            size="large"
            className="mr-8 h-12 w-32 border-primary-900 bg-primary-900"
            onClick={handleResetClick}
            startIcon={<RestartAltIcon />}
          >
            Reset
          </Button>
        </Container>
      </Container>
    </>
  )
}
