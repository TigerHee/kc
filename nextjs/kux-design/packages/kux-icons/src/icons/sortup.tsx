import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="m11.995 20 .102-.005a1 1 0 0 0 0-1.99L11.995 18H4a1 1 0 1 0 0 2zM12 13a1 1 0 0 0 0-2H4a1 1 0 1 0 0 2zM12 6a1 1 0 0 0 0-2H4a1 1 0 1 0 0 2zM17 19.5a1 1 0 1 0 2 0V6.534l1.27 1.358a1 1 0 0 0 1.46-1.367l-3-3.208A1 1 0 0 0 17 4z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
