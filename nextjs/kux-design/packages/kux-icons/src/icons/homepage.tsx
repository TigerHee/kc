import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M12.593 1.195a1 1 0 0 0-1.186 0l-9.5 7A1 1 0 0 0 1.5 9v12a1 1 0 0 0 1 1h19a1 1 0 0 0 1-1V9a1 1 0 0 0-.407-.805zM15.5 20h5V9.505L12 3.242 3.5 9.505V20h5v-6.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1zm-5 0h3v-5.5h-3z" />
        <path d="M3.5 21a1 1 0 0 1 1-1h15a1 1 0 1 1 0 2h-15a1 1 0 0 1-1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
