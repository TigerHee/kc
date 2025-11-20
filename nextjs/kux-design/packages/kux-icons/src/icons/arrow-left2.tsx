import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9.607 5.293a1 1 0 0 1 0 1.414L5.314 11h15.585a1 1 0 1 1 0 2H5.314l4.293 4.293a1 1 0 1 1-1.415 1.414l-6-6-.002-.002a.997.997 0 0 1 0-1.41l.002-.002 6-6a1 1 0 0 1 1.415 0"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
