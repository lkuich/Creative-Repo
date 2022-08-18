import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

// import { useAuth } from 'hooks/useAuth';

import { RemoteImage, GetRemoteUrl } from 'components/Upload';
import { Column, Row } from 'components/Group';

import useLocationSearch from 'hooks/useLocationSearch';

import assetsQuery from './assets.gql';
import updateAssetQuery from './updateAsset.gql';

import styles from './styles.module.sass';

function splitOrFirst(str, transformFn?) {
  if (!str) {
    return [];
  }

  const split = str?.split(',').map(s => transformFn ? transformFn(s) : s);

  if (split) {
    return split;
  }

  return [str];
}

export default function AssetsGrid({ lastUpdate }) {
  // const { crUser } = useAuth();

  const [updateAsset] = useMutation(updateAssetQuery);

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
    // @ts-ignore
    variables.bool_exp.category_id = {
      '_in': splitOrFirst(categories, parseInt)
    };
  }

  if (_types.length > 0) {
    // @ts-ignore
    variables.bool_exp.type = {
      '_in': splitOrFirst(assetTypes)
    };
  }

  if (_platforms.length > 0) {
    // @ts-ignore
    variables.bool_exp.platform = {
      '_in': splitOrFirst(platforms)
    };
  }

  const { data: assetsData, refetch } = useQuery(assetsQuery, {
    variables
  });

  useEffect(() => {
    lastUpdate && refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdate]);

  const assets = assetsData?.asset || [];

  return (
    <Row gap="5" wrap="wrap">
      {assets.map(asset => (
        <Card key={asset.id} className={styles.card}>
          {/* <Button icon0="pi pi-heart" className={cx('p-button-rounded', 'p-button-danger', asset.loved_by_id !== crUser?.id && 'p-button-outlined')} aria-label="Favorite" /> */}

          <Column align='center' justify='between' fullWidth className={styles.cardColumn}>
            <RemoteImage s3Key={asset.media.key} />
            <Row align='end'>
              <p>{getFilename(asset)}</p>
              <Button icon="pi pi-download" className="p-button-rounded p-button-text" aria-label="Download" onClick={() => downloadImage(asset)} />
              <p>{asset.downloads}</p>
            </Row>
          </Column>
        </Card>
      ))}
    </Row>
  );

  async function downloadImage(asset) {
    const link = document.createElement('a');

    link.href = await GetRemoteUrl(asset.media.key);
    link.download = getFilename(asset);
    link.click();

    await updateAsset({
      variables: {
        id: asset.id,
        set: {
          downloads: asset.downloads + 1
        }
      }
    });

    await refetch();
  }

  function getFilename(asset) {
    return `${asset.category.name.replaceAll(' ', '_').toLowerCase()}_${asset.platform}_${asset.id}.${asset.media.filename.split('.')[1]}`;
  }
}
