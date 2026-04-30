import React from 'react';
import type { IconProps } from '../types';

export function Bulletlist2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <rect x="10" y="11" width="12" height="2" fill={color}/>
      <rect x="10" y="7" width="12" height="2" fill={color}/>
      <rect x="10" y="15" width="12" height="2" fill={color}/>
      <path d="M6 15H4V13H6V15ZM4 13H2V11H4V13ZM8 13H6V11H8V13ZM6 11H4V9H6V11Z" fill={color}/>
      <path d="M6 11H4V9H6V11ZM4 9H2V7H4V9ZM8 9H6V7H8V9ZM6 7H4V5H6V7Z" fill={color}/>
      <rect x="4" y="13" width="2" height="2" fill={color}/>
      <rect x="4" y="17" width="2" height="2" fill={color}/>
      <rect x="2" y="17" width="2" height="2" transform="rotate(-90 2 17)" fill={color}/>
      <rect x="6" y="17" width="2" height="2" transform="rotate(-90 6 17)" fill={color}/>
    </svg>
  );
}
