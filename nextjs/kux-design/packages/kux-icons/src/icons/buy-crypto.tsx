import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="m15.536 10.585-2.122-2.121a2 2 0 0 0-2.828 0l-2.122 2.121a2 2 0 0 0 0 2.829l2.122 2.12a2 2 0 0 0 2.828 0l2.122-2.12a2 2 0 0 0 0-2.829M12 9.878 14.121 12 12 14.121l-2.121-2.122z" />
        <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
