'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  message,
  Table,
  Popconfirm,
  Card,
  TableColumnsType,
  Image,
  Input,
} from 'antd';
import axios from 'axios';
import { CreateOrderModal } from '@/components/CreateOrder.model';
import { fetchUser } from '@/libs/fetchUser.api';
import { login, logout } from '@/redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { UpdateQuantityModal } from '@/components/UpdateQuantityModal';
import type { IOrder } from '@/types/order';

export default function OrderPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter, setSorter] = useState({
    field: 'createdAt',
    order: 'desc' as 'asc' | 'desc',
  });

  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const fetchOrders = async (page = pagination.current) => {
    try {
      setLoading(true);
      const res = await axios.get('/api/orders', {
        params: {
          page,
          limit: pagination.pageSize,
          sortField: sorter.field,
          sortOrder: sorter.order,
          search: search || undefined,
          searchFields: [
            'customerName',
            'email',
            'contactNumber',
            'productName',
          ],
        },
      });

      setOrders(res.data.data);
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: res.data.total || res.data.meta?.total || 0,
      }));
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    await axios.delete(`/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    message.success('Order deleted');
    fetchOrders(pagination.current);
  };

  const handleTableChange = (pagination: any, _filters: any, sorter: any) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));

    if (sorter.field) {
      setSorter({
        field: sorter.field,
        order: sorter.order === 'ascend' ? 'asc' : 'desc',
      });
    }

    fetchOrders(pagination.current);
  };

  useEffect(() => {
    fetchUser()
      .then((user) => user && dispatch(login(user)))
      .catch(() => dispatch(logout()));

    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => fetchOrders(pagination.current),
      30 * 1000,
    );
    return () => clearInterval(interval);
  }, [pagination.current]);

  const columns: TableColumnsType<IOrder> = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      sorter: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      ellipsis: true,
      width: 140,
    },
    {
      title: 'Shipping Address',
      dataIndex: 'shippingAddress',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      sorter: true,
      ellipsis: true,
      width: 180,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      sorter: true,
      width: 100,
    },
    {
      title: 'Image',
      dataIndex: 'productImageUrl',
      width: 80,
      render: (url) =>
        url ? (
          <Image
            src={url}
            alt="Product"
            width={56}
            height={56}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            placeholder={<div className="w-14 h-14 bg-gray-200" />}
          />
        ) : (
          'No Image'
        ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      render: (date) => new Date(date).toLocaleString(),
      sorter: true,
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Actions',
      width: 160,
      fixed: 'right',
      render: (_: any, record: IOrder) =>
        isLoggedIn && (
          <div className="flex gap-2">
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => deleteOrder(record._id!)}
            >
              <Button danger size="small">
                Delete
              </Button>
            </Popconfirm>
            <Button
              size="small"
              onClick={() => {
                setSelectedOrder(record);
                setUpdateModalOpen(true);
              }}
            >
              Edit
            </Button>
          </div>
        ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <Input.Search
            allowClear
            placeholder="Search orders"
            className="max-w-sm"
            value={search}
            onClear={() => {
              setSearch('');
              fetchOrders(1);
            }}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={() => fetchOrders(1)}
          />

          <div className="flex gap-2">
            <Button
              type="default"
              onClick={() => {
                fetchOrders();
              }}
            >
              Refresh
            </Button>
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              Create Order
            </Button>
          </div>
        </div>

        <Table
          dataSource={orders}
          loading={loading}
          columns={columns}
          rowKey="_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <CreateOrderModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => fetchOrders(pagination.current)}
      />

      {selectedOrder && (
        <UpdateQuantityModal
          open={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onSuccess={() => fetchOrders(pagination.current)}
        />
      )}
    </div>
  );
}

