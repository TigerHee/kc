import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M15.458 3.542a5 5 0 0 0-4.422 7.337 1 1 0 0 1-.176 1.176l-6.903 6.903 1.085 1.085 6.903-6.902a1 1 0 0 1 1.176-.177 5 5 0 0 0 7.24-5.41l-2.696 2.696a1 1 0 0 1-1.414 0l-2.5-2.5a1 1 0 0 1 0-1.415l2.695-2.695a5 5 0 0 0-.988-.098m-7 5A7 7 0 0 1 18.73 2.354a1 1 0 0 1 .239 1.59l-3.098 3.098 1.086 1.086 3.098-3.098a1 1 0 0 1 1.59.239 7 7 0 0 1-8.78 9.778l-7.116 7.118a1 1 0 0 1-1.415 0l-2.5-2.5a1 1 0 0 1 0-1.415l7.118-7.117a7 7 0 0 1-.495-2.59"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
