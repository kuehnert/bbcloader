const axios = require('axios');

async function getExternalIP(cb) {
  console.log('Getting external IP...');
  try {
    const response = await axios.get('https://api.ipify.org');

    cb(response.data);
  } catch (error) {
    console.error(error);
    cb(null);
  }
}

module.exports = getExternalIP;
