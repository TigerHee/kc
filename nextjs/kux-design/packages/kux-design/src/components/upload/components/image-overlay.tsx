import React from 'react';
import { IImageOverlayProps } from '../types';
import { clx } from '@/common/style';
import { EyeOpenIcon, DeleteIcon } from '@kux/iconpack';

export const ImageOverlay: React.FC<IImageOverlayProps> = ({
  url,
  onPreview,
  onDelete,
  className,
  style,
  deleteText = 'Delete',
  previewText = 'Check'
}) => {
  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (url) {
      onPreview?.(url);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  if (!url) {
    return null;
  }

  return (
    <div 
      className={clx('kux-upload-image-overlay', className)}
      style={style}
    >
      <img src={url} alt="preview image" className="kux-upload-image-overlay__image" />
      <div className="kux-upload-image-overlay__content">
        <div
          className={clx('kux-upload-image-overlay__content__btn', 'kux-upload-image-overlay__content__btn__preview')}
          onClick={handlePreview}
          title={previewText}
        >
          <EyeOpenIcon size={24} />
          <span>{previewText}</span>
        </div>
        
        <div
          className={clx('kux-upload-image-overlay__content__btn', 'kux-upload-image-overlay__content__btn__delete')}
          onClick={handleDelete}
          title={deleteText}
        >
          <DeleteIcon size={24} />
          <span>{deleteText}</span>
        </div>
      </div>
    </div>
  );
}; 