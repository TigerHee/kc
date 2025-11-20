import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M3.156 6.334a3 3 0 0 1 3-3h1.407v2H6.156a1 1 0 0 0-1 1v12.293a2 2 0 0 0 2 2h9.74a2 2 0 0 0 2-2V6.334a1 1 0 0 0-1-1h-1.46l.064-2h1.396a3 3 0 0 1 3 3v12.293a4 4 0 0 1-4 4h-9.74a4 4 0 0 1-4-4z" />
        <path d="M8.04 10.715a1 1 0 0 1 1-1h5.92a1 1 0 1 1 0 2H9.04a1 1 0 0 1-1-1M8.04 15.246a1 1 0 0 1 1-1h3.657a1 1 0 1 1 0 2H9.04a1 1 0 0 1-1-1M7.5 3.168a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v1.665a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V3.168m7 0h-5v1.665h5z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
