import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.614 1.536A1 1 0 0 1 9.5 1h9a1 1 0 0 1 .786 1.618L15.057 8H20.5a1 1 0 0 1 .735 1.678l-12 13a1 1 0 0 1-1.702-.933l2.17-8.245H4a1 1 0 0 1-.886-1.464zM10.105 3l-4.452 8.5H11a1 1 0 0 1 .967 1.255L10.49 18.37 18.216 10H13a1 1 0 0 1-.786-1.618L16.442 3z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
