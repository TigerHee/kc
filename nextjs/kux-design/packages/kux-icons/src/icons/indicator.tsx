import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M3 15.5a1 1 0 1 0 0 2h1.145a3.502 3.502 0 0 0 6.713-.01q.07.01.142.01h10a1 1 0 1 0 0-2H11q-.072 0-.142.01a3.501 3.501 0 0 0-6.713-.01zM7.5 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M17.355 9H21a1 1 0 1 0 0-2h-3.645a3.502 3.502 0 0 0-6.71 0H3a1 1 0 1 0 0 2h7.645a3.502 3.502 0 0 0 6.71 0M14 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
