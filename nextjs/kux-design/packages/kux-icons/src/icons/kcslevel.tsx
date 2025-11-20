import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M8.487 2.594h2.064l-.897 3.394a1 1 0 0 1-1.94-.488zM16.817 13.869a4.8 4.8 0 1 1-9.601-.001 4.8 4.8 0 0 1 9.6.001m-2 0a2.8 2.8 0 1 1-5.601-.001 2.8 2.8 0 0 1 5.6.001" />
        <path d="M3.6 9.259q.012.047.029.092a9.5 9.5 0 0 0-1.139 4.518c0 5.26 4.265 9.523 9.526 9.523 5.26 0 9.525-4.264 9.525-9.523 0-1.665-.427-3.23-1.178-4.59l.004-.015 1.471-5.374A2.6 2.6 0 0 0 19.332.603H4.67a2.6 2.6 0 0 0-2.512 3.273zm1.07-6.656a.6.6 0 0 0-.58.756l1.05 3.92a9.5 9.5 0 0 1 6.876-2.933 9.5 9.5 0 0 1 6.833 2.889l1.06-3.873a.6.6 0 0 0-.578-.759zm7.346 18.789a7.524 7.524 0 1 0 0-15.046 7.524 7.524 0 1 0 0 15.046" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
