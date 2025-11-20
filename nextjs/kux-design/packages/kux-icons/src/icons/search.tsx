import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10.5 1a9.5 9.5 0 1 0 5.973 16.888l3.673 3.673a1 1 0 0 0 1.415-1.414l-3.674-3.673A9.46 9.46 0 0 0 20 10.5 9.5 9.5 0 0 0 10.5 1M3 10.5a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
