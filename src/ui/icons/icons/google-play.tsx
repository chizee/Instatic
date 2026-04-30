import React from 'react';
import type { IconProps } from '../types';

export function GooglePlayIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="1" width="2" height="22" fill={color}/>
      <rect x="6" y="1" width="1" height="2" fill={color}/>
      <rect x="7" y="3" width="3" height="2" fill={color}/>
      <rect x="10" y="5" width="3" height="2" fill={color}/>
      <rect x="13" y="7" width="3" height="2" fill={color}/>
      <rect x="16" y="9" width="3" height="2" fill={color}/>
      <rect x="19" y="11" width="2" height="2" fill={color}/>
      <rect x="16" y="13" width="3" height="2" fill={color}/>
      <rect x="13" y="15" width="3" height="2" fill={color}/>
      <rect x="10" y="17" width="3" height="2" fill={color}/>
      <rect x="7" y="19" width="3" height="2" fill={color}/>
      <rect x="6" y="21" width="1" height="2" fill={color}/>
      <rect x="13" y="11" width="3" height="2" fill={color}/>
      <rect x="11" y="9" width="2" height="2" fill={color}/>
      <rect x="11" y="13" width="2" height="2" fill={color}/>
      <rect x="9" y="15" width="2" height="2" fill={color}/>
      <rect x="7" y="17" width="2" height="2" fill={color}/>
      <rect x="5" y="19" width="2" height="2" fill={color}/>
      <rect x="9" y="7" width="2" height="2" fill={color}/>
      <rect x="7" y="5" width="2" height="2" fill={color}/>
      <rect x="5" y="3" width="2" height="2" fill={color}/>
    </svg>
  );
}
