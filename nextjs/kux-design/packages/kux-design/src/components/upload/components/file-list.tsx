import React from 'react';
import { IFileListProps } from '../types';
import { isImageFile, formatFileSize } from '../utils/file-utils';
import { clx } from '@/common/style';
import { DeleteIcon } from '@kux/iconpack';
import { Loading } from '@/components/loading';
import FileIcon from '../assets/file-icon.svg';


export const FileList: React.FC<IFileListProps> = ({
  title = 'files',
  files,
  onRetry,
  onDelete,
  className,
  style,
  fullWidth = false,
}) => {

  if (files.length === 0) {
    return null;
  }

  return (
    <div className={clx('kux-upload-file-list', className, {
      'kux-upload-file-list_full-width': fullWidth
    })} style={style}>
      <div className='kux-upload-file-list__title'>
        {files.length} {title}
      </div>

      <div className='kux-upload-file-list__list'>
        {files.map((file) => (
          <div key={file.uid} className='kux-upload-file-list__item'>
            <div className='kux-upload-file-list__item-icon'>
              {
                file.status === 'uploading' ? (
                  <div className='kux-upload-file-list__item-icon-loading'>
                    <Loading size='small' type='normal' />
                  </div>
                ) : (
                  <img src={isImageFile(file.name) ? file.url : FileIcon} alt={file.name} />
                )
              }
            </div>
            <div className='kux-upload-file-list__item-info'  >
              <div className={clx('kux-upload-file-list__item-name', {
                'kux-upload-file-list__item-name-error': file.status === 'error'
              })}>{file.name}</div>
              <div className='kux-upload-file-list__item-size'>{formatFileSize(file.size)}</div>
            </div>
            <div className='kux-upload-file-list__item-actions'>
              <div className={clx('kux-upload-file-list__item-actions-retry', {
                'kux-upload-file-list__item-actions-retry-hidden': file.status !== 'error'
              })} onClick={() => onRetry(file.uid)}>
                Retry
              </div>
              <div className='kux-upload-file-list__item-actions-delete' onClick={() => onDelete(file.uid)}>
                <DeleteIcon size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 