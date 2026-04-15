import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  // 쿠키나 인증 헤더가 필요할 경우를 대비한 설정
  withCredentials: true, 
});

// 토큰이 있다면 요청 보낼 때마다 자동으로 헤더에 넣음 (현재는 JWT 세팅 전이므로 틀만 유지)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;