import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12m8.878-3.536a1 1 0 0 0-1.414 1.414l2.122 2.121-2.122 2.122a1 1 0 1 0 1.414 1.414L12 13.414l2.121 2.121a1 1 0 0 0 1.415-1.414l-2.122-2.122 2.122-2.121a1 1 0 0 0-1.415-1.414L12 10.585z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
