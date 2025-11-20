import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M4.75 3.879a4.29 4.29 0 0 1 3.7-2.116h7.1c1.521 0 2.929.805 3.7 2.116l3.497 5.945c.79 1.343.79 3.01 0 4.352l-3.497 5.945a4.29 4.29 0 0 1-3.7 2.117h-7.1a4.29 4.29 0 0 1-3.7-2.117l-3.497-5.944a4.29 4.29 0 0 1 0-4.353zm3.7-.016c-.777 0-1.496.41-1.89 1.08l-3.497 5.945a2.19 2.19 0 0 0 0 2.224l3.497 5.945a2.19 2.19 0 0 0 1.89 1.08h7.1c.777 0 1.496-.41 1.89-1.08l3.497-5.945a2.19 2.19 0 0 0 0-2.224L17.44 4.943a2.19 2.19 0 0 0-1.89-1.08z" />
        <path d="M8.248 12a3.752 3.752 0 1 1 7.504 0 3.752 3.752 0 0 1-7.504 0M12 10.348a1.652 1.652 0 1 0 0 3.304 1.652 1.652 0 0 0 0-3.304" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
