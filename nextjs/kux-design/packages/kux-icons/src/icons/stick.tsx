import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M4 3.5a1 1 0 0 0 0 2h16a1 1 0 1 0 0-2zM11.293 7.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1-1.414 1.414L13 10.414V22a1 1 0 1 1-2 0V10.414l-4.293 4.293a1 1 0 0 1-1.414-1.414z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
