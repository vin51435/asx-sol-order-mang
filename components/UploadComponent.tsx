'use client';

import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload/interface';
import { useState } from 'react';

const MAX_SIZE_MB = 2;

interface UploadComponentProps {
  fileList: RcFile[];
  onChange?: (fileList: RcFile[]) => void;
}

const UploadComponent = ({ fileList, onChange }: UploadComponentProps) => {
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < MAX_SIZE_MB;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return Upload.LIST_IGNORE;
    }

    onChange([...fileList, file]); // update form state
    return false; // prevent auto upload
  };

  return (
    <Upload
      beforeUpload={beforeUpload}
      fileList={fileList}
      onChange={({ fileList }) => onChange(fileList)}
      maxCount={1}
      onRemove={() => onChange([])}
      accept=".jpg,.jpeg,.png"
    >
      <Button icon={<UploadOutlined />}>Upload Product Image</Button>
    </Upload>
  );
};

export default UploadComponent;

