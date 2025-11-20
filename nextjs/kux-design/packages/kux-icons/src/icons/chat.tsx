import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M6.7 10.7a1 1 0 0 1 1-1h9a1 1 0 0 1 0 2h-9a1 1 0 0 1-1-1M7.7 14.7a1 1 0 1 0 0 2h5a1 1 0 0 0 0-2z" />
        <path
          fillRule="evenodd"
          d="M2.2 12c0-5.412 4.388-9.8 9.8-9.8s9.8 4.388 9.8 9.8-4.388 9.8-9.8 9.8H4.2c-1.102 0-2-.89-2-1.998zM12 4.2A7.8 7.8 0 0 0 4.2 12v7.8H12a7.8 7.8 0 0 0 0-15.6"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
