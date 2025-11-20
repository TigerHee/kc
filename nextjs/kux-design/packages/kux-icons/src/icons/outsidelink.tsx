import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M7 2a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5v-2a1 1 0 1 0-2 0v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h2a1 1 0 0 0 0-2z" />
        <path d="M14 2a1 1 0 1 0 0 2h4.585l-6.392 6.393a1 1 0 0 0 1.414 1.414L20 5.414V10a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
