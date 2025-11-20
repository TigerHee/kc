import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M1.95 6A4.05 4.05 0 0 1 6 1.95h12A4.05 4.05 0 0 1 22.05 6v3a1.05 1.05 0 1 1-2.1 0V6A1.95 1.95 0 0 0 18 4.05H6A1.95 1.95 0 0 0 4.05 6v12A1.95 1.95 0 0 0 6 19.95h3a1.05 1.05 0 1 1 0 2.1H6A4.05 4.05 0 0 1 1.95 18z"
          clipRule="evenodd"
        />
        <path d="M11.258 11.256a1.05 1.05 0 1 1 1.484 1.485l-.456.457h5.433c2.419 0 4.331 2.01 4.331 4.425s-1.912 4.425-4.331 4.425H15a1.05 1.05 0 1 1 0-2.1h2.719c1.203 0 2.231-1.014 2.231-2.325s-1.027-2.325-2.231-2.325h-5.435l.458.458a1.05 1.05 0 0 1-1.485 1.485l-2.25-2.25a1.05 1.05 0 0 1 0-1.485z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
