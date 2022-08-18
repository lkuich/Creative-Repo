import { useQuery } from '@apollo/client';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import { RemoteImage } from 'components/Upload';
import { Column, Row } from 'components/Group';

import useLocationSearch from 'hooks/useLocationSearch';

import assetsQuery from './assets.gql';
import styles from './styles.module.sass';

export default function AssetsGrid() {
  const [categories] = useLocationSearch({ key: 'categories', initialValue: null });
  const [platforms] = useLocationSearch({ key: 'platforms', initialValue: null });
  const [assetTypes] = useLocationSearch({ key: 'assetType', initialValue: null });
  const [filenameSearch] = useLocationSearch({ key: 'filename', initialValue: '' });

  console.log(categories)

  const { data: assetsData } = useQuery(assetsQuery, {
    variables: {
      categories,
      platforms,
      assetTypes,
      filenameSearch
    }
  });

  const assets = assetsData?.asset || [];

  return (
    <div>
      {assets.map(asset => (
        <Card key={asset.id} className={styles.card}>
          <Column align='center'>
            <RemoteImage s3Key={asset.media.key} />
            <Row>
              <p>{getFilename(asset)}</p>
              <Button icon="pi pi-download" className="p-button-rounded p-button-text" aria-label="Download" />
            </Row>
          </Column>
        </Card>
      ))}
    </div>
  );

  function getFilename(asset) {
    return `${asset.category.name}_${asset.platform}_${asset.id}.${asset.media.filename.split('.')[1]}`;
  }
}
