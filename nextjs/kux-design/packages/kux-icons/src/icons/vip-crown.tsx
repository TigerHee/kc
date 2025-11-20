import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M12.07.395a2.575 2.575 0 0 0-1.53 4.648l-2.949 5.086-2.595-1.413A2.5 2.5 0 0 0 5.26 7.59a2.529 2.529 0 1 0-3.023 2.48l1.791 7.571.003.009a1.29 1.29 0 0 0 1.248.97h13.529a1.29 1.29 0 0 0 1.248-.97l.002-.007 1.816-7.598a2.528 2.528 0 1 0-2.848-1.287l-2.53 1.372-2.934-5.06A2.575 2.575 0 0 0 12.071.395m-.25 1.97a.656.656 0 1 1 .502 1.212.656.656 0 0 1-.502-1.212m9.216 4.663a.608.608 0 1 1 .466 1.124.608.608 0 0 1-.466-1.124M2.3 7.16a.609.609 0 1 1 .861.861.609.609 0 0 1-.86-.86m9.743-.93L9.02 11.445a1.46 1.46 0 0 1-1.964.55l-2.771-1.509 1.475 6.239h12.57l1.491-6.24-2.79 1.513a1.46 1.46 0 0 1-1.963-.552z"
          clipRule="evenodd"
        />
        <path d="M4.516 21.294c0-.53.43-.96.96-.96h13.068a.96.96 0 1 1 0 1.92H5.476a.96.96 0 0 1-.96-.96" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
