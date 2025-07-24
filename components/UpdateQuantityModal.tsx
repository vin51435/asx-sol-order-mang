'use client';

import { UpdateOrderQuantityInput } from '@/libs/validation/order.dto';
import { ModalWrapper } from './ModalWrapper';
import { Button, Form, Input, InputNumber, message } from 'antd';
import form from 'antd/es/form';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { register } from 'module';
import { IOrder, OrderDocument } from '@/types/order';

type Props = {
  open: boolean;
  onClose: () => void;
  order: IOrder;
  onSuccess?: () => void;
};

export const UpdateQuantityModal = ({
  open,
  onClose,
  order,
  onSuccess,
}: Props) => {
  const [form] = useForm();

  form.setFieldsValue({
    quantity: order.quantity,
  });

  const onSubmit = async () => {
    const values = await form.getFieldsValue();
    try {
      await axios.patch(`/api/orders/${order._id}`, values, {});
      message.success('Quantity updated');
      onClose();
      onSuccess?.();
    } catch {
      message.error('Failed to update');
    }
  };

  return (
    <ModalWrapper
      open={open}
      onCancel={onClose}
      title={`Update Quantity of ${order.productName}`}
    >
      <Form form={form} onFinish={onSubmit} className="space-y-4">
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
          <InputNumber
            className="!w-full"
            min={1}
            max={100}
            placeholder="Quantity"
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form>
    </ModalWrapper>
  );
};

