'use client';

import { Provider } from 'react-redux';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import store from '@/redux/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AntdRegistry>{children}</AntdRegistry>
    </Provider>
  );
}

