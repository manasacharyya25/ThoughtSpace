"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./colourful-landing.css";

const clouds = [
  {
    id: "moon",
    src: "/landing/clouds/cloud-moon.png",
    alt: "",
    className:
      "colourful-landing-cloud colourful-landing-cloud--ltr colourful-landing-cloud--slow top-[4%] h-[110px] w-[200px] sm:h-[140px] sm:w-[255px]",
    delay: "0s",
    opacity: 0.95,
  },
  {
    id: "sun",
    src: "/landing/clouds/cloud-sun.png",
    alt: "",
    className:
      "colourful-landing-cloud colourful-landing-cloud--rtl colourful-landing-cloud--medium top-[20%] h-[100px] w-[190px] sm:h-[128px] sm:w-[245px]",
    delay: "-18s",
    opacity: 0.92,
  },
  {
    id: "soft",
    src: "/landing/clouds/cloud-soft.png",
    alt: "",
    className:
      "colourful-landing-cloud colourful-landing-cloud--ltr colourful-landing-cloud--fast top-[44%] hidden h-[88px] w-[175px] sm:block sm:h-[112px] sm:w-[225px]",
    delay: "-32s",
    opacity: 0.88,
  },
  {
    id: "glow",
    src: "/landing/clouds/cloud-glow.png",
    alt: "",
    className:
      "colourful-landing-cloud colourful-landing-cloud--rtl colourful-landing-cloud--slow top-[58%] h-[104px] w-[195px] sm:h-[132px] sm:w-[250px]",
    delay: "-45s",
    opacity: 0.9,
  },
] as const;

type CloudConfig = (typeof clouds)[number];
type Offset = { x: number; y: number };

type DragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  startOffset: Offset;
};

function DraggableCloud({ cloud }: { cloud: CloudConfig }) {
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragSession = useRef<DragSession | null>(null);

  const endDrag = useCallback((target: HTMLElement, pointerId: number) => {
    if (dragSession.current?.pointerId !== pointerId) return;
    target.releasePointerCapture(pointerId);
    dragSession.current = null;
    setIsDragging(false);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragSession.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offset,
    };
    setIsDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const session = dragSession.current;
    if (!session || session.pointerId !== event.pointerId) return;

    setOffset({
      x: session.startOffset.x + (event.clientX - session.startX),
      y: session.startOffset.y + (event.clientY - session.startY),
    });
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    endDrag(event.currentTarget, event.pointerId);
  };

  const onPointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    endDrag(event.currentTarget, event.pointerId);
  };

  return (
    <div
      className={cn(
        cloud.className,
        isDragging && "colourful-landing-cloud--paused z-[5]",
      )}
      style={{ animationDelay: cloud.delay }}
    >
      <div
        className={cn(
          "colourful-landing-cloud-handle h-full w-full",
          isDragging && "colourful-landing-cloud-handle--dragging",
        )}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <Image
          src={cloud.src}
          alt={cloud.alt}
          width={512}
          height={320}
          draggable={false}
          className="colourful-landing-cloud-image h-full w-full object-contain"
          style={{ opacity: cloud.opacity }}
          priority={cloud.id === "moon"}
        />
      </div>
    </div>
  );
}

export function LandingClouds() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {clouds.map((cloud) => (
        <DraggableCloud key={cloud.id} cloud={cloud} />
      ))}
    </div>
  );
}
