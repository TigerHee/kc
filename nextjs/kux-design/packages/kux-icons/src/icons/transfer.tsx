import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M15.707 2.793a1 1 0 1 0-1.414 1.414L18.586 8.5H3a1 1 0 0 0 0 2h18a.997.997 0 0 0 1-1 1 1 0 0 0-.295-.71zM3.017 13.576a1 1 0 0 1 .382-.076h18a1 1 0 1 1 0 2H5.814l4.293 4.293a1 1 0 0 1-1.415 1.414l-6-6a.998.998 0 0 1 .325-1.631" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
