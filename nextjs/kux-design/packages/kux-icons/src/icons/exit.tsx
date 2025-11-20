import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M8 12.996a1 1 0 1 1 0-2h10.582l-2.79-2.789a1 1 0 0 1 1.415-1.414l4.445 4.445a1 1 0 0 1 .348.758v.002a1 1 0 0 1-.293.71l-4.5 4.5a1 1 0 0 1-1.414-1.415l2.797-2.797z" />
        <path d="M12 22a1 1 0 1 0 0-2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.996a1 1 0 1 0 0-2H6a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
