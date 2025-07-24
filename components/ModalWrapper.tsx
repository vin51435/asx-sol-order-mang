import { Modal } from 'antd';

type ModalWrapperProps = {
  open: boolean;
  onCancel: () => void;
  title: string;
  children: React.ReactNode;
};

export const ModalWrapper = ({
  open,
  onCancel,
  title,
  children,
}: ModalWrapperProps) => (
  <Modal
    title={title}
    open={open}
    onCancel={onCancel}
    footer={null}
    destroyOnHidden
    centered
    className=""
    classNames={{ body: 'max-h-85 overflow-auto ' }}
    // styles={}
  >
    <div className="space-y-4 p-2">{children}</div>
  </Modal>
);

