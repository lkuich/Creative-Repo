import type { NextPage } from 'next';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { signOut } from 'next-auth/react';

import { Row, Column } from 'components/Group';
import { ModalVisible } from 'components/Modal';

import FilterBar from './components/FilterBar';
import AssetsGrid from './components/AssetsGrid';
import AddAssetForm from './components/AddAssetForm';

const Home: NextPage = () => {
  const [_showModal, setShowModal] = useState(false);

  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  return (
    <>
      <ModalVisible header="Add Creative" visible={_showModal} onHide={hideModal}>
        <AddAssetForm onClose={hideModal} />
      </ModalVisible>
      <Column>
        <Row justify='between'>
          <h2>Creative Repo</h2>
          <Row>
            <Button label="Add Creative" icon="pi pi-plus-circle" onClick={showModal} />
            <Button icon="pi pi-sign-out" className="p-button-rounded p-button-outlined" aria-label="Sign Out" onClick={() => signOut({ callbackUrl: 'http://localhost:3000/api/auth/logout' })} />
          </Row>
        </Row>
        <FilterBar />
        <br />
        <AssetsGrid lastUpdate={lastUpdate} />
      </Column>
    </>
  );

  function showModal() {
    setShowModal(true);
  }

  function hideModal() {
    setShowModal(false);

    setLastUpdate(Date.now());
  }
};

export default Home;
