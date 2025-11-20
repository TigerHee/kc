import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" clipPath="url(#a)">
        <path d="M17.707 9.707a1 1 0 0 0-1.414-1.414L11 13.586l-2.793-2.793a1 1 0 1 0-1.414 1.414l3.5 3.5a1 1 0 0 0 1.414 0z" />
        <path
          fillRule="evenodd"
          d="M13.406 1.368a5 5 0 0 0-2.803 0l-5.724 1.67A4 4 0 0 0 2 6.878v3.136a14.16 14.16 0 0 0 8.35 12.914 4.03 4.03 0 0 0 3.303 0A14.16 14.16 0 0 0 22 10.017v-3.14a4 4 0 0 0-2.878-3.84zm-2.243 1.92a3 3 0 0 1 1.682 0l5.716 1.669A2 2 0 0 1 20 6.877v3.14c0 4.82-2.84 9.141-7.167 11.087a2.03 2.03 0 0 1-1.663 0A12.16 12.16 0 0 1 4 10.014V6.877a2 2 0 0 1 1.44-1.92z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="currentColor" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
