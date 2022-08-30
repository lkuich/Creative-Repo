import React, { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import cx from 'clsx';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { FileUpload, FileUploadUploadParams, FileUploadBeforeSendParams } from 'primereact/fileupload';
import { ContextMenu } from 'primereact/contextmenu';

import { Column } from 'components/Group';
import { ModalVisible } from 'components/Modal';

import { useAuth } from 'hooks/useAuth';

import styles from './styles.module.sass';


export interface UploadInputInterface {
  name: string;
  label?: string;
  auto?: boolean;
  isRequired?: boolean;
  acceptType?: string;
  formHook: any;
}

export const UploadInput = ({ name, label = '', auto = true, isRequired = false, acceptType = '', formHook }: UploadInputInterface) => {
  const { formState: { errors }, register, setValue, getValues } = formHook;

  const [fileId, setFileId] = useState<number>();

  useEffect(() => {
    // On load, get the form value and set the imageId, GraphQL will load the cached query
    const value = getValues(name);

    if (value) {
      setFileId(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fileId && setValue) {
      setValue(name, fileId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  const { data } = useQuery(mediaQuery, {
    variables: {
      id: fileId
    },
    skip: !fileId
  });

  const { id } = data?.media[0] || {};

  const error = !fileId && getFormErrorMessage();
  const labelKlass = cx('p-label', error && 'p-error');

  const isImage = acceptType.startsWith('image/');

  return (
    <Column>
      {!!label && <label htmlFor={name} className={labelKlass}>{isRequired ? '*' : ''}{label}</label>}
      {fileId && (
        <S3Asset fileId={fileId} isImage={isImage} />
      )}
      <UploadButtonInput onUpload={_onUpload} auto={auto} mediaId={id} />
      <input type='hidden' {...register(name, { required: isRequired })} />
      {error}
    </Column>
  );

  function getFormErrorMessage() {
    return errors && errors[name] && <small className="p-error">{errors[name]?.message || `${label} is required`}</small>;
  }

  function _onUpload(e) {
    const { response } = e;

    const id = response[0]?.id;

    if (id) {
      setFileId(id);
    }
  }
};

// Just an alias of UploadInput
export function UploadImageInput({ name, label = '', auto = true, isRequired = false, acceptType = 'image/*', formHook }: UploadInputInterface) {
  return UploadInput({ name, label, auto, isRequired, acceptType, formHook });
}

function S3Asset({ fileId, isImage }) {
  // Annoying re-query here, but it's cached anyway
  const { data } = useQuery(mediaQuery, {
    variables: {
      id: fileId
    },
    skip: !fileId
  });

  if (!fileId) {
    return null;
  }

  const { key, filename } = data?.media[0] || {};

  return isImage ? (
    <RemoteImage s3Key={key} />
  ) : (
    <span>{filename}</span>
  );
}

export const RemoteImage = ({ s3Key }) => {
  const { token } = useAuth();

  const fetcher = (url) => fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then((res) => res.blob()).then(blob => URL.createObjectURL(blob));

  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_HOST}/storage/file/${s3Key}`,
    fetcher
  );

  return (
    // eslint-disable-next-line
    <img src={data} alt="S3 Image" />
  );
};

export const GetRemoteUrl = async (s3Key) => {
  // This is called out of React context, so we'll need to grab the session token from somewhere else, localstorage is fine
  const token = localStorage.getItem('crAccessToken');

  const fetcher = (url) => fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then((res) => res.blob()).then(blob => URL.createObjectURL(blob));

  const result = await fetcher(
    `${process.env.NEXT_PUBLIC_API_HOST}/storage/file/${s3Key}`
  );

  return result;
};

export const UploadButtonInput = ({ onUpload, acceptType = '', auto = true, mediaId }) => {
  const fileUploadRef = useRef(null);
  const uploadTarget = process.env.API_HOST ? `${process.env.API_HOST}/storage/upload` : 'http://localhost:3006/storage/upload';
  const uploadFolder = process.env.S3_BUCKET || '/localhost/';

  const { token } = useAuth();

  // const cmRef = useRef(null);

  const [showModal, setShowModal] = useState(false);

  // const buttonModel = [
  //   {
  //     label: 'Edit Creative',
  //     icon: 'pi pi-pencil',
  //     command: () => {
  //       setShowModal(true);
  //     }
  //   }
  // ];

  // const klass = cx(mediaId && styles.uploadButton);

  return (
    <div className={styles.uploadInput}>
      {mediaId && (
        <ModalVisible visible={showModal} header="Edit Creative" onHide={closeModal}>
          <p>Edit...</p>
        </ModalVisible>
      )}
      <FileUpload
        ref={fileUploadRef}
        mode="basic"
        name="files"
        url={uploadTarget}
        withCredentials
        auto={auto}
        onBeforeSend={beforeSend}
        accept={acceptType}
        onUpload={onBasicUpload}
      />
      {/* {mediaId && (
        <>
          <ContextMenu model={buttonModel} ref={cmRef} />
          <Button className={styles.optionsButton} icon="pi pi-ellipsis-v" type='button' onClick={(e) => cmRef?.current.show(e)} />
        </>
      )} */}
      <ConfirmDialog />
    </div>
  );

  function closeModal() {
    return setShowModal(false);
  }

  // Send up auth and path headers
  function beforeSend(e: FileUploadBeforeSendParams) {
    const { xhr } = e;

    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    // x-path is the folder to upload to
    xhr.setRequestHeader('x-path', uploadFolder);
  }

  async function onBasicUpload(e: FileUploadUploadParams) {
    const { files, xhr } = e;

    const response = JSON.parse(xhr.response);

    await onUpload({ files, response });
  }
};

const mediaQuery = gql`
  query media($id: Int!) {
    media(where: {id: {_eq: $id}}) {
      id
      key
      filename
    }
  }
`;
