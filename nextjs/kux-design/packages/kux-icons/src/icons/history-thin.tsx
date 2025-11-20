import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M16.001 20.254a.75.75 0 0 0-.151 1.485l.151.015h3.001a.75.75 0 0 0 0-1.5zM12 2.246c-5.386 0-9.753 4.367-9.753 9.754S6.614 21.753 12 21.753a.75.75 0 0 0 0-1.5 8.253 8.253 0 1 1 0-16.507A8.254 8.254 0 0 1 20.254 12a8 8 0 0 1-.124 1.376l-.094.452-.02.15a.75.75 0 0 0 1.479.196c.169-.712.256-1.44.259-2.17V12c0-5.387-4.367-9.754-9.754-9.754" />
        <path d="M16.002 17.253a.75.75 0 0 0-.15 1.485l.15.015h5.002a.75.75 0 0 0 0-1.5zM12 7.248a.75.75 0 0 0-.75.75v4.638a.75.75 0 0 0 .36.64l3.658 2.23.137.066a.75.75 0 0 0 .643-1.347l-3.298-2.01V7.997a.75.75 0 0 0-.75-.75" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
