import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';

import { Column } from 'components/Group';
import { Form, FormFooterButtons } from 'components/Input';

import { useAuth } from 'hooks/useAuth';

import insertAssetQuery from './insertAsset.gql';


export default function AddAssetForm({ asset = {}, onClose }) {
  const { crUser } = useAuth();

  const { data: categoryData } = useQuery(categoryQuery);
  const [insertAsset] = useMutation(insertAssetQuery);

  const categories = categoryData?.categories || [];

  const platformOptions = [
    { label: 'Facebook', value: 'facebook' },
    { label: 'TikTok', value: 'tiktok' }
  ];

  const assetTypeOptions = ['Image', 'Video'];

  // Set default values
  // @ts-ignore
  if (!asset?.id) {
    // @ts-ignore
    asset.type = 'Image';
  }

  const onSubmit = async (data) => {
    const {
      category_id,
      platform,
      type,
      media_id
    } = data;

    const added_by_id = crUser?.id;

    await insertAsset({
      variables: {
        category_id,
        platform,
        type: type.toLowerCase(),
        media_id,
        added_by_id
      }
    });

    onClose();
  };

  return (
    <Form defaultValues={asset} onSubmit={onSubmit}>
      {({ InputDropdown, InputSelectButton, UploadFileInput }) => (
        <Column>
          <InputDropdown name="category_id" label="Master Category" options={categories} optionLabel="name" optionValue="id" isRequired />
          <InputDropdown name="platform" label="Platform" options={platformOptions} isRequired />
          <InputSelectButton name="type" label="Asset Type" options={assetTypeOptions} isRequired />
          <UploadFileInput name="media_id" label="File" isRequired />

          <FormFooterButtons onCancel={onClose} />
        </Column>
      )}
    </Form>
  );
}

const categoryQuery = gql`
  {
    categories {
      id
      name
    }
  }`;
