'use client';

import { useAppDispatch } from '@/redux/hook';
import { hydrateUser } from '@/redux/slices/userSlice';
import { useEffect } from 'react';

export function AuthHydration() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      dispatch(hydrateUser(JSON.parse(stored)));
    }
  }, []);

  return null;
}

