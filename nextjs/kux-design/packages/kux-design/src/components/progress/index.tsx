/**
 * Owner: larvide.peng@kupotech.com
 *
 * @description Progress component
 */

import './style.scss';

export interface IProgressProps {
  /**
   * 百分比。0~1浮点数
   */
  percent: number;
  /**
   * 当前进度值展示值
   */
  value: number;
  /**
   * 进度条总值展示值
   */
  total: number;
  /**
   * 进度条名称
   */
  progressName: string;
  /**
   * 是否展示进度条展示值
   */
  showOuter?: boolean;
}

export const Progress = (props: IProgressProps) => {
  const { value, progressName, total, percent, showOuter = true } = props;
  const { formatNumber } = app;

  if (app.is(value, 'undefined') || app.is(total, 'undefined')) {
    return null;
  }

  const safePercent = !app.is(Number(percent), 'NaN') ? Number(percent) : 0;
  return (
    <div className="kux-progress">
      <div className="kux-progress_inner">
        {!!safePercent && (
          <div
            className="kux-progress_bar"
            style={{
              width: `${safePercent * 100}%`,
            }}
          ></div>
        )}
      </div>

      <div className="kux-progress_outer">
        <span className="kux-progress_outer_name" data-testid="kux-progress-name">
          {progressName}
        </span>
        {showOuter && (
          <span className="kux-progress_outer_text">
            <span className="kux-progress_outer_text_highlight">{formatNumber(value)}</span>/
            {formatNumber(total)}
          </span>
        )}
      </div>
    </div>
  );
};
