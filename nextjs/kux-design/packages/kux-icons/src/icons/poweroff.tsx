import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M5.67 20.377A10.5 10.5 0 0 1 6.591 3a1 1 0 0 1 1.03 1.714 8.5 8.5 0 1 0 8.698-.034 1 1 0 0 1 1.017-1.723 10.5 10.5 0 1 1-11.668 17.42" />
        <path d="M12 1a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
