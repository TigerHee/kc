import { LinkIcon, ReceivedIcon } from '@kux/iconpack';
import { IconButton } from './icon-button';
import { Button } from '../button';
import { Spacer } from '../spacer';


export interface ISocialButtonsProps {
  link: string;
  isMobile: boolean;
  saveBtnText: string;
  copyBtnText: string;
  onCopy?: () => void;
  onSave?: () => void;
}

export function ActionButtons(props: ISocialButtonsProps) {
  const classPrefix = 'kux-share-view';
  // 文案与现网保持一致, 不做翻译. 使用翻译文案会导致样式问题
  if (!props.isMobile) {
    return (
      <>
        <IconButton icon={<div className='kux-share-view-wicon'><ReceivedIcon /></div>} text={'Save'} onClick={props.onSave} />
        <IconButton icon={<div className='kux-share-view-wicon'><LinkIcon /></div>} text={'Copy'} onClick={props.onCopy} />
      </>
    );
  }

  return (
    <div className={`${classPrefix}_actions`}>
      <Button
        data-testid="share_save"
        type='primary'
        onClick={props.onSave}
        startIcon={<ReceivedIcon size="small" />}
      >
        <span className="kux-button_text">{props.saveBtnText}</span>
      </Button>
      <Spacer direction='horizontal' length={12} />
      <Button
        data-testid="share_copy"
        type='default'
        onClick={props.onCopy}
        startIcon={<LinkIcon size="small" />}
      >
        <span className="kux-button_text">{props.copyBtnText}</span>
      </Button>
    </div>
  );
}
