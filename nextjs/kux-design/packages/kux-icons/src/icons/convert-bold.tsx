import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M8.422 3.614c3.274-1.385 7.205-.752 9.877 1.921l.296.31c2.964 3.254 3.106 8.152.445 11.572a.9.9 0 0 1-1.421-1.106c2.198-2.825 2.003-6.908-.592-9.503h-.001a7.19 7.19 0 0 0-6.683-1.928l1.095 1.26a.9.9 0 0 1-1.36 1.18L8.094 5.033a.9.9 0 0 1 .33-1.419M15.578 20.386c-3.275 1.385-7.205.752-9.877-1.921l-.296-.31C2.44 14.9 2.299 10.004 4.96 6.583A.9.9 0 0 1 6.381 7.69c-2.198 2.825-2.003 6.908.592 9.503h.001a7.19 7.19 0 0 0 6.683 1.928l-1.095-1.26a.9.9 0 0 1 1.36-1.18l1.985 2.287a.9.9 0 0 1-.33 1.419" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
