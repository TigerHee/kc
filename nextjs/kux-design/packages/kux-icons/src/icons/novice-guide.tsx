import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12.895 5.965a3.6 3.6 0 0 0-3.6 3.6.9.9 0 0 0 1.8 0 1.8 1.8 0 1 1 1.8 1.8.9.9 0 0 0-.9.9v1.8a.9.9 0 0 0 1.8 0v-1.013a3.602 3.602 0 0 0-.9-7.087M12.895 18.115a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25" />
        <path
          fillRule="evenodd"
          d="M8 1a4 4 0 0 0-4 4v1H2.512a1 1 0 0 0 0 2H4v3H2.512a1 1 0 1 0 0 2H4v3H2.512a1 1 0 1 0 0 2H4v1a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4zM6 19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
