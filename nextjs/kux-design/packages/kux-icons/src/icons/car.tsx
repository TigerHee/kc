import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M7.5 10.5a1 1 0 1 0 0 2h9a1 1 0 1 0 0-2zM17.25 16.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M6.75 16.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5" />
        <path
          fillRule="evenodd"
          d="M10.081 1.5c-.827 0-1.426.625-1.566 1.326L8.18 4.5H7.103a3 3 0 0 0-2.915 2.29l-1.025 3.512A4 4 0 0 0 1 13.855V17.5A2.5 2.5 0 0 0 3.5 20h.042a3 3 0 0 0 5.917 0h5.083a3.001 3.001 0 0 0 5.918 0h.04a2.5 2.5 0 0 0 2.5-2.5v-3.646a4 4 0 0 0-2.155-3.549l-.976-3.487A3 3 0 0 0 16.947 4.5H15.82l-.335-1.674c-.14-.701-.74-1.326-1.566-1.326zm3.7 3-.2-1H10.42l-.2 1zm-6.678 2a1 1 0 0 0-.974.773l-.014.053-1.155 3.955a1 1 0 0 1-.513.614l-.34.17A2 2 0 0 0 3 13.856V17.5a.5.5 0 0 0 .5.5h1a1 1 0 0 1 1 1v.5a1 1 0 0 0 2 0V19a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v.5a1 1 0 0 0 2.002 0V19a1 1 0 0 1 1-1h.998a.5.5 0 0 0 .5-.5v-3.646a2 2 0 0 0-1.105-1.789l-.34-.17a1 1 0 0 1-.516-.625l-1.103-3.936-.013-.052a1 1 0 0 0-.976-.782z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
