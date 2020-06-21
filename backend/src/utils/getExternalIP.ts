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
  let response, ip, country;

  try {
    response = await axios.get('https://api.ipify.org');
    ip = response.data;
  } catch (error) {
    console.error(error);
    cb({ ip: 'error', country: 'error' });
  }

  try {
    response = await axios.get(`https://ipapi.co/${ip}/country_name/`);
    country = response.data;

    cb({ ip, country });
  } catch (error) {
    console.error(error);
    cb({ ip, country: 'error' });
  }
}

export default getExternalIP;
