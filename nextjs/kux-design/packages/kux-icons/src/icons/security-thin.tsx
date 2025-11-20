import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M19.25 7.614a1.25 1.25 0 0 0-.777-1.156l-5-2.046a3.9 3.9 0 0 0-2.946 0l-5 2.046a1.25 1.25 0 0 0-.777 1.156v3.568c0 4.127 3.08 8.025 7.25 9.045 4.17-1.02 7.25-4.918 7.25-9.045zm1.5 3.568c0 4.9-3.665 9.444-8.585 10.55a.75.75 0 0 1-.33 0c-4.92-1.106-8.585-5.65-8.585-10.55V7.614a2.75 2.75 0 0 1 1.52-2.458l.19-.087 4.999-2.045a5.39 5.39 0 0 1 4.082 0l5 2.046a2.75 2.75 0 0 1 1.709 2.544z" />
        <path d="M14.72 9.594a.751.751 0 0 1 1.06 1.062l-3.75 3.75a.75.75 0 0 1-1.06 0l-2.25-2.25-.097-.119a.751.751 0 0 1 1.04-1.039l.118.096 1.719 1.72z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
