/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import { useMemo } from 'react';
import { _t } from 'tools/i18n';
import { ReactComponent as BusinessIcon } from './img/business.svg';
import { ReactComponent as CompanyIcon } from './img/company.svg';
import { ReactComponent as ContactIcon } from './img/contact.svg';
import { ReactComponent as FaceIcon } from './img/face.svg';
import { ReactComponent as PersonalIcon } from './img/personal.svg';
import { ReactComponent as PhotoIcon } from './img/photo.svg';
import { ReactComponent as UploadIcon } from './img/upload.svg';

const Wrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  flex-direction: column;
  gap: 12px;
  .item {
    display: flex;
    align-items: center;
  }
  .iconBox {
    display: flex;
    align-items: center;
    margin-right: 8px;
    svg {
      width: 18px;
      height: 18px;
    }
  }
  .label {
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    .item {
      align-items: flex-start;
    }
    .label {
      font-size: 14px;
    }
  }
`;

export default ({ type = 'KYC' }) => {
  const list = useMemo(() => {
    if (type === 'PI') {
      return [
        {
          label: _t('a279676c69734000a122'),
          Icon: BusinessIcon,
        },
        {
          label: _t('edb8be65563e4000a96a'),
          Icon: UploadIcon,
        },
      ];
    }

    if (type === 'KYB') {
      return [
        {
          label: _t('957cb0875e894000aef0'),
          Icon: CompanyIcon,
        },
        {
          label: _t('7f950b18671f4000a04f'),
          Icon: ContactIcon,
        },
        {
          label: _t('9f9b6d69df5c4000a74a'),
          Icon: UploadIcon,
        },
      ];
    }

    return [
      {
        label: _t('fbb55413cc554000a732'),
        Icon: PersonalIcon,
      },
      {
        label: _t('b4bdbb8aee704000a025'),
        Icon: PhotoIcon,
      },
      {
        label: _t('7fbf82fc557a4000a01e'),
        Icon: FaceIcon,
      },
    ];
  }, [type]);

  return (
    <Wrapper>
      {list.map(({ label, Icon }) => {
        return (
          <div className="item" key={label}>
            <div className="iconBox">
              <Icon />
            </div>
            <div className="label">{label}</div>
          </div>
        );
      })}
    </Wrapper>
  );
};
