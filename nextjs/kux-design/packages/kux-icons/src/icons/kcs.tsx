import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M12 21.32a9.32 9.32 0 1 0 0-18.64 9.32 9.32 0 0 0 0 18.64M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11" />
        <path d="M13.225 15.082 10.125 12l3.1-3.14 1.967 1.977c.299.349.835.349 1.193 0a.897.897 0 0 0 0-1.28L13.82 7a.88.88 0 0 0-1.252 0L8.872 10.72V8.51c0-.466-.417-.873-.894-.873s-.894.407-.894.873v6.978c0 .466.417.873.894.873s.894-.407.894-.873v-2.21l3.697 3.722a.88.88 0 0 0 1.252 0l2.564-2.559a.897.897 0 0 0 0-1.279c-.298-.349-.835-.349-1.193 0zM14.119 12c0-.465-.417-.872-.894-.872s-.894.407-.894.872.417.872.894.872.894-.407.894-.872" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
