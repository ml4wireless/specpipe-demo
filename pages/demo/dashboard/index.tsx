import Navbar from "../navbar"

export default function Render() {
  return (
    <>
      <Navbar currentPage="Dashboard">
        <></>
      </Navbar>
      <iframe
        src="http://ec2-13-56-236-180.us-west-1.compute.amazonaws.com:3000/d/yQUo5l17k/specpipe-dashboard"
        style={{ height: "950px", width: "100%" }}
      ></iframe>
    </>
  )
}
