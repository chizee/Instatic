import React from 'react';
import type { IconProps } from '../types';

export function MicrosoftTeamsIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <g clipPath="url(#clip0_496_2003)">
        <rect x="5" y="9" width="2" height="6" fill={color}/>
        <rect x="3" y="9" width="6" height="2" fill={color}/>
        <rect x="2" y="6" width="8" height="2" fill={color}/>
        <rect y="8" width="2" height="8" fill={color}/>
        <rect x="2" y="16" width="8" height="2" fill={color}/>
        <rect x="10" y="8" width="2" height="8" fill={color}/>
        <rect x="7" y="18" width="2" height="2" fill={color}/>
        <rect x="9" y="20" width="2" height="2" fill={color}/>
        <rect x="16" y="20" width="2" height="2" fill={color}/>
        <rect x="20" y="18" width="2" height="2" fill={color}/>
        <rect x="18" y="10" width="2" height="10" fill={color}/>
        <rect x="22" y="10" width="2" height="8" fill={color}/>
        <rect x="11" y="22" width="5" height="2" fill={color}/>
        <rect x="12" y="10" width="12" height="2" fill={color}/>
        <rect x="12" width="4" height="2" fill={color}/>
        <rect x="10" y="2" width="2" height="4" fill={color}/>
        <rect x="16" y="2" width="2" height="4" fill={color}/>
        <rect x="12" y="6" width="4" height="2" fill={color}/>
        <rect x="19" y="5" width="3" height="3" fill={color}/>
      </g>
      <defs>
        <clipPath id="clip0_496_2003">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
