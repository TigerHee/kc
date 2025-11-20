import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M4.543 18.707a1 1 0 0 1 0-1.414L9.836 12 4.543 6.707a1 1 0 0 1 1.415-1.414l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.415 0" />
        <path d="M12.043 18.707a1 1 0 0 1 0-1.414L17.336 12l-5.293-5.293a1 1 0 0 1 1.415-1.414l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.415 0" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
