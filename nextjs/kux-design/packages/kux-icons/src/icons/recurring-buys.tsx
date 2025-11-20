import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3.015 12a9 9 0 1 1 1.799 5.4 1 1 0 1 0-1.6 1.2c2.006 2.67 5.201 4.4 8.8 4.4 6.076 0 11-4.925 11-11s-4.924-11-11-11c-6.074 0-11 4.925-11 11H.576a.3.3 0 0 0-.25.466l1.274 1.91a.5.5 0 0 0 .832 0l1.273-1.91a.3.3 0 0 0-.25-.466zm9.5-5a1 1 0 1 0-2 0v5.004a1 1 0 0 0 .293.708l2.995 2.995a1 1 0 0 0 1.414-1.414l-2.702-2.703z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
