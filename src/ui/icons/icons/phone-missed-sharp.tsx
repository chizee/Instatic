import React from 'react';
import type { IconProps } from '../types';

export function PhoneMissedSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="17" y="5" width="2" height="2" fill={color}/>
      <rect x="15" y="3" width="2" height="2" fill={color}/>
      <rect x="19" y="7" width="2" height="2" fill={color}/>
      <rect x="19" y="3" width="2" height="2" fill={color}/>
      <rect x="15" y="7" width="2" height="2" fill={color}/>
      <rect x="2" y="1" width="9" height="2" fill={color}/>
      <rect x="9" y="3" width="2" height="6" fill={color}/>
      <rect x="7" y="7" width="2" height="4" fill={color}/>
      <rect x="4" y="12" width="2" height="2" fill={color}/>
      <rect x="2" y="3" width="2" height="9" fill={color}/>
      <rect x="9" y="11" width="2" height="2" fill={color}/>
      <rect x="11" y="13" width="2" height="2" fill={color}/>
      <rect x="13" y="15" width="4" height="2" fill={color}/>
      <rect x="15" y="13" width="6" height="2" fill={color}/>
      <rect x="21" y="13" width="2" height="9" fill={color}/>
      <rect x="6" y="14" width="2" height="2" fill={color}/>
      <rect x="8" y="16" width="2" height="2" fill={color}/>
      <rect x="10" y="18" width="2" height="2" fill={color}/>
      <rect x="12" y="20" width="9" height="2" fill={color}/>
    </svg>
  );
}
