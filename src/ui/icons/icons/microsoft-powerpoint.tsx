import React from 'react';
import type { IconProps } from '../types';

export function MicrosoftPowerpointIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="9" width="2" height="6" fill={color}/>
      <rect x="5" y="9" width="3" height="2" fill={color}/>
      <rect x="5" y="12" width="3" height="2" fill={color}/>
      <rect x="7" y="10" width="2" height="3" fill={color}/>
      <rect x="2" y="6" width="8" height="2" fill={color}/>
      <rect y="8" width="2" height="8" fill={color}/>
      <rect x="2" y="16" width="8" height="2" fill={color}/>
      <rect x="10" y="8" width="2" height="8" fill={color}/>
      <rect x="22" y="6" width="2" height="12" fill={color}/>
      <rect x="20" y="4" width="2" height="2" fill={color}/>
      <rect x="20" y="18" width="2" height="2" fill={color}/>
      <rect x="5" y="4" width="2" height="2" fill={color}/>
      <rect x="5" y="18" width="2" height="2" fill={color}/>
      <rect x="7" y="2" width="13" height="2" fill={color}/>
      <rect x="7" y="20" width="13" height="2" fill={color}/>
      <rect x="14" y="4" width="2" height="8" fill={color}/>
      <rect x="14" y="11" width="8" height="2" fill={color}/>
    </svg>
  );
}
