import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M4.5 4a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5zM2 4.5A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 15.5z" />
        <path d="M12 16a1 1 0 0 1 1 1v3h4a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h4v-3a1 1 0 0 1 1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
