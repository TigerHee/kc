import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M13.435 15.288a.906.906 0 1 1 0 1.812.906.906 0 0 1 0-1.812M13.578 6.15a3.264 3.264 0 0 1 .75 6.442v1.018a.75.75 0 0 1-1.5 0v-1.677a.75.75 0 0 1 .75-.75 1.768 1.768 0 0 0 0-3.533c-.975 0-1.766.79-1.766 1.766a.75.75 0 0 1-1.5 0 3.267 3.267 0 0 1 3.266-3.266" />
        <path
          fillRule="evenodd"
          d="M18.115 2.1a3.6 3.6 0 0 1 3.602 3.6v12.6l-.005.185a3.6 3.6 0 0 1-3.597 3.415H8.86a3.6 3.6 0 0 1-3.595-3.415L5.26 18.3v-1.479H3.11a.75.75 0 0 1 0-1.5h2.15v-2.7H3.11a.75.75 0 0 1 0-1.5h2.15v-2.7H3.11a.75.75 0 0 1 0-1.5h2.15V5.7a3.6 3.6 0 0 1 3.6-3.6zM8.86 3.6a2.1 2.1 0 0 0-2.1 2.1v12.6c0 1.16.94 2.1 2.1 2.1h9.255c1.16 0 2.102-.94 2.102-2.1V5.7c0-1.16-.942-2.1-2.102-2.1z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
