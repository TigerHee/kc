import { useLang } from "gbiz-next/hooks";

export default function useRTL() {
  const { isRTL } = useLang();
  return isRTL;
}