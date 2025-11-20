import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M3.402 2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 2h5v5h-5z"
          clipRule="evenodd"
        />
        <path d="M3.402 15.5a1 1 0 1 0-2 0V19a3 3 0 0 0 3 3h3.5a1 1 0 1 0 0-2h-3.5a1 1 0 0 1-1-1zM19.098 14a1 1 0 1 0-2 0v2.5h-2.5a1 1 0 1 0 0 2h2.5V21a1 1 0 1 0 2 0v-2.5h2.5a1 1 0 1 0 0-2h-2.5zM14.902 2a1 1 0 1 0 0 2h3.5a1 1 0 0 1 1 1v3.5a1 1 0 1 0 2 0V5a3 3 0 0 0-3-3z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
