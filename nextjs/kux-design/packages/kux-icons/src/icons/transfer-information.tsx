import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7h4v.95L7.95 14H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2h4v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v2h-4v-2q0-.104-.02-.202l4.818-4.818q.099.02.202.02h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v2h-4V3a1 1 0 0 0-1-1zm1 14h4v4H4zm16 4h-4v-4h4zM4 4h4v4H4zm12 0h4v4h-4z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
