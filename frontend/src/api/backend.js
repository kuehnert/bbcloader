import axios from 'axios';

const backend = axios.create({
  baseURL: process.env.REACT_APP_BBCLOADER_API_ENDPOINT || 'http://localhost:5000'
});

export default backend;
