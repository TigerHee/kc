import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M22.026 7.475c.25.554-.065 1.18-.64 1.374-.577.193-1.194-.12-1.458-.668a8.8 8.8 0 1 0-10.77 12.148c.576.196.962.771.839 1.366s-.708.983-1.287.801a11 11 0 1 1 13.316-15.02" />
        <path
          fillRule="evenodd"
          d="M11.987 8.954a2.455 2.455 0 0 0-2.455 2.454V12.5a2.455 2.455 0 0 0 4.91 0v-1.09a2.454 2.454 0 0 0-2.455-2.455m0 1.636c.452 0 .818.367.818.819v1.09a.818.818 0 0 1-1.636 0v-1.09c0-.452.366-.819.818-.819M19.441 15.454a2.454 2.454 0 0 0-2.454 2.454V19a2.455 2.455 0 1 0 4.909 0v-1.09a2.455 2.455 0 0 0-2.455-2.455m0 1.636c.452 0 .818.367.818.819v1.09a.818.818 0 1 1-1.636 0v-1.09c0-.452.366-.819.818-.819"
          clipRule="evenodd"
        />
        <path d="M19.572 10.143a1 1 0 0 1 .225 1.396l-6.5 9a1 1 0 0 1-1.621-1.17l6.5-9a1 1 0 0 1 1.396-.226" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
