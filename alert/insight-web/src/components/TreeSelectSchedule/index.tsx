import { TreeSelect, TreeSelectProps } from 'antd';

const TreeSelectSchedule: React.FC<TreeSelectProps> = (props) => {
  const options = [
    {
      value: 'timing',
      title: '每天定点执行',
      selectable: false,
      children: [
        {
          value: '0 1 * * *', // 每天1点执行
          title: '每天1点执行',
        },
        {
          value: '0 2 * * *', // 每天2点执行
          title: '每天2点执行',
        },
        {
          value: '0 3 * * *', // 每天3点执行
          title: '每天3点执行',
        },
        {
          value: '0 4 * * *', // 每天4点执行
          title: '每天4点执行',
        },
        {
          value: '0 5 * * *', // 每天5点执行
          title: '每天5点执行',
        },
        {
          value: '0 6 * * *', // 每天6点执行
          title: '每天6点执行',
        },
        {
          value: '0 7 * * *', // 每天7点执行
          title: '每天7点执行',
        },
        {
          value: '0 8 * * *', // 每天8点执行
          title: '每天8点执行',
        },
        {
          value: '0 9 * * *', // 每天9点执行
          title: '每天9点执行',
        },
        {
          value: '0 10 * * *', // 每天10点执行
          title: '每天10点执行',
        },
        {
          value: '0 11 * * *', // 每天11点执行
          title: '每天11点执行',
        },
        {
          value: '0 12 * * *', // 每天12点执行
          title: '每天12点执行',
        },
        {
          value: '0 13 * * *', // 每天13点执行
          title: '每天13点执行',
        },
        {
          value: '0 14 * * *', // 每天14点执行
          title: '每天14点执行',
        },
        {
          value: '0 15 * * *', // 每天15点执行
          title: '每天15点执行',
        },
        {
          value: '0 16 * * *', // 每天16点执行
          title: '每天16点执行',
        },
        {
          value: '0 17 * * *', // 每天17点执行
          title: '每天17点执行',
        },
        {
          value: '0 18 * * *', // 每天18点执行
          title: '每天18点执行',
        },
        {
          value: '0 19 * * *', // 每天19点执行
          title: '每天19点执行',
        },
        {
          value: '0 20 * * *', // 每天20点执行
          title: '每天20点执行',
        },
        {
          value: '0 21 * * *', // 每天21点执行
          title: '每天21点执行',
        },
        {
          value: '0 22 * * *', // 每天22点执行
          title: '每天22点执行',
        },
        {
          value: '0 23 * * *', // 每天23点执行
          title: '每天23点执行',
        },
      ],
    },
    {
      value: 'interval',
      title: '固定间隔时间执行',
      selectable: false,
      children: [
        {
          value: '10 seconds', // 每10秒执行
          title: '每10秒执行',
        },
        {
          value: '* * * * *', // 每分钟执行
          title: '每分钟执行',
        },
        {
          value: '*/5 * * * *', // 每5分钟执行
          title: '每5分钟执行',
        },
        // {
        //   value: '*/10 * * * *', // 每10分钟执行
        //   title: '每10分钟执行'
        // },
        // {
        //   value: '*/30 * * * *', // 每30分钟执行
        //   title: '每30分钟执行',
        // },
        // {
        //   value: '0 * * * *', // 每小时执行
        //   title: '每小时执行',
        // },
        // {
        //   value: '0 */2 * * *', // 每2小时执行
        //   title: '每2小时执行',
        // },
        {
          value: '0 */6 * * *', // 每6小时执行
          title: '每6小时执行',
        },
        {
          value: '0 */12 * * *', // 每12小时执行
          title: '每12小时执行',
        },
        {
          value: '0 0 * * *', // 每天执行
          title: '每天执行',
        },
        {
          value: '0 0 */2 * *', // 每2天执行
          title: '每2天执行',
        },
        {
          value: '0 0 */3 * *', // 每3天执行
          title: '每3天执行',
        },
        {
          value: '0 0 */7 * *', // 每7天执行
          title: '每7天执行',
        },
        {
          value: '0 0 */15 * *', // 每15天执行
          title: '每15天执行',
        },
        {
          value: '0 0 1 * *', // 每月1号执行
          title: '每月1号执行',
        },
      ],
    },
  ];
  return (
    <TreeSelect
      showSearch
      treeLine
      style={{ width: '100%' }}
      treeData={options}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择调度时间"
      allowClear
      // treeDefaultExpandAll
      {...props}
    />
  );
};

export default TreeSelectSchedule;
