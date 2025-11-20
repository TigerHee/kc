import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10.235 1a3.727 3.727 0 0 0-1.924 6.92l-1.227 5.582H4.197a1.7 1.7 0 0 0-1.7 1.7v3.047a1.7 1.7 0 0 0 1.7 1.7H19.79a1.7 1.7 0 0 0 1.7-1.7v-3.047a1.7 1.7 0 0 0-1.7-1.7h-2.864l-1.228-5.587A3.727 3.727 0 0 0 13.765 1zm3.53 2h-3.53a1.727 1.727 0 0 0 0 3.455h3.53a1.727 1.727 0 1 0 0-3.455M9.132 13.502h5.745l-1.11-5.047h-3.526zm-4.635 2v2.447H19.49v-2.447z"
          clipRule="evenodd"
        />
        <path d="M3.73 20.977a.8.8 0 0 0-.8.8v.4a.8.8 0 0 0 .8.8h16.455a.8.8 0 0 0 .8-.8v-.4a.8.8 0 0 0-.8-.8z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
