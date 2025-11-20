/**
 * Owner: willen@kupotech.com
 */
import { useTheme } from '@kux/mui-next';
import { ICDeleteOutlined } from '@kux/icons';
import map from 'lodash-es/map';
import React from 'react';
import { useNoticeCenterStore } from 'packages/notice-center/model';
import MsgPanel from '../MsgPanel';
import styles from './styles.module.scss';
import clsx from 'clsx';

interface MsgListProps {
  setDelete: (params: { eventIds?: string[]; mark?: boolean }) => void;
  date: string;
  items: any[];
  theme: any;
}

class MsgList extends React.Component<MsgListProps> {
  handleRmDate = (items) => {
    const eventIds = map(items, (item) => item.messageContext.id);
    this.props.setDelete({ eventIds });
  };

  render() {
    const { date, items, theme } = this.props;
    return (
      <div className={styles.List}>
        <h2 className={styles.H2}>
          {date}
          <ICDeleteOutlined
            size={16}
            color={theme.colors.icon40}
            className={clsx('delete-all', styles.ICDelete)}
            onClick={() => this.handleRmDate(items)}
          />
        </h2>
        {map(items, (item, i) => {
          return <MsgPanel {...item} key={i} />;
        })}
      </div>
    );
  }
}

export default ((props) => {
  const theme = useTheme();
  const setDelete = useNoticeCenterStore(state => state.setDelete);

  return <MsgList theme={theme} setDelete={setDelete} {...props} />;
});
