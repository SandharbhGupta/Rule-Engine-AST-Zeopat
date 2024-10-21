import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const createRule = (rule) => API.post('/rules/create_rule', { rule });
export const evaluateRule = (userData) => API.post('/evaluate/evaluate_rule', { userData });

export default API;
