import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

type Skill = { name: string; logo: string };

const SKILLS: Skill[] = [
  { name: "Power BI", logo: "/images/powerbi.svg" },
  { name: "Amplitude", logo: "/images/amplitude.svg" },
  { name: "PostgreSQL", logo: "/images/postgres.svg" },
  { name: "Python", logo: "/images/python.svg" },
  { name: "Jira", logo: "/images/jira.svg" },
  { name: "Confluence", logo: "/images/confluence.svg" },
  { name: "Figma", logo: "/images/figma.svg" },
  { name: "GitHub", logo: "/images/github.svg" },
  { name: "Salesforce", logo: "/images/salesforce.svg" },
  { name: "Claude", logo: "/images/claude.svg" },
  { name: "Hugging Face", logo: "/images/huggingface.svg" },
  { name: "Miro", logo: "/images/miro.svg" },
  { name: "Monday.com", logo: "/images/monday.svg" },
  { name: "n8n", logo: "/images/n8n.svg" },
  { name: "Lovable", logo: "/images/lovable.svg" },
  { name: "Supabase", logo: "/images/supabase.svg" },
  { name: "Vercel", logo: "/images/vercel.svg" },
];

// Build a canvas texture per skill: white background, logo on one hemisphere
// (left half of canvas, centered around u=0.25) and the skill name in black on
// the opposite hemisphere (right half, centered around u=0.75). Font auto-fits
// to a single line so the user always sees the whole name in one glance.
function makeSkillTexture(skill: Skill): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = "#0a0a0a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fontFamily = `"Inter", "Helvetica Neue", Arial, sans-serif`;
  let fontSize = 110;
  const maxWidth = 460;
  ctx.font = `700 ${fontSize}px ${fontFamily}`;
  while (ctx.measureText(skill.name).width > maxWidth && fontSize > 28) {
    fontSize -= 4;
    ctx.font = `700 ${fontSize}px ${fontFamily}`;
  }
  ctx.fillText(skill.name, 768, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;

  const img = new Image();
  img.onload = () => {
    const pad = 70;
    const size = 512 - 2 * pad; // 372x372 logo region inside left half
    ctx.drawImage(img, pad, pad, size, size);
    tex.needsUpdate = true;
  };
  img.onerror = () => {
    console.warn(`[TechStack] missing logo: ${skill.logo}`);
  };
  img.src = skill.logo;

  return tex;
}

const textures = SKILLS.map(makeSkillTexture);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// One sphere per skill — no duplicates.
const SPHERE_SCALE = 0.75;
const spheres = SKILLS.map(() => ({ scale: SPHERE_SCALE }));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  // Mobile detection — gates the GPU-expensive features (N8AO post-processing,
  // dynamic shadows, HDR environment) so phones don't crash from running two
  // WebGL contexts (this scene + the character scene) plus heavy effects.
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth <= 1024
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  return (
    <div className="techstack">
      <h2> My Techstack</h2>

      <Canvas
        // Shadows + post-processing + HDR are desktop-only. On mobile we keep
        // the same 17 physics spheres and the same logo+name textures so the
        // visual signature is intact, but skip the GPU-heavy effects.
        shadows={!isMobile}
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        // Cap DPR at 2 so the physics-driven cluster stays at full framerate
        // on high-DPR mobile devices without sacrificing perceived sharpness.
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
        frameloop={isActive ? "always" : "demand"}
      >
        <ambientLight intensity={isMobile ? 1.3 : 1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow={!isMobile}
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={materials[i]}
              isActive={isActive}
            />
          ))}
        </Physics>
        {!isMobile && (
          <Environment
            files="/models/char_enviorment.hdr"
            environmentIntensity={0.5}
            environmentRotation={[0, 4, 2]}
          />
        )}
        {!isMobile && (
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default TechStack;
