import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M6.242 13.758a.9.9 0 0 1 0-1.274L12 6.728l5.758 5.757a.9.9 0 0 1-1.273 1.273L12.9 10.174V20a.9.9 0 0 1-1.8 0v-9.827l-3.584 3.585a.9.9 0 0 1-1.274 0M18 4.9a.9.9 0 0 0 0-1.8H6a.9.9 0 0 0 0 1.8z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
