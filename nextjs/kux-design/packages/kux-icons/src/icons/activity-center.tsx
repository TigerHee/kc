import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M16.625 11.28a1 1 0 1 0-1.25-1.56l-4.3 3.44-1.868-1.867a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.332.074z" />
        <path
          fillRule="evenodd"
          d="M11.295 1.292a1 1 0 0 1 1.414 0l2.342 2.343h4.314a1 1 0 0 1 1 1V8.95l2.342 2.342a1 1 0 0 1 0 1.414l-2.342 2.346v4.314a1 1 0 0 1-1 1H15.05l-2.342 2.342a1 1 0 0 1-1.414 0l-2.346-2.342H4.635a1 1 0 0 1-1-1V15.05l-2.343-2.346a1 1 0 0 1 0-1.414L3.636 8.95V4.635a1 1 0 0 1 1-1H8.95zm.706 2.122L10.07 5.343a1 1 0 0 1-.707.292H5.635v3.728a1 1 0 0 1-.293.707L3.414 12l1.929 1.931a1 1 0 0 1 .292.707v3.728h3.728a1 1 0 0 1 .707.292L12 20.587l1.929-1.93a1 1 0 0 1 .707-.292h3.728v-3.728a1 1 0 0 1 .292-.707L20.587 12l-1.93-1.929a1 1 0 0 1-.292-.707V5.635h-3.728a1 1 0 0 1-.707-.293z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
