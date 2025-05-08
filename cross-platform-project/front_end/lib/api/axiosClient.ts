/// api/axiosClient.ts
import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.1.10:3000/api/",
  // bỏ timeout: 5000
});