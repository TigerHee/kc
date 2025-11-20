import { StyledLinkButton } from 'components/$/CommunityCollect/LinkButton';
import { styled } from '@kux/mui/emotion';

/**
 * Owner: lucas.l.lu@kupotech.com
 */
export function LinkButtonList(props) {
  const { data, className, platform, platformTrackId } = props;

  return (
    <div className={className}>
      {data.map((item) => {
        return (
          <StyledLinkButton
            platform={platform}
            platformTrackId={platformTrackId}
            key={item.id}
            text={item.accountId}
            src={item.url} />
        );
      })}
    </div>
  );
}

export const StyledLinkButtonList = styled(LinkButtonList)`
  display: flex;
  row-gap: 18px;
  column-gap: 17px;
  flex-wrap: wrap;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    row-gap: 0;
    column-gap: 0;
  }
`;
