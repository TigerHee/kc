import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="m10 13.762 3.917 2.828a1 1 0 1 0 1.17-1.621L12 12.739V4.25a1 1 0 1 0-2 0z" />
        <circle cx={1.5} cy={1.5} r={1.5} transform="matrix(1 0 0 -1 16.5 19.75)" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
