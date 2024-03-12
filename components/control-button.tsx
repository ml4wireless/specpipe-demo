import BuildIcon from "@mui/icons-material/Build"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { Button, Container } from "@mui/material"

export default function ControlButtons({
  handleModifyClick,
  handleResetClick,
}: {
  handleModifyClick: () => void
  handleResetClick: () => void
}) {
  return (
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
  )
}
