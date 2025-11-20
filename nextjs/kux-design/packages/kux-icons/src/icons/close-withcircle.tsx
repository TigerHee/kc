import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillOpacity={0.4}
          d="M8.641 14.298a.75.75 0 1 0 1.06 1.06L12 13.062l2.298 2.298a.75.75 0 1 0 1.06-1.06L13.062 12l2.298-2.298a.75.75 0 0 0-1.06-1.06L12 10.938 9.702 8.641a.75.75 0 0 0-1.06 1.061L10.938 12z"
        />
        <path
          fillOpacity={0.1}
          fillRule="evenodd"
          d="M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19m0 1.5c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
