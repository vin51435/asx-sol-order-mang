'use client';

import { ModalWrapper } from './ModalWrapper';
import { Button, Form, Input, InputNumber, message } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { OrderDTO } from '@/libs/validation/order.dto';
import { setZodErrorsToForm } from '@/libs/validation/form.validation';
import { ZodError } from 'zod';
import UploadComponent from '@/components/UploadComponent';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const CreateOrderModal = ({ open, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();

  const onSubmit = async () => {
    const values = form.getFieldsValue();
    console.log('values', values);
    const formData = new FormData();
    try {
      setLoading(true);
      const updatedValues = {
        ...values,
        productImage: values.productImage?.[0]?.originFileObj,
      };
      console.log('values2', updatedValues);
      OrderDTO.parse(updatedValues);

      Object.keys(updatedValues).forEach((key) => {
        formData.append(key, updatedValues[key]);
      });

      await axios.post('/api/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Order created successfully');
      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (err) {
      if (err instanceof ZodError) {
        setZodErrorsToForm(err, form);
      } else {
        message.info((err as Error).message);
        console.error((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper open={open} onCancel={onClose} title="Create Order">
      <Form
        disabled={loading}
        onFinish={onSubmit}
        form={form}
        layout="vertical"
        className="space-y-4"
      >
        <Form.Item
          id="name"
          name="customerName"
          label="Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Customer Name" />
        </Form.Item>

        <div className="flex gap-4 mb-0">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Valid email is required',
              },
            ]}
            className="w-1/2"
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="contactNumber"
            label="Contact Number"
            className="w-1/2"
            rules={[{ required: true, message: 'Contact number is required' }]}
          >
            <Input placeholder="Contact Number" />
          </Form.Item>
        </div>

        <Form.Item
          name="shippingAddress"
          label="Shipping Address"
          rules={[{ required: true, message: 'Shipping address is required' }]}
        >
          <Input placeholder="Shipping Address" />
        </Form.Item>

        <div className="flex gap-4 mb-0">
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: 'Product name is required' }]}
            className="w-1/2"
          >
            <Input placeholder="Product Name" />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              {
                required: true,
                type: 'number',
                min: 1,
                message: 'Quantity must be at least 1',
              },
            ]}
            className="w-1/2"
          >
            <InputNumber className="!w-full" min={1} placeholder="Quantity" />
          </Form.Item>
        </div>

        <Form.Item
          name="productImage"
          label="Product Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            // e can be { fileList } or just the array
            if (Array.isArray(e)) return e;
            setFileList(e?.fileList || []);
            return e?.fileList || [];
          }}
          rules={[{ required: true, message: 'Product image is required' }]}
        >
          <UploadComponent fileList={fileList} />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </ModalWrapper>
  );
};

