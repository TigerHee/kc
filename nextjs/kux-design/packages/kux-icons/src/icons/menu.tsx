import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M3.6 6a1.2 1.2 0 0 1 1.2-1.2h14.4a1.2 1.2 0 0 1 0 2.4H4.8A1.2 1.2 0 0 1 3.6 6M3.6 12a1.2 1.2 0 0 1 1.2-1.2H12a1.2 1.2 0 0 1 0 2.4H4.8A1.2 1.2 0 0 1 3.6 12M3.6 18a1.2 1.2 0 0 1 1.2-1.2h14.4a1.2 1.2 0 0 1 0 2.4H4.8A1.2 1.2 0 0 1 3.6 18" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
