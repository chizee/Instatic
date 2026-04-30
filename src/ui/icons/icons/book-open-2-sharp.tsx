import React from 'react';
import type { IconProps } from '../types';

export function BookOpen2SharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect y="3" width="13" height="2" fill={color}/>
      <rect y="19" width="11" height="2" fill={color}/>
      <rect x="11" y="3" width="13" height="2" fill={color}/>
      <rect x="13" y="19" width="11" height="2" fill={color}/>
      <rect x="11" y="5" width="2" height="18" fill={color}/>
      <rect y="5" width="2" height="14" fill={color}/>
      <rect x="22" y="5" width="2" height="14" fill={color}/>
      <rect x="15" y="7" width="5" height="2" fill={color}/>
      <rect x="4" y="7" width="5" height="2" fill={color}/>
      <rect x="15" y="11" width="5" height="2" fill={color}/>
      <rect x="4" y="11" width="3" height="2" fill={color}/>
      <rect x="15" y="15" width="2" height="2" fill={color}/>
      <rect x="4" y="15" width="5" height="2" fill={color}/>
    </svg>
  );
}
