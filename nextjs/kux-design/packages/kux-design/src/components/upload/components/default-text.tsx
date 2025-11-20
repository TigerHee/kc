import UploadImg from '../assets/upload.svg';
import { clx } from '@/common/style';

export default function DefaultText({ title, description, error = false }: { title: string, description: string, error?: boolean }) {
  return (
    <div className="kux-upload_area-content">
      <div className="kux-upload_area-icon">
        <img src={UploadImg} alt="upload" width={40} height={40} />
      </div>
      <div className={clx("kux-upload_area-content_title", {
        'kux-upload_area-content_title-error': error
      })}>
        {title}
      </div>
      <div className="kux-upload_area-content_description">
        {description}
      </div>
    </div>
  );
}