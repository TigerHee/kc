import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.75 4a2 2 0 0 1 2-2h4.5a2 2 0 0 1 2 2v8h4.5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3.25a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h4.5zm0 6h-4.5v10h4.5zm2 10h4.5V4h-4.5zm6.5 0h4.5v-6h-4.5z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
