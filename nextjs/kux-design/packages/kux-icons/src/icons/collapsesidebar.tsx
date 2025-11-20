import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M18 20v2H6v-2zm2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2v2l-.206-.005A4 4 0 0 1 2 18V6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4v-2a2 2 0 0 0 2-2" />
        <path d="M9 3v18H7V3zM14.293 8.293a1 1 0 1 1 1.414 1.414L13.414 12l2.293 2.293.068.076a1 1 0 0 1-1.406 1.406l-.076-.068-3-3a1 1 0 0 1 0-1.414z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
