import React from 'react';
import type { IconProps } from '../types';

export function CampaignmonitorIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="5" width="2" height="12" fill={color}/>
      <rect x="4" y="17" width="16" height="2" fill={color}/>
      <rect x="20" y="5" width="2" height="12" fill={color}/>
      <rect x="18" y="5" width="2" height="2" fill={color}/>
      <rect x="4" y="5" width="2" height="2" fill={color}/>
      <rect x="15" y="7" width="3" height="2" fill={color}/>
      <rect x="12" y="9" width="3" height="2" fill={color}/>
      <rect x="6" y="7" width="3" height="2" fill={color}/>
      <rect x="9" y="9" width="3" height="2" fill={color}/>
      <rect x="9" y="11" width="3" height="2" fill={color}/>
      <rect x="6" y="13" width="3" height="2" fill={color}/>
      <rect x="4" y="15" width="2" height="2" fill={color}/>
    </svg>
  );
}
