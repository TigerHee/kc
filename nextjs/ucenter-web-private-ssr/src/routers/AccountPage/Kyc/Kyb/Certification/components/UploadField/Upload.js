/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { ICDeleteOutlined, ICWarningOutlined } from '@kux/icons';
import { Button, ImgPreview, useSnackbar } from '@kux/mui';
import { uniqueId } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { remove, upload } from 'services/kyb';
import {
  KYC_TYPE,
  MULTIPLE_FILE_TYPES,
  NORMAL_FILE_TYPES,
  UPLOAD_FILE_SIZE,
  UPLOAD_SIZE_ERROR,
} from 'src/components/Account/Kyc/common/constants';
import { evtEmitter, loadImg } from 'src/helper';
import commonFileIcon from 'static/account/kyc/kyb/common_file_icon.svg';
import uploadIcon from 'static/account/kyc/kyb/upload_icon.svg';
import uploadLoadingIcon from 'static/account/kyc/kyb/upload_loading_icon.svg';
import { _t, _tHTML } from 'tools/i18n';
import {
  DeleteButton,
  Description,
  ErrorMsg,
  FileLoad,
  FileNum,
  Item,
  ItemFailInfo,
  ItemLabel,
  ItemPrefix,
  List,
  Title,
  UploadArea,
  UploadAreaDesc,
  UploadAreaTitle,
} from './styled';
import { getSiteConfig } from 'kc-next/boot';

const evt = evtEmitter.getEvt();

const COMPANY_FILE_UPLOAD_EVENT = 'COMPANY_FILE_UPLOAD';

const FileItem = ({
  loading,
  name,
  type,
  status,
  url,
  error,
  disabled,
  onPreview,
  onRetry,
  onRemove,
}) => {
  const [picLoading, setPicLoading] = useState(false);
  const isPic = ['png', 'jpg', 'jpeg'].includes(type);

  useEffect(() => {
    isPic &&
      loadImg([url], () => {
        setPicLoading(true);
      });
  }, [url, isPic]);

  return (
    <Item onClick={onPreview}>
      {loading ? (
        <FileLoad>
          <img src={uploadLoadingIcon} alt="icon" />
        </FileLoad>
      ) : (
        <ItemPrefix>
          {isPic ? (
            picLoading ? (
              <img className="fill" src={url} alt="pic" />
            ) : (
              <img src={commonFileIcon} alt="icon" />
            )
          ) : (
            <img src={commonFileIcon} alt="icon" />
          )}
        </ItemPrefix>
      )}
      <ItemLabel className="ellipsis" fail={status === 2 || error}>{`${name}.${type}`}</ItemLabel>
      {!disabled && error ? (
        <>
          <ItemFailInfo>
            <ICWarningOutlined size={16} />
            <span>{_t('1a37258cf3584000a973')}</span>
          </ItemFailInfo>
          <Button
            data-testid="retryButton"
            variant="text"
            type="brandGreen"
            style={{ height: 'auto' }}
            onClick={onRetry}
          >
            {_t('180878ba03034000a45d')}
          </Button>
        </>
      ) : null}
      {!disabled && status !== 1 ? (
        <DeleteButton data-testid="deleteButton" onClick={onRemove}>
          <ICDeleteOutlined size={20} />
        </DeleteButton>
      ) : null}
    </Item>
  );
};

const Upload = ({
  title,
  description,
  photoType,
  onlyImage = false,
  value,
  max = 8,
  errorMsg,
  disabled,
  onChange,
}) => {
  const { isCN } = useLocale();
  const { message } = useSnackbar();
  const siteConfig = getSiteConfig();
  const { KUCOIN_HOST = '' } = siteConfig;

  const inputRef = useRef();
  const mapRef = useRef(new Map());
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const handleUploadCallback = ({ tempId, data, error }) => {
      const index = value?.findIndex((f) => f.fileId === tempId);
      if (index > -1) {
        const newValue = [...value];
        if (error) {
          newValue[index] = { ...newValue[index], loading: false, error };
        } else {
          newValue[index] = data;
        }
        onChange?.(newValue);
      }
    };
    evt.on(COMPANY_FILE_UPLOAD_EVENT, handleUploadCallback);

    return () => {
      evt.off(COMPANY_FILE_UPLOAD_EVENT, handleUploadCallback);
    };
  }, [value, onChange]);

  const handleUpload = async (tempId, file) => {
    try {
      const res = await upload({ kycType: KYC_TYPE.INSTITUTIONAL, photoType, file });
      if (!res.success) {
        throw res;
      }
      evt.emit(COMPANY_FILE_UPLOAD_EVENT, { tempId, data: res.data, error: null });
    } catch (err) {
      const error = new Error(err.msg || err.message);
      evt.emit(COMPANY_FILE_UPLOAD_EVENT, { tempId, data: null, error });
    }
  };

  const handleRemove = async (id) => {
    try {
      await remove({ materialId: id });
      const newValue = value?.filter((f) => f.id !== id) ?? [];
      onChange?.(newValue);
    } catch (error) {
      message.error(error?.msg || error?.message);
      console.error(error);
    }
  };

  const handleRetry = (tempId) => {
    const index = value?.findIndex((f) => f.fileId === tempId);
    if (index > -1) {
      const newValue = [...value];
      newValue[index] = { ...newValue[index], loading: true, error: null };
      onChange?.(newValue);
      handleUpload(tempId, mapRef.current.get(tempId));
    }
  };
  const handleChange = async (e) => {
    const file = e.target?.files[0];
    if (file.size >= UPLOAD_FILE_SIZE) {
      message.error(isCN ? UPLOAD_SIZE_ERROR.zh_CN : UPLOAD_SIZE_ERROR.en_US);
      return false;
    }
    const tempId = uniqueId();
    mapRef.current.set(tempId, file);
    onChange?.([
      ...(value ?? []),
      {
        fileId: tempId,
        url: URL.createObjectURL(file),
        materialName: file.name.replace(/\..+/, ''),
        materialType: file.type.split('/')[1],
        loading: true,
      },
    ]);
    handleUpload(tempId, file);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <Title>{title}</Title>
      {description ? <Description>{description}</Description> : null}
      {!disabled ? (
        <UploadArea
          onClick={() => {
            if (value?.length >= max) {
              return;
            }
            inputRef.current?.click();
          }}
          onDragEnter={(e) => e.preventDefault()}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (value?.length >= max) {
              return;
            }
            const files = e.dataTransfer.files;
            handleChange({ target: { files: files } });
          }}
        >
          <img src={uploadIcon} alt="icon" />
          <UploadAreaTitle>{_tHTML('aa2d2a6cabd74800a479')}</UploadAreaTitle>
          <UploadAreaDesc>
            {onlyImage
              ? _t('83792cf42f514000ad4f', { num: value?.length ?? 0, max })
              : _t('96afc76d27984000af8a', { num: value?.length ?? 0, max })}
          </UploadAreaDesc>
          <input
            type="file"
            data-testid="uploadInput"
            accept={onlyImage ? NORMAL_FILE_TYPES.join(',') : MULTIPLE_FILE_TYPES.join(',')}
            ref={inputRef}
            onChange={handleChange}
          />
        </UploadArea>
      ) : null}
      <FileNum>
        {value?.length === 1
          ? _t('db1798d4407d4000a40e')
          : _t('90fc33d244864800a928', { num: value?.length ?? 0 })}
      </FileNum>
      {value?.length ? (
        <>
          <List>
            {value.map((preItem) => {
              const preUrl = preItem.url || '';
              const item = {
                ...preItem,
                url: preUrl.startsWith('https') ? preUrl : `${KUCOIN_HOST}/_api/kyc${preUrl}`,
              };

              return (
                <FileItem
                  key={item.fileId}
                  loading={item.loading}
                  name={item.materialName}
                  type={item.materialType}
                  status={item.status}
                  url={item.url}
                  error={item.error}
                  disabled={disabled}
                  onPreview={() => {
                    if (['png', 'jpg', 'jpeg'].includes(item.materialType)) {
                      setPreview(item);
                    } else {
                      window.open(item.url);
                    }
                  }}
                  onRetry={(e) => {
                    e.stopPropagation();
                    handleRetry(item.fileId);
                  }}
                  onRemove={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                />
              );
            })}
          </List>
        </>
      ) : null}
      {errorMsg ? <ErrorMsg>{errorMsg}</ErrorMsg> : null}
      <ImgPreview
        title={preview?.materialName}
        show={preview}
        url={preview?.url}
        onClose={() => setPreview(null)}
      />
    </div>
  );
};

export default Upload;
