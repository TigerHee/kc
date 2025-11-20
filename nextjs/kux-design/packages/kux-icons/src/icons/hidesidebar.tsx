import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M3.5 20a1 1 0 1 0 2 0V4a1 1 0 1 0-2 0zM7.293 12.707a1 1 0 0 1 0-1.414l6-6a1 1 0 1 1 1.414 1.414L10.414 11H22a1 1 0 1 1 0 2H10.414l4.293 4.293a1 1 0 0 1-1.414 1.414z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
