import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="m9.622 16.871-3.568 5.832-.038.045a.2.2 0 0 1-.288-.023l-.03-.051-1.225-3-3.148.051-.056-.007a.2.2 0 0 1-.118-.296l4.103-6.811zm-5.672 1.14 1.638-.026.558 1.367 1.356-2.216-1.906-1.86zM14.385 16.871l3.568 5.832.038.045a.2.2 0 0 0 .288-.023l.03-.051 1.225-3 3.148.051.056-.007a.2.2 0 0 0 .118-.296l-4.103-6.811zm5.672 1.14-1.638-.026-.558 1.367-1.356-2.216 1.906-1.86z" />
        <path d="M18.83 9.5A6.83 6.83 0 1 0 12 16.33V18a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17v-1.67a6.83 6.83 0 0 0 6.83-6.83" />
        <path d="M11.866 6.169a.15.15 0 0 1 .268 0l1 2.004 2.181.354a.15.15 0 0 1 .083.253l-1.562 1.6.344 2.227a.15.15 0 0 1-.218.156L12 11.743l-1.962 1.02a.15.15 0 0 1-.218-.155l.344-2.229L8.602 8.78a.15.15 0 0 1 .083-.253l2.18-.354z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
