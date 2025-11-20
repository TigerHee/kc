import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M10.207 3.671c.73-1.489 2.85-1.494 3.588-.009l1.961 3.953 4.389.64c1.637.238 2.293 2.25 1.11 3.408l-3.201 3.136.75 4.302c.286 1.64-1.441 2.892-2.911 2.108l-3.895-2.076-3.892 2.075c-1.471.784-3.2-.47-2.91-2.112l.755-4.298-3.205-3.133c-1.185-1.158-.528-3.172 1.111-3.41l4.418-.64zm3.758 4.833-1.962-3.953-1.932 3.944a2 2 0 0 1-1.509 1.1l-4.418.64 3.205 3.133a2 2 0 0 1 .572 1.777l-.756 4.298 3.892-2.075a2 2 0 0 1 1.882 0l3.895 2.076-.75-4.301a2 2 0 0 1 .57-1.773l3.202-3.136-4.388-.64a2 2 0 0 1-1.503-1.09"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
