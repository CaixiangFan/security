import Web3 from 'web3';
import dotenv from 'dotenv';
dotenv.config('.env');

const getKey = async () => {
  const web3 = new Web3(process.env.RPC_URL);
  console.log(web3.provider);
  const key = await web3.eth.getStorageAt(process.env.PRIVACY_COUNTRACT, 5);
  const trim_key = key.slice(0, 34);
  console.log({trim_key});
}

getKey()