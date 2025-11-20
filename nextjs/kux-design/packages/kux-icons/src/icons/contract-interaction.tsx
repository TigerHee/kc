import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M3 9.5a3 3 0 0 1 3-3h8a3 3 0 1 1 0 6H9a1 1 0 1 0 0 2h5a5 5 0 0 0 0-10H6a5 5 0 0 0-3.75 8.308 1 1 0 0 0 1.5-1.324A2.99 2.99 0 0 1 3 9.5" />
        <path d="M10 8.5a5 5 0 0 0 0 10h8a5 5 0 0 0 3.75-8.307 1 1 0 1 0-1.5 1.323A3 3 0 0 1 18 16.5h-8a3 3 0 1 1 0-6h5a1 1 0 1 0 0-2z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
