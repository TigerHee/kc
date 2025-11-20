import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M10.603 1.374a5 5 0 0 1 2.803 0l5.716 1.67A4 4 0 0 1 22 6.884v3.139a14.16 14.16 0 0 1-8.348 12.911 4.03 4.03 0 0 1-3.302 0A14.16 14.16 0 0 1 2 10.021V6.884a4 4 0 0 1 2.88-3.84zm7.104 6.925a1 1 0 0 0-1.414 0L11 13.592 8.207 10.8a1 1 0 1 0-1.414 1.415l3.5 3.5a1 1 0 0 0 1.414 0l6-6a1 1 0 0 0 0-1.415"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
