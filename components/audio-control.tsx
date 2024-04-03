import StopCircleIcon from "@mui/icons-material/StopCircle"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"
import IconButton from "@mui/material/IconButton"
import { AckPolicy, DeliverPolicy, connect, consumerOpts } from "nats.ws"
import React, { useState } from "react"

function waitForAudioSourceToEnd(audioSource: AudioBufferSourceNode) {
  return new Promise((resolve) => {
    audioSource.onended = resolve
  })
}

async function toggleAudio(deviceName: string) {
  console.log("Playing audio for device:", deviceName)
  const nc = await connect({
    servers: ["ws://ec2-13-56-236-180.us-west-1.compute.amazonaws.com:5222"],
    token: "mytoken",
  })

  const js = nc.jetstream()

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
        const audioContext = new AudioContext()
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

export default function AudioControl(deviceName: string) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleAudioButtonClick = (deviceName: string) => {
    toggleAudio(deviceName)
    setIsPlaying(!isPlaying)
  }

  return (
    <IconButton aria-label="playAudioBtn" onClick={() => handleAudioButtonClick(deviceName)}>
      {isPlaying ? <StopCircleIcon /> : <VolumeUpIcon />}
    </IconButton>
  )
}
