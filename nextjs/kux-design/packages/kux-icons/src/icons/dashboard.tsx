import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" clipPath="url(#a)">
        <path d="M12 3C6.477 3 2 7.477 2 13a9.97 9.97 0 0 0 2.929 7.071 1 1 0 1 1-1.414 1.414A11.97 11.97 0 0 1 0 13C0 6.373 5.373 1 12 1s12 5.373 12 12c0 3.313-1.344 6.315-3.515 8.485a1 1 0 0 1-1.414-1.414A9.97 9.97 0 0 0 22 13c0-5.523-4.477-10-10-10" />
        <path d="M12 7a6 6 0 0 0-4.243 10.243 1 1 0 1 1-1.414 1.414A8 8 0 0 1 12 5a1 1 0 1 1 0 2" />
        <path d="M13 9a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0z" />
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
