import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.5 2a1 1 0 0 1 1 1v.5h6a1 1 0 0 1 .394.08L16.205 5H19.5a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H16a1 1 0 0 1-.394-.08L12.295 16H6.5v4h1a1 1 0 1 1 0 2h-4a1 1 0 1 1 0-2h1V3a1 1 0 0 1 1-1m1 12V5.5h5.795l3.311 1.42A1 1 0 0 0 16 7h3.5v8.5h-3.295l-3.311-1.42A1 1 0 0 0 12.5 14z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
