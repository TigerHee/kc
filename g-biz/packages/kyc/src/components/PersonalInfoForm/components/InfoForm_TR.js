// eslint-disable-next-line no-restricted-imports
import moment from 'moment';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { styled, Form, Input, Select, DatePicker } from '@kux/mui';
import useLang from '../../../hookTool/useLang';
import { getTrOccupation } from '../service';
import { namespace } from '../model';

const { FormItem } = Form;

const BothWrapper = styled.div`
  display: flex;
  gap: 16px;
  .KuxForm-item {
    flex: 1;
  }
`;

const CommonInputProps = {
  size: 'xlarge',
  labelProps: { 'shrink': true },
  inputProps: { maxLength: 100 },
};

export default () => {
  const { _t } = useLang();
  const kycInfo = useSelector((state) => state[namespace].kycInfo || {});
  const [occupationList, setOccupationList] = useState([]);

  const turkeyExtInfo = useMemo(() => {
    return kycInfo?.turkeyExtInfo || {};
  }, [kycInfo]);

  useEffect(() => {
    getTrOccupation().then((res) => {
      setOccupationList(res.data || []);
    });
  }, []);

  const handleFilter = (inputValue, option) => {
    const { value, title } = option;
    const lowercaseInput = (inputValue || '').toLowerCase();
    return [value, title].some((v) => {
      return String(v || '')
        .toLowerCase()
        .includes(lowercaseInput);
    });
  };

  return (
    <>
      <BothWrapper>
        <FormItem
          label={_t('b58b599665774000a50c')}
          name="fatherName"
          initialValue={turkeyExtInfo.fatherName || ''}
          rules={[{ required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') }]}
        >
          <Input {...CommonInputProps} />
        </FormItem>
        <FormItem
          label={_t('ad10f184af004000a4b3')}
          name="motherName"
          initialValue={turkeyExtInfo.motherName || ''}
          rules={[{ required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') }]}
        >
          <Input {...CommonInputProps} />
        </FormItem>
      </BothWrapper>

      <FormItem
        label={_t('4c17ac080bc94000a83c')}
        name="occupation"
        initialValue={turkeyExtInfo.occupation || ''}
        rules={[{ required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') }]}
      >
        <Select
          searchIcon={false}
          allowSearch
          filterOption={handleFilter}
          size="xlarge"
          options={occupationList.map((item) => {
            return { label: item, value: item };
          })}
          labelProps={{ 'shrink': true }}
        />
      </FormItem>

      <BothWrapper>
        <FormItem
          label={_t('199b896641c74000ae0a')}
          name="province"
          initialValue={turkeyExtInfo.province || ''}
          rules={[{ required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') }]}
        >
          <Input {...CommonInputProps} />
        </FormItem>
        <FormItem
          label={_t('8c1fe14449a84000a956')}
          name="district"
          initialValue={turkeyExtInfo.district || ''}
          rules={[{ required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') }]}
        >
          <Input {...CommonInputProps} />
        </FormItem>
      </BothWrapper>

      <BothWrapper>
        <FormItem
          label={_t('8c541a0885a54000a8ab')}
          name="neighborhood"
          initialValue={turkeyExtInfo.neighborhood || ''}
          rules={[{ required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') }]}
        >
          <Input {...CommonInputProps} />
        </FormItem>
        <FormItem
          label={_t('8207494556384000a99c')}
          name="street"
          initialValue={turkeyExtInfo.street || ''}
          rules={[{ required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') }]}
        >
          <Input {...CommonInputProps} />
        </FormItem>
      </BothWrapper>

      <FormItem
        label={_t('8d54246dd0374000a610')}
        name="buildingNo"
        initialValue={turkeyExtInfo.buildingNo || ''}
        rules={[{ required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') }]}
      >
        <Input {...CommonInputProps} />
      </FormItem>

      <FormItem
        label={_t('2678b4a429954000a523')}
        name="other"
        initialValue={turkeyExtInfo.other || ''}
      >
        <Input {...CommonInputProps} />
      </FormItem>

      <FormItem
        label={_t('408fc6d5c84e4000a654')}
        name="birthDate"
        initialValue={turkeyExtInfo.birthDate ? moment(turkeyExtInfo.birthDate) : ''}
        rules={[
          { required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') },
          {
            validator(_, value) {
              if (value && moment.duration(moment().diff(moment(value))).asYears() < 18) {
                return Promise.reject(new Error(_t('10a85e3739124000a442')));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <DatePicker size="xlarge" />
      </FormItem>
    </>
  );
};
