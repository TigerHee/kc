import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M14.393 2.98a.8.8 0 0 1 1.214 1.04l-2.106 2.458h5.582c1.224 0 2.217.993 2.217 2.217v.944c0 .75-.374 1.412-.945 1.813V17.5a3.8 3.8 0 0 1-3.8 3.8h-9.11a3.8 3.8 0 0 1-3.8-3.8v-6.048A2.21 2.21 0 0 1 2.7 9.639v-.944c0-1.224.993-2.217 2.217-2.217h5.582L8.393 4.02a.8.8 0 0 1 1.214-1.04L12 5.77zM12.8 19.7h3.756a2.2 2.2 0 0 0 2.2-2.2v-5.644H12.8zm-7.556-2.2a2.2 2.2 0 0 0 2.2 2.2H11.2v-7.844H5.244zm-.327-9.422a.62.62 0 0 0-.617.617v.944c0 .34.277.617.617.617h14.166c.34 0 .617-.276.617-.617v-.944a.62.62 0 0 0-.617-.617z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
