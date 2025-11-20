import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" clipPath="url(#a)">
        <path d="M17.968 21.053q-.972.273-1.683.273-2.492 0-3.335-3.44h-.065Q10.815 21.6 7.157 21.6q-2.72 0-4.338-1.918-1.62-1.916-1.619-4.84 0-3.378 1.846-5.51Q4.89 7.2 8.06 7.2a5.4 5.4 0 0 1 3.027.883q1.344.882 2.023 2.497h.065l.972-3.107h3.529l-2.946 6.911q.517 2.436 1.036 3.303.518.867 1.424.868.453 0 .809-.152zm-5.86-6.79q-.453-2.221-1.39-3.394-.94-1.172-2.267-1.173-1.716 0-2.704 1.401-.986 1.4-.986 3.562 0 1.949.858 3.197t2.346 1.247q1.23 0 2.25-1.095t1.732-3.227z" />
        <path
          fillRule="evenodd"
          d="M15.6 4.2a4.2 4.2 0 0 1 4.2 4.2A4.2 4.2 0 0 1 24 4.2 4.2 4.2 0 0 1 19.8 0a4.2 4.2 0 0 1-4.2 4.2"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="currentColor" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
