import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12m11-9a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9" />
        <path d="M9.525 6.525a3.5 3.5 0 1 1 4.95 4.95 3.5 3.5 0 0 1-4.95-4.95M12 7.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M10 15.5a4 4 0 0 0-3.991 3.732 1 1 0 1 1-1.996-.132A6 6 0 0 1 10 13.5h4a6 6 0 0 1 5.986 5.588 1 1 0 1 1-1.995.135A4 4 0 0 0 14 15.5z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
