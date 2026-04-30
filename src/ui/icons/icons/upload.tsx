import React from 'react';
import type { IconProps } from '../types';

export function UploadIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M19 21.0001H5V19.0001H19V21.0001ZM5 19.0001H3V15.0001H5V19.0001ZM21 19.0001H19V15.0001H21V19.0001ZM13 5.00006H15V7.00006H17V9.00006H13V17.0001H11V9.00006H7V7.00006H9V5.00006H11V3.00006H13V5.00006Z" fill={color}/>
    </svg>
  );
}
