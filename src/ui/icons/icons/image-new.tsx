import React from 'react';
import type { IconProps } from '../types';

export function ImageNewIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="8" y="6" width="8" height="2" fill={color}/>
      <rect x="6" y="8" width="2" height="8" fill={color}/>
      <rect x="8" y="16" width="8" height="2" fill={color}/>
      <rect x="16" y="8" width="2" height="8" fill={color}/>
      <rect x="12" y="12" width="2" height="2" fill={color}/>
      <rect x="14" y="10" width="2" height="2" fill={color}/>
      <rect x="10" y="14" width="2" height="2" fill={color}/>
      <rect x="11" y="1" width="2" height="3" fill={color}/>
      <rect x="11" y="20" width="2" height="3" fill={color}/>
      <rect x="1" y="11" width="3" height="2" fill={color}/>
      <rect x="20" y="11" width="3" height="2" fill={color}/>
      <rect x="19" y="3" width="2" height="2" fill={color}/>
      <rect x="3" y="3" width="2" height="2" fill={color}/>
      <rect x="1" y="1" width="2" height="2" fill={color}/>
      <rect x="3" y="19" width="2" height="2" fill={color}/>
      <rect x="1" y="21" width="2" height="2" fill={color}/>
      <rect x="19" y="19" width="2" height="2" fill={color}/>
      <rect x="21" y="21" width="2" height="2" fill={color}/>
      <rect x="21" y="1" width="2" height="2" fill={color}/>
      <rect x="9" y="9" width="2" height="2" fill={color}/>
    </svg>
  );
}
