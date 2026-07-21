"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2((aPos.x + 1.0) * 0.5, 1.0 - (aPos.y + 1.0) * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uProgress;
uniform vec2 uImageAspect;

void main() {
  // Preserve image aspect inside the canvas viewport (object-contain behavior)
  vec2 uv = vUv;
  vec2 c = vec2(0.5);
  vec2 d = (uv - c) * uImageAspect;
  float r = length(d);

  // Falloff so center twists more than edges
  float maxR = 0.75;
  float w = 1.0 - smoothstep(0.0, maxR, r);

  // Total angular twist grows with progress; ~3 turns at center, ~0.5 at rim
  float twist = uProgress * 6.2831 * (0.4 + 2.6 * w);

  // Pull inward: sample from further out as progress grows
  float shrink = 1.0 - uProgress * 0.9;

  float ang = atan(d.y, d.x) + twist;
  vec2 srcOffset = vec2(cos(ang), sin(ang)) * (r / max(shrink, 0.001));
  vec2 srcUv = c + srcOffset / uImageAspect;

  // Fade to reveal what's beneath
  float alpha = 1.0 - smoothstep(0.55, 1.0, uProgress);

  // A subtle radial darkening near the drain point
  float darken = 1.0 - w * uProgress * 0.4;

  if (srcUv.x < 0.0 || srcUv.x > 1.0 || srcUv.y < 0.0 || srcUv.y > 1.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec4 col = texture2D(uTex, srcUv);
  gl_FragColor = vec4(col.rgb * darken, col.a * alpha);
}
`;

type Props = {
  src: string;
  playing: boolean;
  durationMs?: number;
  className?: string;
  onDone?: () => void;
};

export default function DrainSwirl({
  src,
  playing,
  durationMs = 1400,
  className,
  onDone,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const drawRef = useRef<((progress: number) => void) | null>(null);
  const readyRef = useRef(false);
  const rafRef = useRef(0);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: false,
      alpha: true,
      antialias: true,
    });
    if (!gl) return;
    glRef.current = gl;

    const compile = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("DrainSwirl shader compile:", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("DrainSwirl link:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uProgress = gl.getUniformLocation(prog, "uProgress");
    const uImageAspect = gl.getUniformLocation(prog, "uImageAspect");
    const uTex = gl.getUniformLocation(prog, "uTex");

    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(uTex, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let imgW = 1;
    let imgH = 1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (cw === 0 || ch === 0) return;
      const w = Math.max(1, Math.round(cw * dpr));
      const h = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      // Aspect correction: how the image maps into the canvas as "contain"
      const canvasAspect = w / h;
      const imageAspect = imgW / imgH;
      // We warp in a normalized space where distances are corrected so circles
      // remain circular regardless of canvas aspect.
      const ax = canvasAspect >= imageAspect ? canvasAspect / imageAspect : 1;
      const ay = canvasAspect >= imageAspect ? 1 : imageAspect / canvasAspect;
      gl.uniform2f(uImageAspect, ax, ay);
    };

    const draw = (progress: number) => {
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uProgress, progress);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    drawRef.current = draw;

    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => {
      imgW = img.naturalWidth;
      imgH = img.naturalHeight;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        img
      );
      readyRef.current = true;
      draw(0);
    };

    const ro = new ResizeObserver(() => {
      if (readyRef.current) draw(0);
    });
    ro.observe(canvas);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      readyRef.current = false;
      drawRef.current = null;
      glRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    if (!playing) return;
    let cancelled = false;

    const start = (t0: number) => {
      const step = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - t0) / durationMs);
        drawRef.current?.(t);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          onDoneRef.current?.();
        }
      };
      rafRef.current = requestAnimationFrame(step);
    };

    if (readyRef.current) {
      start(performance.now());
    } else {
      const iv = window.setInterval(() => {
        if (readyRef.current) {
          window.clearInterval(iv);
          start(performance.now());
        }
      }, 30);
      return () => {
        cancelled = true;
        window.clearInterval(iv);
        cancelAnimationFrame(rafRef.current);
      };
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [playing, durationMs]);

  return <canvas ref={canvasRef} className={className} />;
}
