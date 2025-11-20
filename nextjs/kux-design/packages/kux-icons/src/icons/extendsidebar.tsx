import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M6 20v2h12v-2zm-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2v2l.206-.005A4 4 0 0 0 22 18V6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4v-2a2 2 0 0 1-2-2" />
        <path d="M15 3v18h2V3zM9.707 8.293a1 1 0 1 0-1.414 1.414L10.586 12l-2.293 2.293-.068.076a1 1 0 0 0 1.406 1.406l.076-.068 3-3a1 1 0 0 0 0-1.414z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
