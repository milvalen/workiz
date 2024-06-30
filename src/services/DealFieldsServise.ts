import { DealFieldData } from '../types/deal-fields.ts';
import axios from 'axios';

interface DealFieldsService {
  GetAllDealFields: () => Promise<object[]>;
  AddNewDealField: (data: DealFieldData) => Promise<boolean>;
}

const GetAllDealFields = async (): Promise<object[]> =>
  (await axios.get('/dealFields/')).data.data;

const AddNewDealField = async (data: DealFieldData): Promise<boolean> => {
  try {
    await axios.post('/dealFields', data);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const dealFieldsService: DealFieldsService = {
  GetAllDealFields: GetAllDealFields,
  AddNewDealField: AddNewDealField,
};
