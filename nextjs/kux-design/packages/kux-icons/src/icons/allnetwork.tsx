import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11M6.5 7.6a1.1 1.1 0 0 1 1.1-1.1h2.75a1.1 1.1 0 0 1 1.1 1.1v2.75a1.1 1.1 0 0 1-1.1 1.1H7.6a1.1 1.1 0 0 1-1.1-1.1zm0 6.05a1.1 1.1 0 0 1 1.1-1.1h2.75a1.1 1.1 0 0 1 1.1 1.1v2.75a1.1 1.1 0 0 1-1.1 1.1H7.6a1.1 1.1 0 0 1-1.1-1.1zm6.05-6.05a1.1 1.1 0 0 1 1.1-1.1h2.75a1.1 1.1 0 0 1 1.1 1.1v2.75a1.1 1.1 0 0 1-1.1 1.1h-2.75a1.1 1.1 0 0 1-1.1-1.1zm0 6.05a1.1 1.1 0 0 1 1.1-1.1h2.75a1.1 1.1 0 0 1 1.1 1.1v2.75a1.1 1.1 0 0 1-1.1 1.1h-2.75a1.1 1.1 0 0 1-1.1-1.1z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
