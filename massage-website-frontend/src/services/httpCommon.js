import axios from "axios";

// constant variables
const base = process.env.NODE_ENV !== "production" ? "http://localhost:3000/api/" : "remote url";

export default axios.create({
  baseURL: base,
  headers: {
    "Content-type": "application/json",
    "Accept": "application/json"
  },
});