import { useState } from 'react';

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
      {/* eslint-disable-next-line react/forbid-component-props */}
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
    // eslint-disable-next-line react/forbid-component-props
    <Dialog header={header} visible={visible} style={{ width: '50vw' }} onHide={onHide}>
      {children}
    </Dialog>
  );
}
