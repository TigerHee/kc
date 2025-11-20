import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M18 3.5A1.5 1.5 0 0 1 16.5 5v1.901A3 3 0 0 1 18 6.5c.35 0 .687.06 1 .17V3.5A1.5 1.5 0 1 1 20.5 5v2.841c.316.475.5 1.046.5 1.659V14a8 8 0 0 1-8 8H3a1 1 0 0 1-1-1v-1.148c0-1.001.493-1.895 1.256-2.441A4 4 0 0 1 2 14.5v-2a6 6 0 1 1 12 0v1.25c0 .895-.247 1.731-.677 2.446A2 2 0 0 0 15 14.222V3.5a1.5 1.5 0 0 1 3 0m-1 6v4.722a4 4 0 0 1-3.693 3.988l-8.384.645a1 1 0 0 0-.923.997V20h9a6 6 0 0 0 6-6V9.5a1 1 0 1 0-2 0m-13 3v2a2 2 0 0 0 2 2h.5a1.5 1.5 0 0 0 0-3H6a1 1 0 1 1 0-2h.5a3.5 3.5 0 0 1 3.179 4.967A2.75 2.75 0 0 0 12 13.75V12.5a4 4 0 0 0-8 0"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
