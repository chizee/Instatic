import React from 'react';
import type { IconProps } from '../types';

export function ProjectorSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="5" y="9" width="8" height="2" fill={color}/>
      <rect x="5" y="11" width="2" height="4" fill={color}/>
      <rect x="5" y="15" width="8" height="2" fill={color}/>
      <rect x="11" y="11" width="2" height="4" fill={color}/>
      <rect x="3" y="11" width="2" height="2" fill={color}/>
      <rect x="1" y="11" width="2" height="10" fill={color}/>
      <rect x="3" y="19" width="18" height="2" fill={color}/>
      <rect x="21" y="11" width="2" height="10" fill={color}/>
      <rect x="13" y="11" width="8" height="2" fill={color}/>
      <rect x="8" y="2" width="2" height="5" fill={color}/>
      <rect x="12" y="6" width="2" height="2" fill={color}/>
      <rect x="14" y="4" width="2" height="2" fill={color}/>
      <rect x="4" y="6" width="2" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="2" fill={color}/>
      <rect x="15" y="15" width="4" height="2" fill={color}/>
    </svg>
  );
}
