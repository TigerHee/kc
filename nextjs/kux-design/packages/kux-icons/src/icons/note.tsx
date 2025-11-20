import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10.567 3.494a4.99 4.99 0 0 1 3.77-.486l5.186 1.39a5 5 0 0 1 3.535 6.123l-1.874 6.996a5 5 0 0 1-6.124 3.536l-1.845-.495-4.224 1.132a5 5 0 0 1-6.124-3.535L.992 11.159a5 5 0 0 1 3.536-6.124l5.185-1.39q.427-.114.854-.151M8.363 6.078l-3.318.889a3 3 0 0 0-2.12 3.674l1.874 6.996a3 3 0 0 0 3.674 2.122l.926-.248a5 5 0 0 1-3.06-5.971l1.875-6.997q.064-.238.15-.465M13.82 4.94a3 3 0 0 0-2.403.377c-.605.39-1.07.995-1.271 1.744l-1.875 6.996a3 3 0 0 0 2.122 3.675l5.185 1.389A3 3 0 0 0 19.252 17l1.874-6.997a3 3 0 0 0-2.12-3.674z"
          clipRule="evenodd"
        />
        <path d="M13.124 8.415a1 1 0 1 0-.518 1.932l5.004 1.34a1 1 0 1 0 .518-1.931zM12.017 12.493a1 1 0 0 0-.492 1.938l3.176.806a1 1 0 0 0 .492-1.939z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
