/**
 * Owner: jesse.shao@kupotech.com
 */
import { Table } from 'antd';
import { useSelector } from 'dva';
import { v4 as uuid } from 'uuid';
import { _t } from 'utils/lang';
import styles from './styles.less';

const Rule = () => {
  const publishDetail = useSelector(state => state.showcase.publishDetail);
  const { newUserCount } = publishDetail;

  const columns = [
    {
      title: _t('choice.rule.table.kcs'),
      dataIndex: 'kcs',
      key: 'kcs',
      render: a => <>{a}<span className={styles.kcs}>KCS</span></>
    },
    {
      title: _t('choice.rule.table.old'),
      dataIndex: 'vote',
      key: 'vote',
      align: 'center'
    },
    {
      title: <span>{_t('choice.rule.table.new')}(+{newUserCount})</span>,
      dataIndex: 'vote_new',
      key: 'vote_new',
      align: 'right',
      render: a => <>{a}<span className={styles.add}>+{newUserCount}</span></>
    }
  ];
  const data = [
    { kcs: '100', vote: '1', vote_new: '1', key: uuid() },
    { kcs: '200', vote: '2', vote_new: '2', key: uuid() },
    { kcs: '300', vote: '3', vote_new: '3', key: uuid() },
    { kcs: '400', vote: '4', vote_new: '4', key: uuid() },
    { kcs: '500', vote: '5', vote_new: '5', key: uuid() },
    { kcs: '600', vote: '6', vote_new: '6', key: uuid() },
    { kcs: '700', vote: '7', vote_new: '7', key: uuid() },
    { kcs: '>=800', vote: '8', vote_new: '8', key: uuid() },
  ];
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.title}>{_t('choice.rule.title')}</div>
        <Table className={styles.table} columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  );
}

export default Rule;
