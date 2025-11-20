import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12.5 8.046c0-.301-.395-.415-.554-.159l-1.66 2.654a.3.3 0 0 0 .255.459h.961v2.954c0 .301.395.414.554.159l1.66-2.654a.3.3 0 0 0-.255-.46H12.5z" />
        <path
          fillRule="evenodd"
          d="M5 9.5a7 7 0 0 1 14 0v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm7-5a5 5 0 0 0-5 5v7h10v-7a5 5 0 0 0-5-5"
          clipRule="evenodd"
        />
        <path d="M2.5 21a1 1 0 0 1 1-1h17a1 1 0 1 1 0 2h-17a1 1 0 0 1-1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
