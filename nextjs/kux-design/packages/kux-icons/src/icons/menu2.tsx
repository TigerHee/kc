import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M20.4 18a1.2 1.2 0 0 1-1.2 1.2H4.8a1.2 1.2 0 1 1 0-2.4h14.4a1.2 1.2 0 0 1 1.2 1.2M20.4 12a1.2 1.2 0 0 1-1.2 1.2H12a1.2 1.2 0 1 1 0-2.4h7.2a1.2 1.2 0 0 1 1.2 1.2M20.4 6a1.2 1.2 0 0 1-1.2 1.2H4.8a1.2 1.2 0 0 1 0-2.4h14.4A1.2 1.2 0 0 1 20.4 6" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
