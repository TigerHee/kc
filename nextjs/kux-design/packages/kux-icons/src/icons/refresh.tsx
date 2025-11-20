import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M12 4a8 8 0 1 0 5.657 13.657 1 1 0 1 1 1.414 1.414A9.97 9.97 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2a9.97 9.97 0 0 1 7.071 2.929c.434.434.929.976.929.976l-1.248 1.597s-.7-.764-1.095-1.159A7.97 7.97 0 0 0 12 4" />
        <path d="M21 3a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-4.5a1 1 0 1 1 0-2l2.252.002L20 5.905V4a1 1 0 0 1 1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
