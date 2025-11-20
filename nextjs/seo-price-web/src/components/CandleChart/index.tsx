/**
 * Owner: will.wang@kupotech.com
 */

import CandleChart from "@/components/CandleChart/CandleChart"
import { checkSocketConnect } from "@/tools/socket";
import { generateUniqueWsInstanceId } from "@/tools/socket/wsInstanceId";
import { useMount } from "ahooks";
import { useState } from "react"


export default (props: any) => {
  const [socketInit, setSocketInit] = useState(false);
  const [wsInstanceId, setWsInstanceId] = useState<number | null>(null);

  useMount(async () => {
    await checkSocketConnect('/price');
    setSocketInit(true);
    setWsInstanceId(generateUniqueWsInstanceId());
  })

  if (!socketInit) {
    return null;
  }

  return (
    <CandleChart {...props} wsInstanceId={wsInstanceId}  />
  )
}