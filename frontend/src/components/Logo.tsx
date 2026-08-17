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
  const src =
    typeof logoImg === "string" ? logoImg : (logoImg as { src: string }).src;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={style}
      className={`rounded-xl object-contain ${className}`}
      decoding="async"
    />
  );
}
