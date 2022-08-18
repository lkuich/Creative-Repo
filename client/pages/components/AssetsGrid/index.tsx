import { useQuery } from '@apollo/client';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import { RemoteImage } from 'components/Upload';
import { Column, Row } from 'components/Group';

import useLocationSearch from 'hooks/useLocationSearch';

import assetsQuery from './assets.gql';
import styles from './styles.module.sass';

function splitOrFirst(str, transformFn) {
  if (!str) {
    return [];
  }

  const split = str?.split(',').map(s => transformFn ? transformFn(s) : s);

  if (split) {
    return split;
  }

  return [str];
}

export default function AssetsGrid() {
  const [categories] = useLocationSearch({ key: 'categories', initialValue: null });
  const [platforms] = useLocationSearch({ key: 'platforms', initialValue: null });
  const [assetTypes] = useLocationSearch({ key: 'assetType', initialValue: null });
  // const [filenameSearch] = useLocationSearch({ key: 'filename', initialValue: '' });

  const _categories = splitOrFirst(categories, parseInt);
  const _types = splitOrFirst(assetTypes);
  const _platforms = splitOrFirst(platforms);

  const variables = {
    'bool_exp': {}
  };

  if (_categories.length > 0) {
    variables.bool_exp.category_id = {
      '_in': splitOrFirst(categories, parseInt)
    };
  }

  if (_types.length > 0) {
    variables.bool_exp.type = {
      '_in': splitOrFirst(assetTypes)
    };
  }

  if (_platforms.length > 0) {
    variables.bool_exp.platform = {
      '_in': splitOrFirst(platforms)
    };
  }

  const { data: assetsData } = useQuery(assetsQuery, {
    variables
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
