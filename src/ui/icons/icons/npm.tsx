import React from 'react';
import type { IconProps } from '../types';

export function NpmIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="7" width="20" height="2" fill={color}/>
      <rect x="2" y="14" width="4" height="2" fill={color}/>
      <rect x="6" y="16" width="6" height="2" fill={color}/>
      <rect y="7" width="2" height="9" fill={color}/>
      <rect x="6" y="9" width="2" height="7" fill={color}/>
      <rect x="13" y="9" width="2" height="7" fill={color}/>
      <rect x="22" y="7" width="2" height="9" fill={color}/>
      <rect x="15" y="14" width="7" height="2" fill={color}/>
      <rect x="10" y="14" width="3" height="2" fill={color}/>
      <rect x="3" y="10" width="2" height="4" fill={color}/>
      <rect x="10" y="10" width="2" height="3" fill={color}/>
      <rect x="16" y="10" width="2" height="4" fill={color}/>
      <rect x="19" y="10" width="2" height="4" fill={color}/>
    </svg>
  );
}
