import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M2 5a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v15.978c0 1.656-1.898 2.595-3.214 1.59l-2.805-2.143-2.817 2.017a2 2 0 0 1-2.328 0l-2.817-2.017-2.805 2.143C3.898 23.573 2 22.634 2 20.978zm4-2a2 2 0 0 0-2 2v15.978l2.805-2.142a2 2 0 0 1 2.378-.037L12 20.816l2.817-2.017a2 2 0 0 1 2.378.037L20 20.978V5a2 2 0 0 0-2-2z"
          clipRule="evenodd"
        />
        <path d="M7.75 8.3c0-.553.366-1 .818-1h6.864c.452 0 .818.447.818 1s-.366 1-.818 1H8.568c-.452 0-.818-.448-.818-1M8.568 11.5c-.452 0-.818.448-.818 1s.366 1 .818 1h6.864c.452 0 .818-.448.818-1s-.366-1-.818-1z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
