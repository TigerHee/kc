import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M11 2a1 1 0 0 1 .93.633l2.103 5.333 5.334 2.103a1 1 0 0 1 0 1.862l-5.334 2.102-2.102 5.334a1 1 0 0 1-1.862 0l-2.103-5.334-5.333-2.102a1 1 0 0 1 0-1.862l5.333-2.103 2.103-5.333.067-.137A1 1 0 0 1 11 2M9.668 9.104a1 1 0 0 1-.564.564L5.727 11l3.377 1.332.094.043a1 1 0 0 1 .47.52L11 16.273l1.332-3.377c.102-.258.306-.462.563-.564L16.273 11l-3.377-1.332a1 1 0 0 1-.564-.564L11 5.727zM18.26 14.607a.257.257 0 0 1 .48 0l.992 2.516a.26.26 0 0 0 .145.145l2.517.993a.257.257 0 0 1 0 .478l-2.517.993a.26.26 0 0 0-.145.145l-.993 2.517a.257.257 0 0 1-.478 0l-.993-2.517a.26.26 0 0 0-.145-.145l-2.517-.993a.257.257 0 0 1 0-.478l2.517-.993a.26.26 0 0 0 .145-.145z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
