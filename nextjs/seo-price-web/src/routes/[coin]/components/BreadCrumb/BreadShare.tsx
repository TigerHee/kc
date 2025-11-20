/**
 * Owner: will.wang@kupotech.com
 */
import useSharePoster from "@/hooks/useSharePoster";
import { trackClick } from "gbiz-next/sensors";
import { ICShareOutlined } from "@kux/icons";
import { Button } from "@kux/mui-next";
import { useRequest } from "ahooks";

export default function BreadShare(props: { symbol: string }) {
  const handleShare = useSharePoster();
  const { run, loading } = useRequest(handleShare, { manual: true });

  const onClick = () => {
    run();
    trackClick(["Share", "1"], { symbol: props.symbol });
  };

  return (
    <Button variant="text" onClick={onClick} loading={loading}>
      {!loading && <ICShareOutlined size="20" color="#8C8C8C" id="share"  />}
    </Button>
  );
}
