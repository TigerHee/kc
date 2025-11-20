import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M8.667 5.5a1.667 1.667 0 1 1-3.334 0 1.667 1.667 0 0 1 3.334 0M8.667 10.5a1.667 1.667 0 1 1-3.334 0 1.667 1.667 0 0 1 3.334 0M8.667 15.5a1.667 1.667 0 1 1-3.334 0 1.667 1.667 0 0 1 3.334 0M13.667 5.5a1.667 1.667 0 1 1-3.334 0 1.667 1.667 0 0 1 3.334 0M13.667 10.5a1.667 1.667 0 1 1-3.334 0 1.667 1.667 0 0 1 3.334 0M13.667 15.5a1.667 1.667 0 1 1-3.334 0 1.667 1.667 0 0 1 3.334 0M13.667 20.5a1.667 1.667 0 1 1-3.334 0 1.667 1.667 0 0 1 3.334 0M18.667 5.5a1.667 1.667 0 1 1-3.334 0 1.667 1.667 0 0 1 3.334 0M18.667 10.5a1.667 1.667 0 1 1-3.334 0 1.667 1.667 0 0 1 3.334 0M18.667 15.5a1.667 1.667 0 1 1-3.334 0 1.667 1.667 0 0 1 3.334 0" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
