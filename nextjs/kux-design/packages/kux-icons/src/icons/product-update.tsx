import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.108 6.313A2 2 0 0 0 1 8.103v8.78a2 2 0 0 0 1.107 1.79l9 4.49a2 2 0 0 0 1.786-.001l9-4.49A2 2 0 0 0 23 16.882V8.104a2 2 0 0 0-1.108-1.79l-9-4.486a2 2 0 0 0-1.784 0zM4.2 7.505l2.765 1.39 7.779-3.91L12 3.617zm4.992 2.51 2.757 1.385 7.8-3.92L16.98 6.1zM11 13.16 3.065 9.173 3 9.137v7.746l8 3.99zm10-4.094q-.077.06-.167.106L13 13.11v7.764l8-3.991z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
