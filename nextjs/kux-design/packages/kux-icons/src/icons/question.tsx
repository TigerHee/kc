import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M8 9.312a4 4 0 1 1 5 3.874v1.126a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1 2 2 0 1 0-2-2 1 1 0 1 1-2 0M13.25 17.562a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0" />
        <path
          fillRule="evenodd"
          d="M4.222 4.222A10.97 10.97 0 0 1 12 1c3.037 0 5.789 1.232 7.778 3.222A10.97 10.97 0 0 1 23 12c0 3.037-1.232 5.789-3.222 7.778A10.97 10.97 0 0 1 12 23a10.97 10.97 0 0 1-7.778-3.222A10.97 10.97 0 0 1 1 12c0-3.037 1.232-5.789 3.222-7.778M12 3a8.97 8.97 0 0 0-6.364 2.636A8.97 8.97 0 0 0 3 12a8.97 8.97 0 0 0 2.636 6.364A8.97 8.97 0 0 0 12 21a8.97 8.97 0 0 0 6.364-2.636A8.97 8.97 0 0 0 21 12a8.97 8.97 0 0 0-2.636-6.364A8.97 8.97 0 0 0 12 3"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
