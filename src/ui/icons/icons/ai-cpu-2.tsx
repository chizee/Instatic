import React from 'react';
import type { IconProps } from '../types';

export function AiCpu2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="4" width="16" height="2" fill={color}/>
      <rect x="4" y="18" width="16" height="2" fill={color}/>
      <rect x="4" y="6" width="2" height="12" fill={color}/>
      <rect x="18" y="6" width="2" height="12" fill={color}/>
      <rect x="11" y="2" width="2" height="4" fill={color}/>
      <rect x="2" y="13" width="2" height="4" transform="rotate(-90 2 13)" fill={color}/>
      <rect x="11" y="18" width="2" height="4" fill={color}/>
      <rect x="18" y="13" width="2" height="4" transform="rotate(-90 18 13)" fill={color}/>
      <rect x="7" y="2" width="2" height="4" fill={color}/>
      <rect x="2" y="17" width="2" height="4" transform="rotate(-90 2 17)" fill={color}/>
      <rect x="7" y="18" width="2" height="4" fill={color}/>
      <rect x="18" y="17" width="2" height="4" transform="rotate(-90 18 17)" fill={color}/>
      <rect x="15" y="2" width="2" height="4" fill={color}/>
      <rect x="2" y="9" width="2" height="4" transform="rotate(-90 2 9)" fill={color}/>
      <rect x="15" y="18" width="2" height="4" fill={color}/>
      <rect x="18" y="9" width="2" height="4" transform="rotate(-90 18 9)" fill={color}/>
      <rect x="7" y="11" width="2" height="2" fill={color}/>
      <rect x="11" y="7" width="2" height="2" fill={color}/>
      <rect x="13" y="9" width="2" height="2" fill={color}/>
      <rect x="9" y="9" width="2" height="2" fill={color}/>
      <rect x="9" y="13" width="2" height="2" fill={color}/>
      <rect x="13" y="13" width="2" height="2" fill={color}/>
      <rect x="15" y="11" width="2" height="2" fill={color}/>
      <rect x="11" y="15" width="2" height="2" fill={color}/>
    </svg>
  );
}
