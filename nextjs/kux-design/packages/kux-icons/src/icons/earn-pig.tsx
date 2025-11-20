import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M8.507 4.799a4.352 4.352 0 0 1 7.816.325.9.9 0 1 0 1.65-.721A6.152 6.152 0 0 0 6.923 3.94a.9.9 0 0 0 1.583.858M8.587 13.838a1.312 1.312 0 1 1-2.624 0 1.312 1.312 0 0 1 2.624 0" />
        <path
          fillRule="evenodd"
          d="M3.117 6.77a.9.9 0 0 1 .746-.395h9.974a8.25 8.25 0 0 1 8.202 7.35h.945a.9.9 0 0 1 0 1.8h-.938a9.8 9.8 0 0 1-.993 3.48l-1.686 3.373a.9.9 0 0 1-.805.497h-2.625a.9.9 0 0 1-.9-.9V21.3h-6.6v.675a.9.9 0 0 1-.9.9H4.914a.9.9 0 0 1-.854-.615l-1.457-4.372-1.767-.883a.9.9 0 0 1-.497-.805v-3.675a.9.9 0 0 1 .9-.9h1.59L3.91 9.82l-.884-2.21a.9.9 0 0 1 .09-.84m3.52 14.305V20.4a.9.9 0 0 1 .9-.9h8.4a.9.9 0 0 1 .9.9v.675h1.17l1.436-2.874a8 8 0 0 0 .845-3.576 6.45 6.45 0 0 0-6.45-6.45H5.192l.556 1.39a.9.9 0 0 1-.064.798L4.11 12.988a.9.9 0 0 1-.771.437h-1.2v2.219l1.602.801a.9.9 0 0 1 .451.52l1.37 4.11z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
