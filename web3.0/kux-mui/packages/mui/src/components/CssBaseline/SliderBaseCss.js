import React from 'react';
import useTheme from 'hooks/useTheme';
import { css, Global } from 'emotion/index';

export default function RcSliderCss() {
  const theme = useTheme();
  return (
    <Global
      styles={css`
        .KuxSlider {
          position: relative;
          height: 20px;
          padding: 5px 0;
          width: 100%;
          border-radius: 4px;
          touch-action: none;
          box-sizing: border-box;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .KuxSlider * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .KuxSlider-rail {
          position: absolute;
          width: 100%;
          background-color: ${theme.currentTheme === 'dark'
            ? 'rgba(36, 36, 36, 1)'
            : 'rgba(237, 237, 237, 1)'};
          height: 3px;
          border-radius: 4px;
        }
        .KuxSlider-track {
          position: absolute;
          left: 0;
          height: 3px;
          border-radius: 4px;
          background-color: ${theme.colors.primary};
        }
        .KuxSlider-handle {
          position: absolute;
          top: 4px;
          width: 15px;
          height: 15px;
          cursor: pointer;
          cursor: -webkit-grab;
          margin-top: -5px;
          cursor: grab;
          border-radius: 50%;
          border: solid 3px ${theme.colors.primary};
          background-color: ${theme.colors.backgroundMajor};
          touch-action: pan-x;
        }
        .KuxSlider-handle:focus {
          outline: none;
        }
        .KuxSlider-handle-click-focused:focus {
          box-shadow: unset;
        }
        .KuxSlider-handle:active {
          cursor: -webkit-grabbing;
          cursor: grabbing;
        }
        .KuxSlider-mark {
          position: absolute;
          top: 18px;
          left: 0;
          width: 100%;
          font-size: 12px;
        }
        .KuxSlider-mark-text {
          position: absolute;
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          cursor: pointer;
          color: ${theme.colors.text60};
          &:first-of-type {
            transform: translateX(-8%) !important;
          }
          &:last-of-type {
            transform: translateX(-80%) !important;
          }
        }
        .KuxSlider-step {
          position: absolute;
          width: 100%;
          height: 3px;
          background: transparent;
        }
        .KuxSlider-dot {
          position: absolute;
          bottom: -4.5px;
          margin-left: -4px;
          width: 12px;
          height: 12px;
          border: 2px solid ${theme.colors.backgroundMajor};
          background-color: ${theme.currentTheme === 'dark'
            ? 'rgba(36, 36, 36, 1)'
            : 'rgba(237, 237, 237, 1)'};
          cursor: pointer;
          border-radius: 50%;
          vertical-align: middle;
        }
        .KuxSlider-dot-active {
          background-color: ${theme.colors.primary};
        }
        .KuxSlider-dot-reverse {
          margin-right: -4px;
        }
        .KuxSlider-disabled {
          .KuxSlider-track {
            background: ${theme.colors.cover12};
          }
          .KuxSlider-handle {
            cursor: not-allowed;
            border-color: ${theme.currentTheme === 'dark'
              ? 'rgba(36, 36, 36, 1)'
              : 'rgba(237, 237, 237, 1)'};
          }
        }
        .KuxSlider-vertical {
          width: 14px;
          height: 100%;
          padding: 0 5px;
        }
        .KuxSlider-vertical .KuxSlider-rail {
          height: 100%;
          width: 4px;
        }
        .KuxSlider-vertical .KuxSlider-track {
          left: 5px;
          bottom: 0;
          width: 4px;
        }
        .KuxSlider-vertical .KuxSlider-handle {
          margin-left: -5px;
          touch-action: pan-y;
        }
        .KuxSlider-vertical .KuxSlider-mark {
          top: 0;
          left: 18px;
          height: 100%;
        }
        .KuxSlider-vertical .KuxSlider-step {
          height: 100%;
          width: 4px;
        }
        .KuxSlider-vertical .KuxSlider-dot {
          left: 2px;
          margin-bottom: -4px;
        }
        .KuxSlider-vertical .KuxSlider-dot:first-of-type {
          margin-bottom: -4px;
        }
        .KuxSlider-vertical .KuxSlider-dot:last-of-type {
          margin-bottom: -4px;
        }
        .KuxSlider-tooltip-zoom-down-enter,
        .KuxSlider-tooltip-zoom-down-appear {
          animation-duration: 0.3s;
          animation-fill-mode: both;
          display: block !important;
          animation-play-state: paused;
        }
        .KuxSlider-tooltip-zoom-down-leave {
          animation-duration: 0.3s;
          animation-fill-mode: both;
          display: block !important;
          animation-play-state: paused;
        }
        .KuxSlider-tooltip-zoom-down-enter.KuxSlider-tooltip-zoom-down-enter-active,
        .KuxSlider-tooltip-zoom-down-appear.KuxSlider-tooltip-zoom-down-appear-active {
          animation-name: rcSliderTooltipZoomDownIn;
          animation-play-state: running;
        }
        .KuxSlider-tooltip-zoom-down-leave.KuxSlider-tooltip-zoom-down-leave-active {
          animation-name: rcSliderTooltipZoomDownOut;
          animation-play-state: running;
        }
        .KuxSlider-tooltip-zoom-down-enter,
        .KuxSlider-tooltip-zoom-down-appear {
          transform: scale(0, 0);
          animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
        }
        .KuxSlider-tooltip-zoom-down-leave {
          animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        }
        @keyframes rcSliderTooltipZoomDownIn {
          0% {
            opacity: 0;
            transform-origin: 50% 100%;
            transform: scale(0, 0);
          }
          100% {
            transform-origin: 50% 100%;
            transform: scale(1, 1);
          }
        }
        @keyframes rcSliderTooltipZoomDownOut {
          0% {
            transform-origin: 50% 100%;
            transform: scale(1, 1);
          }
          100% {
            opacity: 0;
            transform-origin: 50% 100%;
            transform: scale(0, 0);
          }
        }
        .KuxSlider-tooltip {
          position: absolute;
          left: -9999px;
          top: -9999px;
          visibility: visible;
          box-sizing: border-box;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .KuxSlider-tooltip * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .KuxSlider-tooltip-hidden {
          display: none;
        }
        .KuxSlider-tooltip-inner {
          padding: 2px 5.5px;
          min-width: 25px;
          font-size: 12px;
          line-height: 1.3;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          background-color: ${theme.colors.tip};
          border-radius: 4px;
        }
      `}
    />
  );
}
