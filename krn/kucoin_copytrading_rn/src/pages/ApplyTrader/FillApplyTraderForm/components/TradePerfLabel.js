import React from 'react';
import styled from '@emotion/native';

import {FormLabel} from 'components/Common/Form';
import {commonStyles} from 'constants/styles';

const Wrap = styled.View`
  margin-bottom: 12px;
`;

const Desc = styled.Text`
  ${commonStyles.textSecondaryStyle};
  line-height: 18px;
`;

const TradePerfLabel = () => {
  return (
    <Wrap>
      <FormLabel>{'交易业绩证明'}</FormLabel>
      <Desc>
        请上传您30日的合约交易收益曲线、交易数据统计等截图；若不上传，我们将默认审核您KuCoin合约交易记录。可上传1-3张图片
      </Desc>
    </Wrap>
  );
};

export default TradePerfLabel;
