import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M8.498 7.135a1 1 0 0 1 .998-.003l7 4a1 1 0 0 1 0 1.736l-7 4A1 1 0 0 1 8 16V8a1 1 0 0 1 .498-.865M10 9.723v4.554L13.984 12z" />
        <path d="M2 7a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5zm5-2.833h10A2.833 2.833 0 0 1 19.833 7v10A2.833 2.833 0 0 1 17 19.833H7A2.833 2.833 0 0 1 4.167 17V7A2.833 2.833 0 0 1 7 4.167" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
