import React from 'react';
import type { IconProps } from '../types';

export function BluetoothOffIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="10" y="1" width="2" height="6" fill={color}/>
      <rect x="10" y="11" width="2" height="12" fill={color}/>
      <rect x="12" y="3" width="2" height="2" fill={color}/>
      <rect x="14" y="5" width="2" height="2" fill={color}/>
      <rect x="16" y="7" width="2" height="2" fill={color}/>
      <rect x="14" y="9" width="2" height="2" fill={color}/>
      <rect x="4" y="5" width="2" height="2" fill={color}/>
      <rect x="2" y="3" width="2" height="2" fill={color}/>
      <rect x="6" y="7" width="2" height="2" fill={color}/>
      <rect x="8" y="9" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 10 13)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 8 15)" fill={color}/>
      <rect width="2" height="2" transform="matrix(-1 0 0 1 6 17)" fill={color}/>
      <rect x="10" y="11" width="2" height="2" fill={color}/>
      <rect x="12" y="13" width="2" height="2" fill={color}/>
      <rect x="14" y="15" width="2" height="2" fill={color}/>
      <rect x="16" y="17" width="2" height="2" fill={color}/>
      <rect x="18" y="19" width="2" height="2" fill={color}/>
      <rect x="14" y="17" width="2" height="2" fill={color}/>
      <rect x="12" y="19" width="2" height="2" fill={color}/>
    </svg>
  );
}
