import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M16.006 10.896a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5zM16.006 6.895a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5z" />
        <path
          fillRule="evenodd"
          d="M17.34 2.4a3 3 0 0 1 3 3v13.2l-.016.307a3 3 0 0 1-2.678 2.678l-.305.015H6.67a3 3 0 0 1-3-3V5.4a3 3 0 0 1 2.694-2.985l.307-.015zM6.672 3.9a1.5 1.5 0 0 0-1.5 1.5v13.2a1.5 1.5 0 0 0 1.5 1.5h.886l.001-16.2zm2.386 16.2h8.283a1.5 1.5 0 0 0 1.5-1.5V5.4c0-.828-.673-1.5-1.501-1.5H9.059z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
