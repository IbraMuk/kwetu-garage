"use client";

import logoImg from "../../public/logo.png";

export interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export default function Logo({
  width = 40,
  height = 40,
  className = "",
  alt = "Kwetu Garage",
  style,
}: LogoProps) {
  return (
    <img
      src={logoImg as unknown as string}
      alt={alt}
      width={width}
      height={height}
      style={style}
      className={`rounded-xl object-contain ${className}`}
      decoding="async"
    />
  );
}
