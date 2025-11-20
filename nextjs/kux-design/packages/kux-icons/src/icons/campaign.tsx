import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M20.433 2.298a2 2 0 0 0-.913.011l-.005.001L8.875 5H7a5 5 0 0 0-3.497 8.574l1.336 6.818.001.008A2 2 0 0 0 6.828 22H8a2 2 0 0 0 2-2v-4.72l9.517 2.38h.003A2 2 0 0 0 22 15.72V4.292a2 2 0 0 0-1.567-1.994M20 15.719l-10-2.5V6.78L20 4.25V15.72M7 15h1v5H6.8l-1.008-5.148Q6.382 15 7 15m0-2a3 3 0 1 1 0-6h1v6z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
