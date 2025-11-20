/**
 * Owner: tiger@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { IMG_CONFIG } from '../../SubmitResultPage';
import { StyledDialog, ResultWrapper } from './style';
import useLang from '../../../../../hookTool/useLang';

export default ({ onCancel, isSuccess, data, ...otherProps }) => {
  const { currentTheme } = useTheme();
  const { _t } = useLang();

  return (
    <StyledDialog
      {...otherProps}
      centeredFooterButton
      header={null}
      showCloseX={false}
      onCancel={onCancel}
      okText={isSuccess ? _t('f14ecdf869994000ab89') : _t('e7a6a8b69b204000ac07')}
      cancelText={isSuccess ? '' : _t('0cb2c3e437f04000a47a')}
    >
      <ResultWrapper>
        <img
          className="resultImg"
          src={IMG_CONFIG?.[currentTheme]?.[isSuccess ? 'success' : 'error']}
          alt="result"
        />
        <div className="resultTitle">
          {isSuccess ? _t('e68c8e5099e54000a3d8') : _t('09ddb361b9c04000a3d0')}
        </div>

        {!isSuccess && data?.rejectDesc ? (
          <div className="resultDesc">{data?.rejectDesc}</div>
        ) : null}
      </ResultWrapper>
    </StyledDialog>
  );
};
