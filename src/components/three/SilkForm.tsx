"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const vertexShaderSource = `
uniform float uTime;

varying vec3 vNormal;
varying vec3 vViewPosition;

// Stefan Gustavson's 3D simplex noise
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z.xxxx);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

vec3 getDisplacedPosition(vec3 p) {
  float t = uTime * 0.08;
  vec3 pNormal = normalize(p);
  
  // Layered simplex noise for organic, silk-like undulation
  float n1 = snoise(p * 0.75 + vec3(t, t * 0.8, -t * 0.5));
  float n2 = snoise(p * 1.5 - vec3(-t * 0.6, t, t * 0.7)) * 0.5;
  float n3 = snoise(p * 3.0 + vec3(t * 0.4, -t * 0.5, t * 0.6)) * 0.25;
  float totalNoise = (n1 + n2 + n3) / 1.75;
  
  // Gentle displacement (~0.35)
  return p + pNormal * (totalNoise * 0.35);
}

void main() {
  vec3 p0 = getDisplacedPosition(position);
  
  // Finite difference calculation for accurate surface normals after displacement
  vec3 tangent1 = normalize(cross(normal, abs(normal.y) > 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0)));
  vec3 tangent2 = normalize(cross(normal, tangent1));
  
  float epsilon = 0.005;
  vec3 p1 = getDisplacedPosition(position + tangent1 * epsilon);
  vec3 p2 = getDisplacedPosition(position + tangent2 * epsilon);
  
  vec3 computedNormal = normalize(cross(p1 - p0, p2 - p0));
  
  vNormal = normalize(normalMatrix * computedNormal);
  
  vec4 mvPosition = modelViewMatrix * vec4(p0, 1.0);
  vViewPosition = mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShaderSource = `
uniform float uOpacity;
uniform vec3 uBoneColor;
uniform vec3 uClayColor;

varying vec3 vNormal;
varying vec3 vViewPosition;

// Pseudo-random hash for dithering / grain
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(-vViewPosition);
  
  // Fresnel: 0 at center facing camera, 1 at grazing rims
  float fresnel = clamp(1.0 - max(0.0, dot(viewDir, normal)), 0.0, 1.0);
  float fresnelPow = pow(fresnel, 2.5);
  
  // Studio lighting directions in view space
  vec3 keyLightDir = normalize(vec3(0.6, 0.8, 0.5));
  vec3 rimLightDir = normalize(vec3(-0.7, -0.6, -0.3));
  
  float keyDiffuse = max(0.0, dot(normal, keyLightDir));
  float rimDiffuse = max(0.0, dot(normal, rimLightDir));
  
  // Facing factor: surface orientation relative to camera / vertical
  float facing = (normal.y * 0.5 + 0.5) * 0.5 + (normal.z * 0.5 + 0.5) * 0.5;
  
  // Smooth gradient between clay (#b08968) and bone (#efe7db) driven by normal
  float mixFactor = clamp(keyDiffuse * 0.55 + facing * 0.45 - rimDiffuse * 0.15, 0.0, 1.0);
  mixFactor = smoothstep(0.15, 0.85, mixFactor);
  
  vec3 baseColor = mix(uClayColor, uBoneColor, mixFactor);
  
  // Soft matte porcelain/silk sheen: fresnel-lightening toward rims
  vec3 sheenColor = vec3(0.97, 0.94, 0.89);
  vec3 finalColor = mix(baseColor, sheenColor, fresnelPow * 0.7);
  
  // Subtle grain/dither to avoid banding
  float grain = (random(gl_FragCoord.xy) - 0.5) * 0.025;
  finalColor += grain;
  
  gl_FragColor = vec4(finalColor, uOpacity);
}
`;

export function SilkForm() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniformsRef = useRef({
    uTime: { value: 0 },
    uOpacity: { value: 1.0 },
    uBoneColor: { value: new THREE.Color("#efe7db") },
    uClayColor: { value: new THREE.Color("#b08968") },
  });

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: vertexShaderSource,
      fragmentShader: fragmentShaderSource,
      uniforms: uniformsRef.current,
      transparent: true,
      side: THREE.FrontSide,
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    // Zero per-frame allocations: mutate uniform values directly
    uniformsRef.current.uTime.value = state.clock.getElapsedTime();

    const lerpFactor = Math.min(1, delta * 3.5);

    // 1. Constant slow rotation
    meshRef.current.rotation.y += 0.0006 * (delta * 60);

    // 2. Pointer parallax: ease group toward cursor tilt (max ~0.12 rad)
    const targetRotX = state.pointer.y * -0.12;
    const targetRotY = state.pointer.x * 0.12;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      lerpFactor
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      lerpFactor
    );

    // 3. Scroll recede: read window.scrollY and ease position, scale, opacity
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const viewportHeight =
      typeof window !== "undefined" && window.innerHeight > 0
        ? window.innerHeight
        : 800;
    const scrollProgress = Math.min(1, Math.max(0, scrollY / viewportHeight));

    const targetPosY = scrollProgress * 1.2;
    const targetScale = 1.0 - scrollProgress * 0.15;
    const targetOpacity = 1.0 - scrollProgress;

    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetPosY,
      lerpFactor
    );
    groupRef.current.scale.x = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      targetScale,
      lerpFactor
    );
    groupRef.current.scale.y = THREE.MathUtils.lerp(
      groupRef.current.scale.y,
      targetScale,
      lerpFactor
    );
    groupRef.current.scale.z = THREE.MathUtils.lerp(
      groupRef.current.scale.z,
      targetScale,
      lerpFactor
    );

    uniformsRef.current.uOpacity.value = THREE.MathUtils.lerp(
      uniformsRef.current.uOpacity.value,
      targetOpacity,
      lerpFactor
    );
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} material={material}>
        <icosahedronGeometry args={[1.6, 64]} />
      </mesh>
    </group>
  );
}
