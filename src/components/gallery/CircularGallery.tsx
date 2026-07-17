import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";
import "./CircularGallery.css";

export type CircularGalleryItem = {
  image: string;
  text: string;
};

type CircularGalleryProps = {
  items: CircularGalleryItem[];
  onItemClick?: (index: number) => void;
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollSpeed?: number;
  scrollEase?: number;
};

const vertex = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpeed;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z = sin(p.x * 4.0 + uTime) * (0.025 + abs(uSpeed) * 0.04);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = `
  precision highp float;
  uniform sampler2D tMap;
  uniform vec2 uImageSizes;
  uniform vec2 uPlaneSizes;
  uniform float uBorderRadius;
  varying vec2 vUv;
  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b;
    return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
  }
  void main() {
    vec2 ratio = vec2(
      min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
      min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
    );
    vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * .5, vUv.y * ratio.y + (1.0 - ratio.y) * .5);
    vec4 color = texture2D(tMap, uv);
    float d = roundedBoxSDF(vUv - .5, vec2(.5 - uBorderRadius), uBorderRadius);
    float alpha = 1.0 - smoothstep(-.002, .002, d);
    gl_FragColor = vec4(color.rgb, alpha);
  }
`;

const titleVertex = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const titleFragment = `
  precision highp float;
  uniform sampler2D tMap;
  varying vec2 vUv;
  void main() {
    vec4 color = texture2D(tMap, vUv);
    if (color.a < .05) discard;
    gl_FragColor = color;
  }
`;

export function CircularGallery({
  items,
  onItemClick,
  bend = 2.5,
  textColor = "#0b1f3a",
  borderRadius = 0.045,
  scrollSpeed = 2,
  scrollEase = 0.08,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !items.length) return;

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    const gl = renderer.gl;
    const camera = new Camera(gl, { fov: 45 });
    camera.position.z = 20;
    const scene = new Transform();
    const geometry = new Plane(gl, { widthSegments: 80, heightSegments: 24 });
    container.appendChild(gl.canvas);

    let screen = { width: 1, height: 1 };
    let viewport = { width: 1, height: 1 };
    let raf = 0;
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;
    let dragDistance = 0;
    const scroll = { current: 0, target: 0, last: 0 };

    const galleryItems = [...items, ...items];
    const media = galleryItems.map((item, index) => {
      const texture = new Texture(gl, { generateMipmaps: true });
      const program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          tMap: { value: texture },
          uImageSizes: { value: [1, 1] },
          uPlaneSizes: { value: [1, 1] },
          uBorderRadius: { value: borderRadius },
          uTime: { value: Math.random() * 100 },
          uSpeed: { value: 0 },
        },
      });
      const plane = new Mesh(gl, { geometry, program });
      plane.setParent(scene);
      const image = new Image();
      image.src = item.image;
      image.onload = () => {
        texture.image = image;
        program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
      };

      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 1000;
      labelCanvas.height = 160;
      const labelContext = labelCanvas.getContext("2d");
      if (labelContext) {
        labelContext.font = "800 58px Arial, sans-serif";
        labelContext.fillStyle = textColor;
        labelContext.textAlign = "center";
        labelContext.textBaseline = "middle";
        labelContext.fillText(item.text, labelCanvas.width / 2, labelCanvas.height / 2);
      }
      const labelTexture = new Texture(gl, { generateMipmaps: false });
      labelTexture.image = labelCanvas;
      const labelProgram = new Program(gl, {
        vertex: titleVertex,
        fragment: titleFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: { tMap: { value: labelTexture } },
      });
      const label = new Mesh(gl, { geometry: new Plane(gl), program: labelProgram });
      label.setParent(plane);
      return { plane, label, program, index, extra: 0, width: 1, x: 0, widthTotal: 1 };
    });

    const resize = () => {
      screen = { width: container.clientWidth, height: container.clientHeight };
      if (!screen.width || !screen.height) return;
      renderer.setSize(screen.width, screen.height);
      camera.perspective({ aspect: screen.width / screen.height });
      const viewHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      viewport = { width: viewHeight * camera.aspect, height: viewHeight };
      media.forEach((entry) => {
        entry.plane.scale.y = viewport.height * 0.62;
        entry.plane.scale.x = entry.plane.scale.y * 0.92;
        // The label is a child of the image plane, so keep these values in the
        // plane's local coordinate system. This places it immediately below
        // the image at every screen size.
        entry.label.scale.set(1, 0.27, 1);
        entry.label.position.y = -0.74;
        entry.program.uniforms.uPlaneSizes.value = [entry.plane.scale.x, entry.plane.scale.y];
        entry.width = entry.plane.scale.x + 0.5;
        entry.widthTotal = entry.width * media.length;
        entry.x = entry.width * entry.index;
      });
    };

    const update = () => {
      scroll.current += (scroll.target - scroll.current) * scrollEase;
      const direction = scroll.current > scroll.last ? 1 : -1;
      media.forEach((entry) => {
        const x = entry.x - scroll.current - entry.extra;
        entry.plane.position.x = x;
        const halfViewport = viewport.width / 2;
        const cappedX = Math.min(Math.abs(x), halfViewport);
        if (bend) {
          const magnitude = Math.abs(bend);
          const radius = (halfViewport * halfViewport + magnitude * magnitude) / (2 * magnitude);
          const arc = radius - Math.sqrt(Math.max(0, radius * radius - cappedX * cappedX));
          entry.plane.position.y = bend > 0 ? -arc : arc;
          entry.plane.rotation.z = (bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(cappedX / radius);
        }
        const halfPlane = entry.plane.scale.x / 2;
        if (direction > 0 && x + halfPlane < -halfViewport) entry.extra -= entry.widthTotal;
        if (direction < 0 && x - halfPlane > halfViewport) entry.extra += entry.widthTotal;
        entry.program.uniforms.uTime.value += 0.035;
        entry.program.uniforms.uSpeed.value = scroll.current - scroll.last;
      });
      renderer.render({ scene, camera });
      scroll.last = scroll.current;
      raf = requestAnimationFrame(update);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      scroll.target += (event.deltaY || event.deltaX) * 0.012 * scrollSpeed;
    };
    const onPointerDown = (event: PointerEvent) => {
      isDragging = true;
      startX = event.clientX;
      startScroll = scroll.target;
      dragDistance = 0;
      container.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (isDragging) {
        dragDistance = Math.max(dragDistance, Math.abs(startX - event.clientX));
        scroll.target = startScroll + (startX - event.clientX) * 0.018 * scrollSpeed;
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      isDragging = false;
      if (dragDistance > 8 || !onItemClick) return;
      const bounds = container.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * viewport.width;
      const selected = media.reduce((closest, entry) =>
        Math.abs(entry.plane.position.x - pointerX) < Math.abs(closest.plane.position.x - pointerX)
          ? entry
          : closest,
      );
      onItemClick(selected.index % items.length);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") scroll.target += scrollSpeed * 1.5;
      if (event.key === "ArrowLeft") scroll.target -= scrollSpeed * 1.5;
    };

    resize();
    update();
    window.addEventListener("resize", resize);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("keydown", onKeyDown);
      gl.canvas.remove();
    };
  }, [items, onItemClick, bend, borderRadius, scrollEase, scrollSpeed, textColor]);

  return (
    <div
      ref={containerRef}
      className="circular-gallery"
      tabIndex={0}
      aria-label="Category gallery. Use left and right arrow keys to browse."
    />
  );
}
