import React from 'react';
import type { IconProps } from '../types';

export function TournamentIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="1" width="5" height="2" fill={color}/>
      <rect x="2" y="13" width="5" height="2" fill={color}/>
      <rect x="2" y="9" width="5" height="2" fill={color}/>
      <rect x="2" y="21" width="5" height="2" fill={color}/>
      <rect x="7" y="3" width="2" height="6" fill={color}/>
      <rect x="14" y="7" width="2" height="10" fill={color}/>
      <rect x="7" y="15" width="2" height="6" fill={color}/>
      <rect x="9" y="17" width="5" height="2" fill={color}/>
      <rect x="9" y="5" width="5" height="2" fill={color}/>
      <rect x="16" y="11" width="6" height="2" fill={color}/>
    </svg>
  );
}
