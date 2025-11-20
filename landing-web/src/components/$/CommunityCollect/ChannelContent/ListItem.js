/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { StyledChannelTitle } from 'components/$/CommunityCollect/ChannelTitle';
import { StyledLinkButtonList } from 'components/$/CommunityCollect/LinkButtonList';
import { useRef } from 'react';
import { useMount } from 'ahooks';

export function ListItem(props) {
  const { item, trackInstance } = props;
  const ref = useRef();

  useMount(() => {
    if (ref.current) {
      const observer = trackInstance?.getObserver?.();
      if (!observer) {
        return;
      }

      observer.observe(ref.current);
    }
  });

  return (
    <div ref={ref} className={item.platform} data-platform={item.platformTrackId}>
      <StyledChannelTitle title={item.platform} iconUrl={item.iconUrl} />
      <StyledLinkButtonList
        data={item.data}
        platform={item.platform}
        platformTrackId={item.platformTrackId}
      />
    </div>
  );
}
