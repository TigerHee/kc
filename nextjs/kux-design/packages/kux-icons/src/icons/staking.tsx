import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M15.304 2.583a.933.933 0 0 1 1.264-.379c3.917 2.11 6.637 6.161 6.868 10.87a.933.933 0 0 1-1.865.09 11.21 11.21 0 0 0-5.888-9.316.933.933 0 0 1-.38-1.265"
          clipRule="evenodd"
        />
        <circle cx={12.586} cy={2.013} r={1.013} />
        <circle cx={8.723} cy={2.013} r={1.013} />
        <path
          fillRule="evenodd"
          d="M10.34 21.522a7.473 7.473 0 1 0 0-14.947 7.473 7.473 0 0 0 0 14.947m0 1.867a9.34 9.34 0 1 0 0-18.68 9.34 9.34 0 0 0 0 18.68"
          clipRule="evenodd"
        />
        <path d="m8.242 14.05 2.098-2.099 2.098 2.098-2.098 2.098z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
