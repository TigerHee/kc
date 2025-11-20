import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M23 9v9a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V9.268c0-.175.009-.51.009-.51l3.026-.054 6.818 4.772a2 2 0 0 0 2.294 0l6.818-4.772zm-2 1.42-6.706 4.695a4 4 0 0 1-4.588 0L3 10.42V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
        <path d="M12.568 3.606a1 1 0 0 0-1.136 0L4.035 8.704l-3.026.054s.073-.266.168-.41c.08-.124.256-.28.256-.28l8.865-6.11a3 3 0 0 1 3.404 0l8.865 6.11C23 8.5 23 9 23 9l-3.035-.296z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
