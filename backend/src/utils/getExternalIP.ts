import axios from 'axios';

export interface IPData {
  ip: string;
  country: string;
}

interface IPCallback {
  (params: IPData): void;
}

async function getExternalIP(cb: IPCallback): Promise<void> {
  console.log('Getting external IP...');
  try {
    const response = await axios.get('https://api.ipify.org');
    const ip = response.data;
    const response2 = await axios.get(`https://ipapi.co/${ip}/country_name/`);
    const country = response2.data;

    cb({ ip, country });
  } catch (error) {
    console.error(error);
    cb({ ip: 'error', country: 'error' });
  }
}

export default getExternalIP;
