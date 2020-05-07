import axios from "axios";
// const url = "http://localhost:4000";
const url = "https://hubcode-api.nal.vn"

export default axios.create({
  baseURL: url
});
