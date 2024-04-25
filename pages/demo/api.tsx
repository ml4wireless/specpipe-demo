export default function getBaseAPI() {
  const baseURL = "http://ec2-54-215-201-36.us-west-1.compute.amazonaws.com"
  const apiVersion = "v0"
  return `${baseURL}/${apiVersion}`
}
