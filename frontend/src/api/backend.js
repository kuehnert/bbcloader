import axios from 'axios';

const backend = axios.create({
  // baseURL: 'http://192.168.168.4:5000'
  baseURL: 'http://localhost:5000'
});

export default backend;
