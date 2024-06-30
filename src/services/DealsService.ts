import axios from 'axios';

interface DealsService {
  AddDeal: (data: object) => Promise<boolean>;
}

const AddDeal = async (data: object): Promise<boolean> => {
  try {
    await axios.post('/deals', data);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const dealsService: DealsService = {
  AddDeal: AddDeal,
};

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.headers['x-api-token'] = import.meta.env.VITE_API_KEY;
