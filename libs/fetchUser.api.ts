import { login } from '@/redux/slices/userSlice';
import store from '@/redux/store';
import axios from 'axios';

export const fetchUser = () => {
  return axios.get('/api/auth').then((res) => {
    const user = res.data.data;
    localStorage.setItem('user', JSON.stringify(user));
    store.dispatch(login(user));
    return user;
  });
};

