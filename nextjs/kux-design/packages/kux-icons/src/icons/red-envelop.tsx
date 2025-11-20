import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.5 2.6a2.9 2.9 0 0 0-2.9 2.9v13a2.9 2.9 0 0 0 2.9 2.9h11a2.9 2.9 0 0 0 2.9-2.9v-13a2.9 2.9 0 0 0-2.9-2.9zM5.4 5.682V18.5a1.1 1.1 0 0 0 1.1 1.1h11a1.1 1.1 0 0 0 1.1-1.1V5.682l-6.1 4.067a.9.9 0 0 1-1 0zM17.278 4.4H6.722L12 7.918z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
