import axios from 'axios';

const API_URL = 'http://localhost:5000/api/settings';

export interface Settings {
  votesPerCouncilor: number;
  totalCouncilors: number;
  updatedAt: string;
}

export const getSettings = async (): Promise<Settings> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateSettings = async (data: { votesPerCouncilor: number, totalCouncilors: number }): Promise<Settings> => {
  const response = await axios.put(API_URL, data);
  return response.data;
};
