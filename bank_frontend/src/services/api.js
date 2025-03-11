//Basit bir Axios instance’ı oluşturarak, tüm isteklerde kullanacağımız ortak ayarları yapabiliriz. Örneğin Authorization header eklemek için bir interceptor da kullanabiliriz.
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// İsteğe bağlı: Token'ı localStorage'dan okuyup her isteğe eklemek için interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
