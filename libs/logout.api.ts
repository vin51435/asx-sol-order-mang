import { logout } from '@/redux/slices/userSlice';
import store from '@/redux/store';
import axios from 'axios';

export const logoutUser = () => {
  return axios.post('/api/auth/logout').then((res) => {
    localStorage.removeItem('user');
    store.dispatch(logout());
  });
};

