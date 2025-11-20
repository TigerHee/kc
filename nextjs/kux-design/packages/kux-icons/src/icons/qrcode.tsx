import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M15 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2zm5 0h-3v3h3zM15 17a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2zm5 0h-3v3h3zM4 15a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2zm0 2h3v3H4zM2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm5 0H4v3h3z"
          clipRule="evenodd"
        />
        <path d="M4 11a1 1 0 1 0 0 2h7v2.5a1 1 0 1 0 2 0V13h2a1 1 0 1 0 0-2h-2V8.5a1 1 0 1 0-2 0V11zM18 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1M13 18.5a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0zM13 4a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
