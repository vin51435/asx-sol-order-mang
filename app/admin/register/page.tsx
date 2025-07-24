'use client';

import { AdminDTO } from '@/libs/validation/adminLogin.dto';
import { setZodErrorsToForm } from '@/libs/validation/form.validation';
import { useAppDispatch } from '@/redux/hook';
import { login } from '@/redux/slices/userSlice';
import { Form, Input, Button, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ZodError } from 'zod';

export default function AdminRegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = useForm();
  const dispatch = useAppDispatch();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      AdminDTO.parse(values);
      const res = await axios.post('/api/auth/register', values);

      dispatch(login(res.data.data));
      message.success('Admin registered');
      router.push('/');
    } catch (err) {
      if (err instanceof ZodError) {
        setZodErrorsToForm(err, form);
      } else {
        message.error('Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Admin Registration</h1>
      <Form
        form={form}
        disabled={loading}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input type="email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

