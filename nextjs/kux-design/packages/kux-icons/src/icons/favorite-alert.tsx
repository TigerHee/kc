import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M11.6 1.589q.622 0 1.218.092v2.031A6 6 0 0 0 5.6 9.588v8.056h12v-4.541h2v4.541h1.968a1 1 0 1 1 0 2h-6.503l-2.05.001H1.587a1 1 0 1 1 0-2h2.014V9.588a8 8 0 0 1 8-8" />
        <path
          fillRule="evenodd"
          d="M18.098 1.355a.9.9 0 0 1 .809.5l1.159 2.335 2.585.377a.9.9 0 0 1 .5 1.533L21.27 7.942l.446 2.556a.9.9 0 0 1-1.31.95l-2.305-1.23-2.305 1.23a.9.9 0 0 1-1.31-.95l.449-2.556-1.884-1.841a.9.9 0 0 1 .5-1.534l2.6-.377 1.141-2.331a.9.9 0 0 1 .806-.504m.008 2.935-.548 1.118a.9.9 0 0 1-.68.495l-1.266.184.92.9a.9.9 0 0 1 .258.8l-.212 1.203 1.099-.586a.9.9 0 0 1 .847 0l1.102.588-.21-1.207a.9.9 0 0 1 .256-.797l.921-.902-1.254-.183a.9.9 0 0 1-.676-.49zM7.992 19.617a3.6 3.6 0 0 0 7.17 0h-2.018a1.6 1.6 0 0 1-3.133 0z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
