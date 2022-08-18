import type { NextPage } from 'next';
import { useState } from 'react';
import { Button } from 'primereact/button';

import { Row, Column } from 'components/Group';
import { ModalVisible } from 'components/Modal';

import FilterBar from './components/FilterBar';
import AssetsGrid from './components/AssetsGrid';
import AddAssetForm from './components/AddAssetForm';

const Home: NextPage = () => {
  const [_showModal, setShowModal] = useState(false);

  return (
    <>
      <ModalVisible header="Add Creative" visible={_showModal} onHide={hideModal}>
        <AddAssetForm onClose={hideModal} />
      </ModalVisible>
      <Column>
        <Row>
          <FilterBar />
          <Button label="Add Creative" icon="pi pi-plus-circle" onClick={showModal} />
        </Row>
        <AssetsGrid />
      </Column>
    </>
  );

  function showModal() {
    setShowModal(true);
  }

  function hideModal() {
    setShowModal(false);
  }
};

export default Home;
