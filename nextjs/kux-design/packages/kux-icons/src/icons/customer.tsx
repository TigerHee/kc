import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M12 1a5 5 0 1 0 0 10 5 5 0 0 0 0-10M9 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0M12 12C6.477 12 2 16.477 2 22a1 1 0 1 0 2 0 8 8 0 0 1 6.609-7.88l-1.565 5.086a1 1 0 0 0 .175.919l2 2.5a1 1 0 0 0 1.562 0l2-2.5a1 1 0 0 0 .175-.92l-1.565-5.084A8 8 0 0 1 20 22a1 1 0 1 0 2 0c0-5.522-4.476-9.999-9.997-10zm0 8.4-.889-1.112L12 16.4l.889 2.888z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
