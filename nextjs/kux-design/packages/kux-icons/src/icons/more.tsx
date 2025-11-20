import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M6 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M19.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
