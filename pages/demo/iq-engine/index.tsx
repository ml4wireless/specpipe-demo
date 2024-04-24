import Navbar from "../navbar"

export default function Render() {
  return (
    <>
      <Navbar currentPage="IQ Engine">
        <></>
      </Navbar>
      <iframe
        src="https://iqengine.org/browser"
        style={{ height: "1000px", width: "100%" }}
      ></iframe>
    </>
  )
}
