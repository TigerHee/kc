import { useSnackbar } from '@kux/mui';
import { useEffect, useState } from 'react';
import { pullDictByDictCodeListV2 } from 'src/services/kyb';
import SelectField from '../SelectField';

const getResult = (data, type) => {
  let result = [];

  if (type === 'kucoinpay_industry_type') {
    if (data && data.kucoinpay_industry_type) {
      data.kucoinpay_industry_type.forEach((item) => {
        if (item.itemStatus === 1) {
          result.push({
            ...item,
            label: item.itemDesc,
            value: item.itemCode,
          });
        } else {
          result[result.length - 1] = {
            ...result[result.length - 1],
            desc: item.itemDesc,
          };
        }
      });
      result = result.map((item) => ({
        title: item.label,
        description: item.desc,
        value: item.value,
      }));
    }
  }

  if (type === 'kucoinpay_product_type') {
    if (data && data.kucoinpay_product_type) {
      data.kucoinpay_product_type.forEach((item) => {
        if (item.itemStatus === 0) {
          result.push({
            ...item,
            label: item.itemDesc,
            value: item.itemCode,
          });
        } else {
          result[result.length - 1].children = [
            ...(result[result.length - 1].children || []),
            {
              ...item,
              label: item.itemDesc,
              value: item.itemCode,
            },
          ];
        }
      });
      result = result.map((item) => ({
        title: item.label,
        value: item.value,
        children: item.children.map((child) => ({
          title: child.label,
          value: child.value,
        })),
      }));
    }
  }
  return result;
};

export default function Dict({ type, ...props }) {
  const { message } = useSnackbar();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    pullDictByDictCodeListV2({ dictCodeList: type, ignoreStatus: true })
      .then((res) => {
        const record = getResult(res.data, type);
        setOptions(record);
      })
      .catch((err) => {
        message.error(err?.msg || err?.message);
        console.error(err);
      });
  }, [type]);

  return <SelectField {...props} options={options} />;
}
