import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Masonry.css";

export type MasonryItem = {
  id: string;
  img: string;
  label: string;
  height: number;
};

function useColumns() {
  const getColumns = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth >= 1500) return 5;
    if (window.innerWidth >= 1000) return 4;
    if (window.innerWidth >= 600) return 3;
    if (window.innerWidth >= 400) return 2;
    return 1;
  };

  const [columns, setColumns] = useState(getColumns);

  useEffect(() => {
    const update = () => setColumns(getColumns());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return columns;
}

export function Masonry({ items }: { items: MasonryItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);
  const hasMounted = useRef(false);
  const columns = useColumns();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all(
      items.map(
        (item) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.src = item.img;
            image.onload = image.onerror = () => resolve();
          }),
      ),
    ).then(() => active && setImagesReady(true));
    return () => {
      active = false;
    };
  }, [items]);

  const grid = useMemo(() => {
    if (!width) return [];
    const gap = 12;
    const columnWidth = (width - gap * (columns - 1)) / columns;
    const columnHeights = Array(columns).fill(0) as number[];

    return items.map((item) => {
      const column = columnHeights.indexOf(Math.min(...columnHeights));
      const height = Math.max(190, (item.height / 2) * (columnWidth / 300));
      const x = column * (columnWidth + gap);
      const y = columnHeights[column];
      columnHeights[column] += height + gap;
      return { ...item, x, y, width: columnWidth, height };
    });
  }, [columns, items, width]);

  const listHeight = Math.max(0, ...grid.map((item) => item.y + item.height));

  useLayoutEffect(() => {
    if (!imagesReady || !containerRef.current) return;
    const context = gsap.context(() => {
      grid.forEach((item, index) => {
        const element = containerRef.current?.querySelector(`[data-gallery-key="${item.id}"]`);
        if (!element) return;
        const target = { x: item.x, y: item.y, width: item.width, height: item.height };

        if (!hasMounted.current) {
          gsap.fromTo(
            element,
            { opacity: 0, x: item.x, y: window.innerHeight + 100, width: item.width, height: item.height, filter: "blur(10px)" },
            { ...target, opacity: 1, filter: "blur(0px)", duration: 0.7, delay: index * 0.06, ease: "power3.out" },
          );
        } else {
          gsap.to(element, { ...target, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        }
      });
      hasMounted.current = true;
    }, containerRef);
    return () => context.revert();
  }, [grid, imagesReady]);

  return (
    <div ref={containerRef} className="masonry-list" style={{ height: listHeight }}>
      {grid.map((item) => (
        <article
          key={item.id}
          data-gallery-key={item.id}
          className="masonry-item"
          onMouseEnter={(event) => gsap.to(event.currentTarget, { scale: 0.97, duration: 0.25, ease: "power2.out" })}
          onMouseLeave={(event) => gsap.to(event.currentTarget, { scale: 1, duration: 0.25, ease: "power2.out" })}
        >
          <img src={item.img} alt={item.label} loading="lazy" className="masonry-image" />
          <div className="masonry-caption">{item.label}</div>
        </article>
      ))}
    </div>
  );
}
