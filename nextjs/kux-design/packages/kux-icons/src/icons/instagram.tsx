import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M6.86 3.75a3.11 3.11 0 0 0-3.11 3.11v10.28a3.11 3.11 0 0 0 3.11 3.11h10.28a3.11 3.11 0 0 0 3.11-3.11V6.86a3.11 3.11 0 0 0-3.11-3.11zM1.75 6.86a5.11 5.11 0 0 1 5.11-5.11h10.28a5.11 5.11 0 0 1 5.11 5.11v10.28a5.11 5.11 0 0 1-5.11 5.11H6.86a5.11 5.11 0 0 1-5.11-5.11z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M12 9.43a2.57 2.57 0 1 0 0 5.14 2.57 2.57 0 0 0 0-5.14M7.43 12a4.57 4.57 0 1 1 9.14 0 4.57 4.57 0 0 1-9.14 0"
          clipRule="evenodd"
        />
        <path d="M17.15 7.92a1.03 1.03 0 1 0 0-2.06 1.03 1.03 0 0 0 0 2.06" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
