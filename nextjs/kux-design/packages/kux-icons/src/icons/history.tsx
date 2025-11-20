import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M16.969 2.186a11 11 0 1 0-5.804 20.782 1 1 0 1 0 .152-1.994 9 9 0 1 1 9.657-8.29 1 1 0 1 0 1.994.151 11 11 0 0 0-6-10.649" />
        <path d="M15 20a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2zM16 17a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1M12.5 7a1 1 0 1 0-2 0v5.004a1 1 0 0 0 .293.708l2.995 2.995a1 1 0 0 0 1.415-1.414L12.5 11.59z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
