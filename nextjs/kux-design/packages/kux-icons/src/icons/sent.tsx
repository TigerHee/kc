import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12.996 16a1 1 0 1 1-2 0V5.418l-2.789 2.79a1 1 0 0 1-1.414-1.415l4.445-4.445A1 1 0 0 1 11.996 2h.002c.257 0 .513.097.71.293l4.5 4.5a1 1 0 0 1-1.415 1.414L12.996 5.41z" />
        <path d="M22 12a1 1 0 1 0-2 0v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5.996a1 1 0 1 0-2 0V18a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
