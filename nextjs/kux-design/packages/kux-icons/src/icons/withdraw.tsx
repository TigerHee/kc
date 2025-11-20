import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12.707 1.293a1 1 0 0 0-1.414 0l-4 4a1 1 0 0 0 1.414 1.414L11 4.414V14a1 1 0 1 0 2 0V4.414l2.293 2.293a1 1 0 1 0 1.414-1.414z" />
        <path d="M4.35 7.156a1 1 0 0 1 .43 1.393 8 8 0 1 0 14.41-.056 1 1 0 0 1 1.794-.885h.002A9.96 9.96 0 0 1 22 12c0 5.523-4.477 10-10 10S2 17.523 2 12a9.96 9.96 0 0 1 1.014-4.393l.002.002a1 1 0 0 1 1.333-.453" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
