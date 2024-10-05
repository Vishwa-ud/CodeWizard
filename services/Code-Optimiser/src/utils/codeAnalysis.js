import axios from 'axios';

//routing
export const analyzeCode = async (code) => {
  const response = await axios.post('http://localhost:3001/analyze', { code });
  return response.data;
};
