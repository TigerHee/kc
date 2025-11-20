import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M9.096 2.376a1 1 0 0 1-.54 1.307 9 9 0 0 0-2.92 1.953A8.97 8.97 0 0 0 3 12a9 9 0 0 0 9 9 8.97 8.97 0 0 0 6.364-2.636 9 9 0 0 0 1.953-2.92 1 1 0 0 1 1.848.767 11 11 0 0 1-2.387 3.567m0 0A10.97 10.97 0 0 1 12 23C5.925 23 1 18.075 1 12c0-3.037 1.232-5.789 3.222-7.778a11 11 0 0 1 3.567-2.387 1 1 0 0 1 1.307.54" />
        <path d="M11 2a1 1 0 0 1 1-1c6.075 0 11 4.925 11 11a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1zm2 1.055V11h7.945A9.004 9.004 0 0 0 13 3.055" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
