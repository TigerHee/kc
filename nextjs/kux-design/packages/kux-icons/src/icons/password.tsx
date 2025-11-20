import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M7.5 13.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6m-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0" />
        <path d="M17.253 3.336a1 1 0 0 1 1.398-.095l3.5 3a1 1 0 0 1-1.302 1.518L18.095 5.4l-2.203 2.477 2.759 2.365a1 1 0 1 1-1.302 1.518l-2.786-2.388-3.816 4.293a1 1 0 1 1-1.494-1.328z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
