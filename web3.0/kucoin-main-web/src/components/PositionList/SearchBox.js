/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useMemo } from 'react';
import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { Input, Box, Button } from '@kufox/mui';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';
import { Link } from 'components/Router';

const InputWrapper = styled(Box)`
  flex: 1;
  max-width: ${px2rem(500)};
  margin-right: ${px2rem(18)};
  ${(props) => props.theme.breakpoints.down('md')} {
    max-width: 100%;
    margin-right: ${px2rem(4)};
  }
`;

const Label = styled(Link)`
  font-size: ${px2rem(12)};
  height: ${px2rem(20)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${px2rem(8)};
  border-radius: ${px2rem(2)};
  color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.text40)};
  background: ${(props) =>
    props.active ? props.theme.colors.primary8 : props.theme.colors.cover4};
  cursor: pointer;
  margin-right: ${px2rem(12)};
  margin-top: ${px2rem(14)};
`;

const ALL = {
  label: () => _t('all'),
  position: 'all',
};

export default () => {
  const dispatch = useDispatch();
  const { position, jobCategory } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch({
      type: 'jobs/getJobCategory',
    });
  }, [dispatch]);

  const positions = useMemo(() => {
    return jobCategory.map((v) => ({
      label: () => v,
      position: v,
    }));
  }, [jobCategory]);

  return (
    <Box mt={px2rem(26)}>
      <Box display="flex" alignItems="flex-end">
        <InputWrapper>
          <Input
            placeholder={_t('application.joinus.20')}
            onChange={(e) => {
              dispatch({
                type: 'jobs/update',
                payload: {
                  search: e.target.value.trim(),
                },
              });
            }}
            label={_t('application.joinus.19')}
          />
        </InputWrapper>
        <Button
          onClick={() => {
            dispatch({
              type: 'jobs/searchJob',
            });
          }}
        >
          {_t('application.joinus.21')}
        </Button>
      </Box>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        {[ALL, ...positions].map(({ label, position: id }) => {
          const active = id === position;
          return (
            <Label
              onClick={() => {
                dispatch({
                  type: 'jobs/resetPage',
                });
                push(`/careers/job-opening${id !== 'all' ? `/${id}` : ''}`);
              }}
              key={id}
              active={active}
              redirect={false}
              to={`/careers/job-opening${id !== 'all' ? `/${id}` : ''}`}
            >
              {label()}
            </Label>
          );
        })}
      </Box>
    </Box>
  );
};
