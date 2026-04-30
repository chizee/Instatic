import React from 'react';
import type { IconProps } from '../types';

export function QrCodeIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="4" y="2" width="3" height="2" fill={color}/>
      <rect x="17" y="2" width="3" height="2" fill={color}/>
      <rect x="4" y="15" width="3" height="2" fill={color}/>
      <rect x="2" y="4" width="2" height="3" fill={color}/>
      <rect x="15" y="4" width="2" height="3" fill={color}/>
      <rect x="2" y="17" width="2" height="3" fill={color}/>
      <rect x="4" y="7" width="3" height="2" fill={color}/>
      <rect x="17" y="7" width="3" height="2" fill={color}/>
      <rect x="4" y="20" width="3" height="2" fill={color}/>
      <rect x="7" y="4" width="2" height="3" fill={color}/>
      <rect x="20" y="4" width="2" height="3" fill={color}/>
      <rect x="7" y="17" width="2" height="3" fill={color}/>
      <rect x="2" y="11" width="2" height="2" fill={color}/>
      <rect x="11" y="2" width="2" height="2" fill={color}/>
      <rect x="20" y="11" width="2" height="2" fill={color}/>
      <rect x="20" y="20" width="2" height="2" fill={color}/>
      <rect x="15" y="11" width="3" height="2" fill={color}/>
      <rect x="11" y="15" width="2" height="2" fill={color}/>
      <rect x="11" y="19" width="2" height="3" fill={color}/>
      <rect x="6" y="11" width="5" height="2" fill={color}/>
      <rect x="11" y="6" width="2" height="5" fill={color}/>
      <rect x="15" y="17" width="2" height="5" fill={color}/>
      <rect x="17" y="15" width="5" height="2" fill={color}/>
    </svg>
  );
}
