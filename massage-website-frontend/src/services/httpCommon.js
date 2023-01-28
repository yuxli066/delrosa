import axios from "axios";

const api_port_number = '65535';
const base = process.env.NODE_ENV !== "production" ? `http://localhost:${api_port_number}/api/` : `massagewebsite-backend:${api_port_number}/api/`;

export default axios.create({
  baseURL: base,
  headers: {
    "Content-type": "application/json",
    "Accept": "application/json"
  },
});