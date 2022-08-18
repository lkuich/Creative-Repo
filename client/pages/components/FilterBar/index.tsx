import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';

import { Row } from 'components/Group';

import useLocationSearch from 'hooks/useLocationSearch';

export default function FilterBar() {
  const [categories, setCategories] = useLocationSearch({ key: 'categories', initialValue: null });

  const { data: categoryData } = useQuery(categoryQuery);
  const categoryOptions = categoryData?.categories || [];

  console.log(categoryOptions)

  const [platforms, setPlatforms] = useLocationSearch({ key: 'platforms', initialValue: null });

  const platformOptions = [
    { label: 'Facebook', value: 'facebook' },
    { label: 'TikTok', value: 'tiktok' }
  ];

  const [assetTypes, setAssetTypes] = useLocationSearch({ key: 'assetType', initialValue: null });

  const assetTypeOptions = [
    { label: 'Image', value: 'image' },
    { label: 'Video', value: 'video' }
  ];

  const [filenameSearch, setFilenameSearch] = useLocationSearch({ key: 'filename', initialValue: '' });

  return (
    <Row>
      <MultiSelect value={categories?.split(',') || ''} options={categoryOptions} onChange={({ value }) => {
        if (value.length > 0) {
          setCategories(value.join(','));
        } else {
          setCategories(value[0]);
        }
      }} optionLabel="name" optionValue="id" placeholder="Select Master Categories" display="chip" />

      <MultiSelect value={platforms?.split(',') || ''} options={platformOptions} onChange={({ value }) => {
        if (value.length > 0) {
          setPlatforms(value.join(','));
        } else {
          setPlatforms(value[0]);
        }
      }} placeholder="Select Platforms" display="chip" />

      <MultiSelect value={assetTypes?.split(',') || ''} options={assetTypeOptions} onChange={({ value }) => {
        if (value.length > 0) {
          setAssetTypes(value.join(','));
        } else {
          setAssetTypes(value[0]);
        }
      }} placeholder="Select Asset Types" display="chip" />

      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText value={filenameSearch} onChange={({ target }) => setFilenameSearch(target.value)} placeholder="Search Filename" />
      </span>
    </Row>
  );
}

const categoryQuery = gql`
  {
    categories {
      id
      name
    }
  }`;
