import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M6.242 8.758a.9.9 0 0 1 0-1.274L12 1.728l5.758 5.757a.9.9 0 0 1-1.273 1.273L12.9 5.174V15a.9.9 0 0 1-1.8 0V5.173L7.515 8.758a.9.9 0 0 1-1.273 0" />
        <circle cx={12} cy={19.5} r={1.4} />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
