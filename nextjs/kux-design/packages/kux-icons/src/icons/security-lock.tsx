import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M12 9a6 6 0 1 0 0 12 6 6 0 0 0 0-12m-8 6a8 8 0 1 1 16 0 8 8 0 0 1-16 0" />
        <path d="M10.278 1.343A4.5 4.5 0 0 1 16.5 5.5V9h-2V5.5a2.5 2.5 0 0 0-5 0V9h-2V5.5a4.5 4.5 0 0 1 2.778-4.157M12 12a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
