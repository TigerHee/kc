import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M18.22 3.704H5.78a2 2 0 0 0-2 2v12.592a2 2 0 0 0 2 2h3.543a1 1 0 1 1 0 2H5.78a4 4 0 0 1-4-4V5.704a4 4 0 0 1 4-4h12.44a4 4 0 0 1 4 4V6.93a1 1 0 1 1-2 0V5.704a2 2 0 0 0-2-2" />
        <path
          fillRule="evenodd"
          d="M12.311 8.931a2.454 2.454 0 0 0-2.454 2.455v1.09a2.454 2.454 0 1 0 4.909 0v-1.09A2.454 2.454 0 0 0 12.31 8.93m0 1.637c.452 0 .819.366.819.818v1.09a.818.818 0 0 1-1.637 0v-1.09c0-.452.367-.818.818-.818M19.766 15.431a2.454 2.454 0 0 0-2.455 2.455v1.09a2.454 2.454 0 1 0 4.91 0v-1.09a2.454 2.454 0 0 0-2.455-2.455m0 1.637c.452 0 .818.366.818.818v1.09a.818.818 0 0 1-1.636 0v-1.09c0-.452.366-.818.818-.818"
          clipRule="evenodd"
        />
        <path d="M19.897 10.12a1 1 0 0 1 .225 1.397l-6.5 9A1 1 0 0 1 12 19.346l6.5-9a1 1 0 0 1 1.397-.225" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
