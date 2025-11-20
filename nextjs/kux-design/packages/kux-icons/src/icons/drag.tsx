import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M2.975 5.975a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2h-16a1 1 0 0 1-1-1M2.975 11.975a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2h-16a1 1 0 0 1-1-1M2.975 17.975a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2h-16a1 1 0 0 1-1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
