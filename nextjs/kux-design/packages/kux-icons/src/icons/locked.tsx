import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M13 14.5a1 1 0 1 0-2 0v3a1 1 0 1 0 2 0z" />
        <path
          fillRule="evenodd"
          d="M6 7.5a6 6 0 0 1 6-6c3.314 0 6 2.5 6 5.5v2.507l1-.007a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2l1 .024V7.5m13 4v9H5v-9zM8 9.524V7.5a4 4 0 0 1 4-4c2.21 0 4 1.5 4 3.5v2.507z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
