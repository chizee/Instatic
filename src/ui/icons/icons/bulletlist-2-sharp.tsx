import React from 'react';
import type { IconProps } from '../types';

export function Bulletlist2SharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="9" width="2" height="2" fill={color}/>
      <rect x="4" y="13" width="2" height="2" fill={color}/>
      <rect x="2" y="13" width="2" height="2" transform="rotate(-90 2 13)" fill={color}/>
      <rect x="6" y="13" width="2" height="2" transform="rotate(-90 6 13)" fill={color}/>
      <rect x="2" y="5" width="6" height="2" fill={color}/>
      <rect x="2" y="9" width="6" height="2" fill={color}/>
      <rect x="2" y="9" width="2" height="2" transform="rotate(-90 2 9)" fill={color}/>
      <rect x="6" y="9" width="2" height="2" transform="rotate(-90 6 9)" fill={color}/>
      <rect x="2" y="13" width="6" height="2" fill={color}/>
      <rect x="2" y="17" width="6" height="2" fill={color}/>
      <rect x="2" y="17" width="2" height="2" transform="rotate(-90 2 17)" fill={color}/>
      <rect x="6" y="17" width="2" height="2" transform="rotate(-90 6 17)" fill={color}/>
    </svg>
  );
}
