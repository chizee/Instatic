import React from 'react';
import type { IconProps } from '../types';

export function CigaretteIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="13" width="2" height="2" fill={color}/>
      <rect x="4" y="11" width="15" height="2" fill={color}/>
      <rect x="4" y="15" width="15" height="2" fill={color}/>
      <rect x="7" y="13" width="2" height="2" fill={color}/>
      <rect x="18" y="11" width="2" height="2" fill={color}/>
      <rect x="20" y="13" width="2" height="2" fill={color}/>
      <rect x="18" y="15" width="2" height="2" fill={color}/>
      <rect x="14" y="6" width="2" height="3" fill={color}/>
      <rect x="12" y="3" width="2" height="3" fill={color}/>
      <rect x="19" y="6" width="2" height="3" fill={color}/>
      <rect x="17" y="3" width="2" height="3" fill={color}/>
    </svg>
  );
}
