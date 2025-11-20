import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12 14.5a1 1 0 0 1 1 1v.5a1 1 0 1 1-2 0v-.5a1 1 0 0 1 1-1M13 7.5a1 1 0 1 0-2 0l.004 5a1 1 0 1 0 2-.001z" />
        <path
          fillRule="evenodd"
          d="M10.603 1.367a5 5 0 0 1 2.803 0l5.716 1.67A4 4 0 0 1 22 6.877v3.14a14.16 14.16 0 0 1-8.347 12.91 4.03 4.03 0 0 1-3.303.001A14.16 14.16 0 0 1 2 10.014V6.877a4 4 0 0 1 2.88-3.84zm2.242 1.92a3 3 0 0 0-1.682 0L5.44 4.957A2 2 0 0 0 4 6.878v3.137c0 4.821 2.842 9.144 7.17 11.09a2.03 2.03 0 0 0 1.663 0A12.16 12.16 0 0 0 20 10.017v-3.14a2 2 0 0 0-1.44-1.92z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
