import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M8 3a1 1 0 0 0-2 0v3H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2v3a1 1 0 1 0 2 0v-3h2a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H8zm1 13V8H5v8zM17.5 4.5a1 1 0 1 0-2 0V7h-2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2v2.5a1 1 0 1 0 2 0V17h2a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-2zm1 10.5V9h-4v6z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
