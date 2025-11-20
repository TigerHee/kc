import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M14.879 2.707a3 3 0 0 1 4.242 0l2.172 2.172a3 3 0 0 1 0 4.242L9.12 21.293a3 3 0 0 1-4.242 0L2.707 19.12a3 3 0 0 1 0-4.242zM14.5 5.914 13.414 7l2.293 2.293a1 1 0 0 1-1.414 1.414L12 8.414 10.914 9.5l1.293 1.293a1 1 0 0 1-1.414 1.414L9.5 10.914 8.414 12l2.293 2.293a1 1 0 0 1-1.414 1.414L7 13.414 5.914 14.5l1.293 1.293a1 1 0 1 1-1.414 1.414L4.5 15.914l-.379.379a1 1 0 0 0 0 1.414l2.172 2.172a1 1 0 0 0 1.414 0L19.88 7.707a1 1 0 0 0 0-1.414L17.707 4.12a1 1 0 0 0-1.414 0l-.379.379 1.293 1.293a1 1 0 0 1-1.414 1.414z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
