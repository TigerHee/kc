import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12 5.5A1.25 1.25 0 1 1 12 8a1.25 1.25 0 0 1 0-2.5M10.25 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v6H14a1 1 0 1 1 0 2h-3.5a1 1 0 1 1 0-2h.75v-5a1 1 0 0 1-1-1" />
        <path
          fillRule="evenodd"
          d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12m11-9a9 9 0 1 0 0 18 9 9 0 0 0 0-18"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
