import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M13 2a1 1 0 1 0-2 0v10.586l-2.293-2.293a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L13 12.586z" />
        <path d="M18.955 8.044 18.928 8a1 1 0 0 1 1.71-1.035l.003-.002A9.95 9.95 0 0 1 22 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-1.837.495-3.557 1.359-5.037l.002.002a1 1 0 1 1 1.684 1.079 8 8 0 1 0 13.91 0" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
