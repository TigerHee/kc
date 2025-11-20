import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M9 4.331a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2l.581 3.252H18c1.657 0 3 1.71 3 3.367v1.981l.992 7.614A1 1 0 0 1 21 21.67H3a1 1 0 0 1-.992-1.124L3 12.931v-1.98c0-1.657 1.343-3.368 3-3.368h2.487zm4.134.983a1.137 1.137 0 0 0-2.255.018l-.392 3.251a1 1 0 0 1-1 1H6c-.552 0-1 .815-1 1.367v1h14v-1c0-.552-.448-1.367-1-1.367H14.58a1 1 0 0 1-1-1zm-8.251 8.68-.75 5.675H15v-2.244a1 1 0 1 1 2 0v2.244h2.867l-.75-5.676z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
