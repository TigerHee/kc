import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M5 4a1 1 0 0 0-1 1v2.5a1 1 0 0 1-2 0V5a3 3 0 0 1 3-3h2.5a1 1 0 0 1 0 2zM3 15.5a1 1 0 0 1 1 1V19a1 1 0 0 0 1 1h2.5a1 1 0 1 1 0 2H5a3 3 0 0 1-3-3v-2.5a1 1 0 0 1 1-1M22 16.5a1 1 0 1 0-2 0V19a1 1 0 0 1-1 1h-2.5a1 1 0 1 0 0 2H19a3 3 0 0 0 3-3zM15.5 3a1 1 0 0 1 1-1H19a3 3 0 0 1 3 3v2.5a1 1 0 1 1-2 0V5a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-1-1M5 11a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
