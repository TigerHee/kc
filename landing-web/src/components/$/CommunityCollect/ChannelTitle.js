import { styled } from '@kux/mui/emotion';

/**
 * Owner: lucas.l.lu@kupotech.com
 */
export function ChannelTitle(props) {
  const { title, iconUrl, className } = props;

  return (
    <div className={className}>
      <img className="img" src={iconUrl} alt={title} />
      <span className="title">{title}</span>
    </div>
  );
}

export const StyledChannelTitle = styled(ChannelTitle)`
  & {
    display: flex;
    align-items: center;
    padding: 8px 0 25px 0;
    gap: 8px;
    .img {
      max-width: 28px;
      height: auto;
      vertical-align: middle;
    }
    .title {
      font-size: 22px;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text};
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 0 9px;
    & {
      .img {
        max-width: 22px;
      }

      .title {
        font-size: 18px;
      }
    }
  }
`;
