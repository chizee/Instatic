import React from 'react';
import type { IconProps } from '../types';

export function MicrosoftExcelIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="2" y="6" width="8" height="2" fill={color}/>
      <rect y="8" width="2" height="8" fill={color}/>
      <rect x="2" y="16" width="8" height="2" fill={color}/>
      <rect x="10" y="8" width="2" height="8" fill={color}/>
      <rect x="5" y="3" width="2" height="3" fill={color}/>
      <rect x="5" y="18" width="2" height="3" fill={color}/>
      <rect x="22" y="3" width="2" height="18" fill={color}/>
      <rect x="3" y="9" width="1" height="2" fill={color}/>
      <rect x="3" y="13" width="1" height="2" fill={color}/>
      <rect x="8" y="13" width="1" height="2" fill={color}/>
      <rect x="8" y="9" width="1" height="2" fill={color}/>
      <rect x="5" y="11" width="2" height="2" fill={color}/>
      <rect x="4" y="10" width="1" height="4" fill={color}/>
      <rect x="7" y="10" width="1" height="4" fill={color}/>
      <rect x="7" y="1" width="15" height="2" fill={color}/>
      <rect x="7" y="21" width="15" height="2" fill={color}/>
      <rect x="10" y="6" width="12" height="2" fill={color}/>
      <rect x="10" y="11" width="12" height="2" fill={color}/>
      <rect x="10" y="16" width="12" height="2" fill={color}/>
      <rect x="14" y="3" width="2" height="18" fill={color}/>
      <rect x="4" y="9" width="1" height="1" fill={color}/>
      <rect x="5" y="10" width="1" height="1" fill={color}/>
      <rect x="6" y="10" width="1" height="1" fill={color}/>
      <rect x="7" y="9" width="1" height="1" fill={color}/>
      <rect x="7" y="14" width="1" height="1" fill={color}/>
      <rect x="6" y="13" width="1" height="1" fill={color}/>
      <rect x="5" y="13" width="1" height="1" fill={color}/>
      <rect x="4" y="14" width="1" height="1" fill={color}/>
    </svg>
  );
}
