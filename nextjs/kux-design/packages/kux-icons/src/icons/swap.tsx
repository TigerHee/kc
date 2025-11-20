import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M18.707 2.293a1 1 0 1 0-1.414 1.414L18.586 5H9a4 4 0 0 0-4 4v1a1 1 0 1 0 2 0V9a2 2 0 0 1 2-2h9.586l-1.293 1.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414zM6.707 15.707a1 1 0 1 0-1.414-1.414l-3 3a1 1 0 0 0 0 1.414l3 3a1 1 0 0 0 1.414-1.414L5.414 19H15a4 4 0 0 0 4-4v-1a1 1 0 1 0-2 0v1a2 2 0 0 1-2 2H5.414z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
