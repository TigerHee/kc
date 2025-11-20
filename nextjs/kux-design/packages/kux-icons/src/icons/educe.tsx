import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M2.586 3.586a2 2 0 1 1 2.828 2.828 2 2 0 0 1-2.828-2.828M2.586 17.586a2 2 0 1 1 2.828 2.828 2 2 0 0 1-2.828-2.828M2.586 10.586a2 2 0 1 1 2.828 2.828 2 2 0 0 1-2.828-2.828M10 4a1 1 0 0 0 0 2h12a1 1 0 1 0 0-2zM10 11a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2zM10 18a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
