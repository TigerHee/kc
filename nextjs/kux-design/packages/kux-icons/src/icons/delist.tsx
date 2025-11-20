import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M12 3a9 9 0 1 0 .901 17.956 1 1 0 0 1 .198 1.99Q12.556 23 12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11q0 .555-.054 1.099a1 1 0 1 1-1.99-.198Q21 12.457 21 12a9 9 0 0 0-9-9" />
        <path d="M21.036 22.444c-.863.741-2.209.741-3.072 0l-1.616-1.389a1 1 0 0 1 1.304-1.517l.848.73V16a1 1 0 1 1 2 0v4.267l.848-.729a1 1 0 1 1 1.304 1.517zM13 7a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H8a1 1 0 1 1 0-2h4V8a1 1 0 0 1 1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
