import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M1 7a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v5a1 1 0 1 1-2 0v-1H3v6a2 2 0 0 0 2 2h7a1 1 0 1 1 0 2H5a4 4 0 0 1-4-4zm20 0v2H3V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"
          clipRule="evenodd"
        />
        <path d="M19 14a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
