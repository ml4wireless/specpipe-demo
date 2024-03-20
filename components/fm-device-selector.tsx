import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"

export default function ({
  deviceName,
  fmDeviceNames,
  setCurrentDevice,
}: {
  deviceName: string
  fmDeviceNames: string[]
  setCurrentDevice: (deviceName: string) => void
}) {
  return (
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
  )
}
