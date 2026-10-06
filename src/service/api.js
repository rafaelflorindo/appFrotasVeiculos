import axios from "axios";

const api = axios.create({
    baseURL: "http://10.219.144.28:5000", 
    //baseURL: "http://localhost:5000", 
    timeout: 10000,
    headers: { "Content-Type": "application/json" }, 
});

export default api;