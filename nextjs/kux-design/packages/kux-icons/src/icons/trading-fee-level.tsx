import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M2.5 5.604a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0m3.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M14.5 18.396a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0m3.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"
          clipRule="evenodd"
        />
        <path d="M21 4.518a1 1 0 0 0-1.414-1.414L2.793 19.896a1 1 0 0 0 1.414 1.415z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
