import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M8.467 7.265a1 1 0 0 1 1.084-.909l3.728.326c1.331.117 1.857 1.785.833 2.643l-5.97 5.01a1 1 0 0 1-1.285-1.532l5.045-4.234-2.526-.22a1 1 0 0 1-.909-1.084M10.721 17.18c-1.331-.117-1.857-1.785-.833-2.644l5.97-5.009a1 1 0 1 1 1.285 1.532l-5.045 4.234 2.526.22a1 1 0 0 1-.174 1.993z" />
        <path
          fillRule="evenodd"
          d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12m11-9a9 9 0 1 0 0 18 9 9 0 0 0 0-18"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
