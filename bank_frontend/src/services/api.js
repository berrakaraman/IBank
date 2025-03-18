<<<<<<< HEAD
//Basit bir Axios instance’ı oluşturarak, tüm isteklerde kullanacağımız ortak ayarları yapabiliriz. Örneğin Authorization header eklemek için bir interceptor da kullanabiliriz.
=======
//Basit bir Axios instance’ı oluşturarak, tüm isteklerde kullanacağımız ortak ayarları yapabiliriz.
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

<<<<<<< HEAD
// İsteğe bağlı: Token'ı localStorage'dan okuyup her isteğe eklemek için interceptor
=======
>>>>>>> c6c4b34 (döviz işlemleri eklendi)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
