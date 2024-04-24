import { Slider, Typography } from "@mui/material"

export function FrequencySlider({ freq, setFreq }: { freq: number; setFreq: (freq: number) => void }) {
  return (
    <>
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
    </>
  )
}

export function SampleRateSlider({
  sampleRate,
  setSampleRate,
}: {
  sampleRate: number
  setSampleRate: (sampleRate: number) => void
}) {
  return (
    <>
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
        min={100}
        max={400}
        onChange={(event, value) => setSampleRate(Number(value))}
      />
    </>
  )
}

export function ResampleRateSlider({
  resampleRate,
  setResampleRate,
}: {
  resampleRate: number
  setResampleRate: (resampleRate: number) => void
}) {
  return (
    <>
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
        max={40}
        onChange={(event, value) => setResampleRate(Number(value))}
      />
    </>
  )
}
