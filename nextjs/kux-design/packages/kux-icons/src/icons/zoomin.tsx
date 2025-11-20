import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M20.5 8.5a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1v-6a1 1 0 1 1 2 0v3.586l4.793-4.793a1 1 0 1 1 1.414 1.414L16.914 8.5zM2.293 21.707a1 1 0 0 1 0-1.414L7.086 15.5H3.5a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-3.586l-4.793 4.793a1 1 0 0 1-1.414 0"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
