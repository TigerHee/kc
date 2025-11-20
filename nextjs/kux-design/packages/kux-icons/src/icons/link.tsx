import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M11.23 3.904a5.181 5.181 0 0 0-7.326 7.326l2.216 2.216a1 1 0 0 0 1.414-1.414L5.318 9.816a3.181 3.181 0 0 1 4.498-4.498l2.216 2.216a1 1 0 1 0 1.414-1.414z" />
        <path d="M8.339 8.338a1 1 0 0 0 0 1.415l5.909 5.909a1 1 0 1 0 1.414-1.415l-5.91-5.909a1 1 0 0 0-1.413 0" />
        <path d="M16.466 10.554a1 1 0 0 0 0 1.414l2.216 2.216a3.181 3.181 0 0 1-4.498 4.498l-2.216-2.216a1 1 0 1 0-1.414 1.414l2.216 2.216a5.18 5.18 0 0 0 7.326 0l-.707-.707.707.707a5.18 5.18 0 0 0 0-7.326l-2.216-2.216a1 1 0 0 0-1.414 0" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
