import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11.594 2.086a1 1 0 0 1 .812 0l9 4A1 1 0 0 1 22 7v2a1 1 0 0 1-1 1h-2v10h2a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h2V10H3a1 1 0 0 1-1-1V7a1 1 0 0 1 .594-.914zM7 10v10h4V10zm6 0v10h4V10zM4 7.65V8h16v-.35l-8-3.556z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
