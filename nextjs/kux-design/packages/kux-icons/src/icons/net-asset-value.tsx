import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M16.748 10.589a1.083 1.083 0 0 0-1.713-1.328l-1.77 2.284-1.328-1.046-.008-.006a1.92 1.92 0 0 0-2.694.345L7.25 13.414a1.083 1.083 0 1 0 1.717 1.322l1.83-2.377 1.325 1.043.007.005a1.926 1.926 0 0 0 2.688-.327z" />
        <path
          fillRule="evenodd"
          d="M2 7a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5zm5-2.833h10A2.833 2.833 0 0 1 19.833 7v10A2.833 2.833 0 0 1 17 19.833H7A2.833 2.833 0 0 1 4.167 17V7A2.833 2.833 0 0 1 7 4.167"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
