import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M17.707 9.707a1 1 0 0 0-1.414-1.414L11 13.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0z" />
        <path
          fillRule="evenodd"
          d="M12 1a10.97 10.97 0 0 0-7.778 3.222A10.97 10.97 0 0 0 1 12c0 3.037 1.232 5.789 3.222 7.778A10.97 10.97 0 0 0 12 23c3.037 0 5.789-1.232 7.778-3.222A10.97 10.97 0 0 0 23 12c0-3.037-1.232-5.789-3.222-7.778A10.97 10.97 0 0 0 12 1M5.636 5.636A8.97 8.97 0 0 1 12 3a8.97 8.97 0 0 1 6.364 2.636A8.97 8.97 0 0 1 21 12a8.97 8.97 0 0 1-2.636 6.364A8.97 8.97 0 0 1 12 21a8.97 8.97 0 0 1-6.364-2.636A8.97 8.97 0 0 1 3 12a8.97 8.97 0 0 1 2.636-6.364"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
