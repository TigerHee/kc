import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M5 5.5a2 2 0 0 0-2 2v1.53a3.75 3.75 0 0 1 1.818 3.22v.002-.004.002A3.75 3.75 0 0 1 3 15.47V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.53a3.75 3.75 0 0 1-1.818-3.22A3.75 3.75 0 0 1 21 9.03V7.5a2 2 0 0 0-2-2zm-4 2a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v2.156a1 1 0 0 1-.66.941 1.75 1.75 0 0 0-1.158 1.65v.005a1.75 1.75 0 0 0 1.157 1.65 1 1 0 0 1 .661.942V17a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4v-2.156a1 1 0 0 1 .661-.941 1.75 1.75 0 0 0 1.157-1.65v-.005a1.75 1.75 0 0 0-1.157-1.65 1 1 0 0 1-.66-.942z" />
        <path d="M8 14.084a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1M8 10.5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
