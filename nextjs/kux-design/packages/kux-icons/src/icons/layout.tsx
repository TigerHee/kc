import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.3 5.6a3.3 3.3 0 0 1 3.3-3.3h12.8a3.3 3.3 0 0 1 3.3 3.3v12.8a3.3 3.3 0 0 1-3.3 3.3H5.6a3.3 3.3 0 0 1-3.3-3.3zm3.3-1.5a1.5 1.5 0 0 0-1.5 1.5v2.2h15.8V5.6a1.5 1.5 0 0 0-1.5-1.5zM4.1 18.4V9.6h10.3v10.3H5.6a1.5 1.5 0 0 1-1.5-1.5m12.1 1.5h2.2a1.5 1.5 0 0 0 1.5-1.5V9.6h-3.7z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
