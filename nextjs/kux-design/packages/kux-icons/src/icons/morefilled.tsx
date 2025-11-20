import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1M7.25 11a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5m5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5m5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
