import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M12 1a5 5 0 1 0 0 10 5 5 0 0 0 0-10M9 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0"
          clipRule="evenodd"
        />
        <path d="M12 12C6.477 12 2 16.477 2 22a1 1 0 1 0 2 0 8 8 0 1 1 16 0 1 1 0 1 0 2 0c0-5.523-4.477-10-10-10" />
        <path d="M8.5 19.5a1 1 0 0 1 1-1H11V17a1 1 0 1 1 2 0v1.5h1.5a1 1 0 1 1 0 2H13V22a1 1 0 1 1-2 0v-1.5H9.5a1 1 0 0 1-1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
