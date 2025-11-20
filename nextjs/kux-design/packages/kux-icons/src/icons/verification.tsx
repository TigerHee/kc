import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M3 4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-1.25a1 1 0 1 0-2 0V19H3V6h7a1 1 0 1 0 0-2z" />
        <path d="M5 10.5a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2zM17 16.5a1 1 0 1 0 0-2H5a1 1 0 1 0 0 2z" />
        <path
          fillRule="evenodd"
          d="M17 4a4 4 0 0 0-3.04 6.6c-.643.309-1.167.715-1.657 1.16a1 1 0 1 0 1.344 1.48c.47-.425.877-.718 1.357-.915C15.483 12.128 16.096 12 17 12c1.59 0 3.288 1.06 4.11 2.665a1 1 0 1 0 1.78-.911 7.1 7.1 0 0 0-2.982-3.008A4 4 0 0 0 17 4m-2 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
