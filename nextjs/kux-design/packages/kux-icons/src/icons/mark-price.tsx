import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M14.969 17H17V7h-2.031l-2.961 5.584L9.032 7H7v10h2.031v-6.14l2.284 4.075h1.386l2.268-4.075z" />
        <path
          fillRule="evenodd"
          d="M2 7a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5zm5-2.833h10A2.833 2.833 0 0 1 19.833 7v10A2.833 2.833 0 0 1 17 19.833H7A2.833 2.833 0 0 1 4.167 17V7A2.833 2.833 0 0 1 7 4.167"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
