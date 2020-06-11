import axios from 'axios';

async function getExternalIP(cb: (ip: string) => void) {
  console.log('Getting external IP...');
  try {
    const response = await axios.get('https://api.ipify.org');

    cb(response.data);
  } catch (error) {
    console.error(error);
    cb('');
  }
}

export default getExternalIP;
