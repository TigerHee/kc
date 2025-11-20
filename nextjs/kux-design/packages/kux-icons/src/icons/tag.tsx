import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M20 5a1 1 0 0 0-1-1h-5.172a1 1 0 0 0-.707.293l-9 9a1 1 0 0 0 0 1.414l5.172 5.172a1 1 0 0 0 1.414 0l9-9a1 1 0 0 0 .293-.707zm2 5.172a3 3 0 0 1-.879 2.121l-9 9a3 3 0 0 1-4.242 0l-5.172-5.172a3 3 0 0 1 0-4.242l9-9A3 3 0 0 1 13.828 2H19a3 3 0 0 1 3 3z" />
        <circle cx={16} cy={7} r={1} />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
