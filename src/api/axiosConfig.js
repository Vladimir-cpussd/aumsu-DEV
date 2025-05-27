import axios from 'axios';

const axios = axios.create({
  baseURL: 'http://10.242.2.77:8080', // Ваш базовый URL
  timeout: 30000, // Таймаут 30 секунд для запросов
  
});


export default axios;
