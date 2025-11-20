import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M11.25 3.812A5.125 5.125 0 0 0 4 11.06l2.188 2.187a1 1 0 1 0 1.414-1.414L5.415 9.646a3.125 3.125 0 0 1 4.42-4.42l2.187 2.187A1 1 0 1 0 13.436 6zM19.738 4.073a1 1 0 0 0-1.414 0L4.262 18.135a1 1 0 1 0 1.414 1.414L19.738 5.487a1 1 0 0 0 0-1.414M16.398 10.375a1 1 0 0 0 0 1.414l2.187 2.187a3.125 3.125 0 1 1-4.42 4.42l-2.187-2.187a1 1 0 0 0-1.414 1.414l2.187 2.187a5.125 5.125 0 1 0 7.248-7.248l-2.187-2.187a1 1 0 0 0-1.414 0" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
