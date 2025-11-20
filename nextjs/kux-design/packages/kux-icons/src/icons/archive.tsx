import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M2.32 6a5 5 0 0 1 5-5h9.37a5 5 0 0 1 5 5v14.533c0 1.875-1.986 3.082-3.65 2.22l-5.115-2.65a2 2 0 0 0-1.84 0l-5.115 2.65c-1.664.862-3.65-.345-3.65-2.22zm5-3a3 3 0 0 0-3 3v14.533a.5.5 0 0 0 .73.444l5.115-2.65a4 4 0 0 1 3.68 0l5.115 2.65a.5.5 0 0 0 .73-.444V6a3 3 0 0 0-3-3z" />
        <path d="M16.207 7.793a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2.5-2.5a1 1 0 1 1 1.414-1.414l1.793 1.793 3.293-3.293a1 1 0 0 1 1.414 0" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
