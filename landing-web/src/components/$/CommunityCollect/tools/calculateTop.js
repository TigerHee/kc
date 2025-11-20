/**
 * Owner: lucas.l.lu@kupotech.com
 */
export function calculateTop(props, baseTop = 0) {
  const { enableRestrictNotice, restrictNoticeHeight } = props;
  const noticeHeight = getNoticeHeightValue(enableRestrictNotice, restrictNoticeHeight);

  return `${baseTop + noticeHeight}px`;
}

export function getNoticeHeightValue(enable, height, defaultValue = 0) {
  return enable ? height || 0 : defaultValue;
}
