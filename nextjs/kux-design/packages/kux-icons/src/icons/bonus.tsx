import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.247 1.842a1 1 0 0 1 1.412-.095L11.804 4.5h.392l3.146-2.753a1 1 0 1 1 1.316 1.506L15.234 4.5H20a3 3 0 0 1 3 3v1a2 2 0 0 1-1.5 1.937V18.5a4 4 0 0 1-4 4h-11a4 4 0 0 1-4-4v-8.063A2 2 0 0 1 1 8.5v-1a3 3 0 0 1 3-3h4.767L7.341 3.253a1 1 0 0 1-.094-1.411M13 10.5h6.5v8a2 2 0 0 1-2 2H13zm-8.5 0H11v10H6.5a2 2 0 0 1-2-2zm16.5-2H3v-1a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
