import axios from 'axios';

const backend = axios.create({
  baseURL: process.env.REACT_APP_BBCLOADER_API_ENDPOINT || 'http://192.168.168.4:5000'
});

export default backend;
