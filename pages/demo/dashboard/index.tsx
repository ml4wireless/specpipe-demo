import Navbar from "../Navbar"

export default function Render() {
  return (
    <>
      <Navbar currentPage="Dashboard">
        <></>
      </Navbar>
      <iframe
        src="http://ec2-13-56-236-180.us-west-1.compute.amazonaws.com:3000/d/specpipe-prod/specpipe"
        style={{ height: "950px", width: "100%" }}
      ></iframe>
    </>
  )
}
