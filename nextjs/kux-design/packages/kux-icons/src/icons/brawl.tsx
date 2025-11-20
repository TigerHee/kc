import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M20.341 5.96a1.098 1.098 0 0 0-1.756-1.317l-3.152 4.201a.2.2 0 0 1-.36-.12V5.037a1.098 1.098 0 0 0-2.195 0v10.286a1.098 1.098 0 1 0 2.195 0v-4.605c0-.203.267-.277.372-.103l3.077 5.13a1.098 1.098 0 1 0 1.882-1.13L17.491 9.76z" />
        <path
          fillRule="evenodd"
          d="M4.098 16.42c.606 0 1.097-.49 1.097-1.097v-4.14H7.39a3.293 3.293 0 0 0 3.293-3.293V6.793A3.293 3.293 0 0 0 7.39 3.5H3v11.823c0 .606.491 1.098 1.098 1.098M5.195 5.696H7.39c.607 0 1.098.491 1.098 1.098V7.89c0 .606-.491 1.098-1.098 1.098H5.195z"
          clipRule="evenodd"
        />
        <path d="M3 19.517c0-.542.44-.982.982-.982h16.036a.982.982 0 0 1 0 1.964H3.982A.98.98 0 0 1 3 19.517" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
