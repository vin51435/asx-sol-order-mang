'use client';

import { Provider } from 'react-redux';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import store from '@/redux/store';
import { AuthHydration } from '@/components/AuthHydration';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydration />
      <AntdRegistry>{children}</AntdRegistry>
    </Provider>
  );
}

