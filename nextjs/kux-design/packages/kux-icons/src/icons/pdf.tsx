import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M4.833 5.949v4.486h-1.96V5.489a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v4.946h-1.958V6.014h-.002v-.065z" />
        <path d="M7.627 7.089h8v1.96h-8z" />
        <path
          fillRule="evenodd"
          d="M11.833 11.146H9.006V20h2.827c2.189.022 3.146-.935 3.09-3.09v-2.673c.056-2.156-.912-3.124-3.09-3.09m-.87 7.303v-5.752h.496c1.243 0 1.485.275 1.507 1.694v2.364c-.022 1.42-.264 1.694-1.507 1.694zM2.792 20H4.75v-3.629h.781c1.111 0 1.705-.143 2.156-.539.495-.429.715-1.056.715-2.046 0-1-.165-1.55-.605-2.002-.451-.462-1.067-.638-2.266-.638H2.792zm1.925-5.19v-2.113h.825c.693 0 .924.264.924 1.056s-.231 1.056-.924 1.056z"
          clipRule="evenodd"
        />
        <path d="M15.843 11.146h4.994v1.584h-3.036v1.573h2.519v1.584h-2.519V20h-1.958z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
