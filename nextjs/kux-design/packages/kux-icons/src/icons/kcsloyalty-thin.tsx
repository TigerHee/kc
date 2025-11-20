import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16 3.25c.966 0 1.75.783 1.75 1.75v.741h1.875c.897 0 1.625.729 1.625 1.626v1.337c0 1.61-.91 3.08-2.35 3.8l-1.643.822A5.75 5.75 0 0 1 12.75 16.7v2.55H16l.15.016a.751.751 0 0 1 0 1.47l-.15.015H8a.75.75 0 0 1 0-1.5h3.25V16.7a5.75 5.75 0 0 1-4.509-3.374L5.1 12.504a4.25 4.25 0 0 1-2.35-3.8V7.367c0-.898.728-1.626 1.625-1.626H6.25V5c0-.967.784-1.75 1.75-1.75zm-8 1.5a.25.25 0 0 0-.25.25v6a4.25 4.25 0 0 0 8.5 0V5a.25.25 0 0 0-.25-.25zM4.375 7.241a.126.126 0 0 0-.125.126v1.336l.007.194a2.75 2.75 0 0 0 1.513 2.265l.494.248A6 6 0 0 1 6.25 11V7.24zM17.75 11q-.001.206-.016.41l.495-.248a2.75 2.75 0 0 0 1.521-2.46V7.368a.126.126 0 0 0-.125-.126H17.75z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
