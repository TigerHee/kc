import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M15 4a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V5.414l-4.793 4.793a1 1 0 0 1-1.414-1.414L18.586 4zm-4.793 9.793a1 1 0 0 1 0 1.414L5.414 20H9a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1v-6a1 1 0 1 1 2 0v3.586l4.793-4.793a1 1 0 0 1 1.414 0"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
