import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.32 6a5 5 0 0 1 5-5h9.37a5 5 0 0 1 5 5v14.533c0 1.875-1.986 3.082-3.65 2.22l-5.115-2.65a2 2 0 0 0-1.84 0l-5.115 2.65c-1.664.862-3.65-.345-3.65-2.22zm5-3a3 3 0 0 0-3 3v14.533a.5.5 0 0 0 .73.444l5.115-2.65a4 4 0 0 1 3.68 0l5.115 2.65a.5.5 0 0 0 .73-.444V6a3 3 0 0 0-3-3z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
