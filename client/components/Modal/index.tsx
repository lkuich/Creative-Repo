import { useState, forwardRef } from 'react';

import { Dialog } from 'primereact/dialog';

export function Modal({ header, trigger, className, children }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {trigger && (
        <div onClick={() => setShowModal(true)} className={className}>
          {trigger}
        </div>
      )}
      <Dialog header={header} visible={showModal} style={{ width: '50vw' }} onHide={onClose}>
        {children}
      </Dialog>
    </>
  );

  function onClose() {
    setShowModal(false);
  }
}

export function ModalVisible({ header, visible, onHide, children }) {
  return (
    <Dialog header={header} visible={visible} style={{ width: '50vw' }} onHide={onHide}>
      {children}
    </Dialog>
  );
}

// TODO: Ref based Modal??
// eslint-disable-next-line react/display-name
export const ModalRef = forwardRef(({ header, children }, ref) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Dialog ref={ref} header={header} visible={showModal} style={{ width: '50vw' }} onHide={onClose}>
      {children}
    </Dialog>
  );

  function onClose() {
    setShowModal(false);
  }
});
