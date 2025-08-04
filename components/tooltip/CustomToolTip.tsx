"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface CustomTooltipProps {
  message: string;
  children: React.ReactNode;
}

export default function CustomTooltip({
  message,
  children,
}: CustomTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY - 8, // 8px gap above
        left: rect.left + rect.width / 2,
      });
    }
  }, [visible]);

  return (
    <div
      ref={ref}
      className="inline-block relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible &&
        message &&
        createPortal(
          <div
            className="absolute z-[9999] px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg"
            style={{
              top: coords.top,
              left: coords.left,
              transform: "translate(-50%, -100%)",
              position: "absolute",
            }}
          >
            {message}
          </div>,
          document.body
        )}
    </div>
  );
}
