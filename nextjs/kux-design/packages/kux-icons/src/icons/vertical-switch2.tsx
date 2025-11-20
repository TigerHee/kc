import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M2.293 5.293a1 1 0 0 0 1.414 1.414L5 5.414V15a4 4 0 0 0 4 4h1a1 1 0 1 0 0-2H9a2 2 0 0 1-2-2V5.414l1.293 1.293a1 1 0 1 0 1.414-1.414l-3-3a1 1 0 0 0-1.414 0zM15.707 17.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L19 18.586V9a4 4 0 0 0-4-4h-1a1 1 0 1 0 0 2h1a2 2 0 0 1 2 2v9.586z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
