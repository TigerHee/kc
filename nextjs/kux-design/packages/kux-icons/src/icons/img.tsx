import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M1.5 7a4 4 0 0 1 4-4h13a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-13a4 4 0 0 1-4-4zm4-2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
        <path d="M6.91 10.127a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5M12.24 9.85a1 1 0 0 1 1.367-.144l8.5 6.5-1.215 1.588-7.748-5.925-2.385 2.782a1 1 0 0 1-1.384.13l-1.8-1.441-4.368 4.367-1.414-1.414 5-5a1 1 0 0 1 1.332-.074l1.745 1.396z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
