import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.808 5.707a1 1 0 0 0 1 1h6.07L4.859 17.728a1 1 0 1 0 1.414 1.414l11.02-11.02v6.07a1 1 0 0 0 2 0V5.704a1 1 0 0 0-.996-.997H9.808a1 1 0 0 0-1 1"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
