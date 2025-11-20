import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M6.242 15.242a.9.9 0 0 0 0 1.274L12 22.273l5.758-5.758a.9.9 0 1 0-1.273-1.273L12.9 18.826V9a.9.9 0 0 0-1.8 0v9.827l-3.585-3.585a.9.9 0 0 0-1.273 0" />
        <circle cx={1.4} cy={1.4} r={1.4} transform="matrix(1 0 0 -1 10.6 5.9)" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
