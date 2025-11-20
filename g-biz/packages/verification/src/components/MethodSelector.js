/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { ICPlusOutlined } from '@kux/icons';
import { Fragment } from 'react';
import plugins from '../plugins';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const MethodItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 24px 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  & + & {
    margin-top: 24px;
  }
`;

const FieldItem = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
  img {
    margin-right: 8px;
  }
`;

export default function MethodSelector({ methods, onChange }) {
  return (
    <Container data-testid="method-selector">
      {methods.map((method) => {
        const key = method.join(',');
        return (
          <MethodItem
            key={key}
            onClick={() => {
              onChange(method);
            }}
          >
            {method.map((field, index) => {
              const { Name, Icon } = plugins.get(field) ?? {};
              return (
                <Fragment key={field}>
                  {index > 0 ? <ICPlusOutlined size={24} /> : null}
                  <FieldItem>
                    {Icon && <Icon />}
                    {Name ? <Name /> : <span>{field}</span>}
                  </FieldItem>
                </Fragment>
              );
            })}
          </MethodItem>
        );
      })}
    </Container>
  );
}
