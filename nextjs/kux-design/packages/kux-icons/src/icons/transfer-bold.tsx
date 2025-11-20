import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M14.96 4.53a.9.9 0 0 1 1.26.18l3 4a.9.9 0 0 1-.72 1.44h-13a.9.9 0 0 1 0-1.8h11.2l-1.92-2.56a.9.9 0 0 1 .18-1.26M9.04 19.47a.9.9 0 0 1-1.26-.18l-3-4a.9.9 0 0 1 .72-1.44h13a.9.9 0 0 1 0 1.8H7.3l1.92 2.56a.9.9 0 0 1-.18 1.26" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
