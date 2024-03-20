export default function getBaseAPI() {
  const baseURL = "http://ec2-13-56-236-180.us-west-1.compute.amazonaws.com"
  const apiVersion = "v0"
  return `${baseURL}/${apiVersion}`
}
