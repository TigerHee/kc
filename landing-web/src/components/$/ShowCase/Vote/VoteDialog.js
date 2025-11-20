/**
 * Owner: jesse.shao@kupotech.com
 */
import { Button, Dialog } from '@kufox/mui';
import { Modal } from 'antd';
import { _t, _tHTML } from 'utils/lang';
import cls from 'clsx';
import styles from './styles.less';

const VoteContent = ({ vote, coin }) => (
  <div className={styles.voteText}>
    {_tHTML('choice.vote.dialog.des', { votes: vote, currency: coin })}
  </div>
);

const VoteSuccessContent = () => (
  <div className={styles.voteText}>{_t('choice.vote.dialog.des.success')}</div>
);

const VoteDialog = ({ open, vote, coin, onOk, onCancel, isMobile }) => {
  if (isMobile) {
    return (
      <Modal
        visible={open}
        onOk={onOk}
        onCancel={onCancel}
        cancelText={_t('choice.vote.dialog.btn.cancel')}
        okText={_t('choice.vote.dialog.btn.ok')}
        footer={null}
        wrapClassName={styles.voteModal}
        closeIcon={<></>}
      >
        <>
          <div className={styles.title}>{_t('choice.vote.dialog.title')}</div>
          <VoteContent vote={vote} coin={coin} />
          <div className={styles.btns}>
            <Button variant="text" className={cls(styles.btn, styles.cancelBtn)} onClick={onCancel}>
              {_t('choice.vote.dialog.btn.cancel')}
            </Button>
            <Button variant="text" className={styles.btn} onClick={onOk}>
              {_t('choice.vote.dialog.btn.ok')}
            </Button>
          </div>
        </>
      </Modal>
    );
  }
  return (
    <Dialog
      open={open}
      title={_t('choice.vote.dialog.title')}
      onOk={onOk}
      onCancel={onCancel}
      cancelText={_t('choice.vote.dialog.btn.cancel')}
      okText={_t('choice.vote.dialog.btn.ok')}
    >
      <VoteContent vote={vote} coin={coin} />
    </Dialog>
  );
};

const VoteSuccess = ({ open, onOk, onCancel, isMobile }) => {
  if (isMobile) {
    return (
      <Modal
        visible={open}
        onOk={onOk}
        onCancel={onCancel}
        cancelText={_t('choice.vote.dialog.btn.cancel')}
        okText={_t('choice.vote.dialog.btn.ok')}
        footer={null}
        wrapClassName={styles.voteModal}
        closeIcon={<></>}
      >
        <>
          <div className={styles.title}>{_t('choice.vote.dialog.success')}</div>
          <VoteSuccessContent />
          <div className={styles.btns}>
            <Button variant="text" className={styles.btn} onClick={onCancel}>
              {_t('choice.vote.dialog.btn.ok')}
            </Button>
          </div>
        </>
      </Modal>
    );
  }
  return (
    <Dialog
      open={open}
      title={_t('choice.vote.dialog.success')}
      onOk={onOk}
      onCancel={onCancel}
      cancelText={null}
      okText={_t('choice.vote.dialog.btn.ok')}
    >
      <VoteSuccessContent />
    </Dialog>
  );
};

VoteDialog.VoteSuccess = VoteSuccess;

export default VoteDialog;
