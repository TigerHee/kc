import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M1.8 4a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2.25a1 1 0 0 1 0-2h1.75a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H4.3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h1.167a1 1 0 1 1 0 2H3.8a2 2 0 0 1-2-2z" />
        <path d="M7.7 20a2 2 0 0 0 2 2h10.5a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-1.75a1 1 0 1 0 0 2h1.25a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-9.5a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h1.667a1 1 0 1 0 0-2H9.7a2 2 0 0 0-2 2z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
