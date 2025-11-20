import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 3.996V19a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zm14-2a2 2 0 0 1 1.96 1.602l-4.663 4.349a3.25 3.25 0 0 0-4.556-.037l-4.7-4.316A2 2 0 0 1 7 3zm-8.212 7.754L5 7.276V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.3l-3.778 3.523q.028.211.028.427a3.25 3.25 0 1 1-6.462-.496m4.096 1.38a1.25 1.25 0 1 1-1.768-1.768 1.25 1.25 0 0 1 1.768 1.768"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
