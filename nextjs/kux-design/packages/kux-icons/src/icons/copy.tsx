import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M18.094 1.5a1 1 0 0 1 0 2H3.906a.406.406 0 0 0-.406.406v14.188a1 1 0 0 1-2 0V3.906A2.406 2.406 0 0 1 3.906 1.5z" />
        <path
          fillRule="evenodd"
          d="M7.906 5.5A2.406 2.406 0 0 0 5.5 7.906v12.188A2.406 2.406 0 0 0 7.906 22.5h12.188a2.406 2.406 0 0 0 2.406-2.406V7.906A2.406 2.406 0 0 0 20.094 5.5zM7.5 7.906c0-.224.182-.406.406-.406h12.188c.224 0 .406.182.406.406v12.188a.406.406 0 0 1-.406.406H7.906a.406.406 0 0 1-.406-.406z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
