import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M2 1a1 1 0 0 0 0 2h1.74a.85.85 0 0 1 .844.917l-.83 9.957v.002A3.796 3.796 0 0 0 7.54 17.99h10.65c1.968 0 3.657-1.587 3.807-3.533v-.005l.54-7.5c.162-2.243-1.56-4.082-3.807-4.082H6.414A2.85 2.85 0 0 0 3.74 1zm3.747 13.043L6.51 4.87h12.22c1.092 0 1.89.86 1.812 1.938L20.529 7H9a1 1 0 1 0 0 2h11.385l-.382 5.303v.002c-.072.913-.901 1.685-1.813 1.685H7.54a1.796 1.796 0 0 1-1.794-1.945zM16.25 18.7a2.05 2.05 0 1 0 0 4.1 2.05 2.05 0 0 0 0-4.1m-.45 2.05a.45.45 0 1 1 .9 0 .45.45 0 0 1-.9 0M6.2 20.75a2.05 2.05 0 1 1 4.1 0 2.05 2.05 0 0 1-4.1 0m2.05-.45a.45.45 0 1 0 0 .9.45.45 0 0 0 0-.9" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
