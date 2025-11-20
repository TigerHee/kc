import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.425 4.235a9.1 9.1 0 0 1 13.566 6.627 1 1 0 0 1-1.982.276A7.1 7.1 0 0 0 6.192 8H8a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1V5a1 1 0 0 1 2 0v1.273a9.1 9.1 0 0 1 2.425-2.038M3.862 12.01a1 1 0 0 1 1.128.853A7.1 7.1 0 0 0 17.81 16H16a1 1 0 0 1 0-2h4a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-1.273a9.1 9.1 0 0 1-15.99-4.59 1 1 0 0 1 .852-1.128"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
