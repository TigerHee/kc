import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.808 18.293a1 1 0 0 1 1-1h6.07L4.859 6.272a1 1 0 0 1 1.414-1.414l11.02 11.02v-6.07a1 1 0 0 1 2 0v8.488a.997.997 0 0 1-.996.997H9.808a1 1 0 0 1-1-1"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
