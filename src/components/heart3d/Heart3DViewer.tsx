import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { 
  Heart, 
  RotateCcw, 
  Activity, 
  Zap, 
  Layers, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Upload, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Minimize2,
  Camera,
  Download,
  Stethoscope,
  Info,
  Radio,
  Sliders,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Box,
  Eye,
  Crosshair
} from 'lucide-react';
import { playHeartbeatSound, playStethoscopeSound } from '../../utils/audio';
import { 
  createMyocardiumTexture, 
  createMyocardiumNormalMap,
  PerfusionVisualMode 
} from '../../utils/heartTextures';
import { useTheme } from '../../context/ThemeContext';

interface Hotspot {
  id: string;
  name: string;
  position: THREE.Vector3;
  cameraPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  clinicalNote: string;
  status: string;
  perfusion: string;
  vessel: string;
}

export type IschemiaScenario = 'patent_stent' | 'acute_ischemia' | 'severe_cad' | 'stress_hyperemia';

export const Heart3DViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const ecgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core Simulation & UI State
  const { isDark } = useTheme();
  const [bpm, setBpm] = useState<number>(68);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showBloodFlow, setShowBloodFlow] = useState<boolean>(true);
  const [showConduction, setShowConduction] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [visualMode, setVisualMode] = useState<PerfusionVisualMode>('heatmap');
  const [activeScenario, setActiveScenario] = useState<IschemiaScenario>('patent_stent');
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [activeView, setActiveView] = useState<'anterior' | 'posterior' | 'lateral' | 'aorta' | 'stent'>('anterior');
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeAuscultation, setActiveAuscultation] = useState<string | null>(null);
  const [isExportingGlb, setIsExportingGlb] = useState<boolean>(false);
  const [isCrossSection, setIsCrossSection] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'perfusion' | 'anatomy' | 'telemetry' | 'audio'>('perfusion');

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const heartGroupRef = useRef<THREE.Group | null>(null);
  const proceduralHeartMeshRef = useRef<THREE.Mesh | null>(null);
  const customGlbGroupRef = useRef<THREE.Group | null>(null);
  const stentMeshRef = useRef<THREE.Mesh | null>(null);
  const bloodParticlesRef = useRef<THREE.Points | null>(null);
  const conductionLinesRef = useRef<THREE.LineSegments | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);
  const clippingPlaneRef = useRef<THREE.Plane | null>(null);

  // Dynamic Camera Interpolation targets
  const targetCamPos = useRef(new THREE.Vector3(0, 0.25, 5.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Auscultation points
  const auscultationPoints = [
    { id: 'aortic', name: 'Aortic Area (2nd R ICS)', sound: 'S2 loudest' },
    { id: 'pulmonic', name: 'Pulmonic Area (2nd L ICS)', sound: 'S2 split' },
    { id: 'erbs', name: "Erb's Point (3rd L Sternal Border)", sound: 'S1/S2 equal' },
    { id: 'tricuspid', name: 'Tricuspid Area (4th L ICS)', sound: 'S1 loudest' },
    { id: 'mitral', name: 'Mitral / Apex (5th L Midclavicular)', sound: 'S1 apex' }
  ];

  // Anatomical Hotspots with coordinates on the 3D heart
  const hotspots: Hotspot[] = [
    {
      id: 'stent',
      name: 'Mid-LAD Coronary Artery (Prior Stent)',
      position: new THREE.Vector3(-0.45, 0.15, 1.25),
      cameraPos: new THREE.Vector3(-0.85, 0.35, 3.1),
      targetPos: new THREE.Vector3(-0.45, 0.15, 1.25),
      clinicalNote: 'Drug-eluting cobalt-chromium stent deployed in proximal-to-mid Left Anterior Descending artery. Optical Coherence Tomography (OCT) confirms complete endothelialization with zero in-stent restenosis.',
      status: 'Patent · Flow TIMI 3',
      perfusion: '100% Flow (Hyperemic)',
      vessel: 'Left Anterior Descending'
    },
    {
      id: 'left_ventricle',
      name: 'Left Ventricular Myocardium',
      position: new THREE.Vector3(-0.6, -0.6, 0.8),
      cameraPos: new THREE.Vector3(-1.5, -0.4, 4.0),
      targetPos: new THREE.Vector3(-0.6, -0.6, 0.8),
      clinicalNote: 'Main muscular systemic pump. Wall motion shows normal concentric systolic thickening without apical hypokinesis. Ejection fraction estimated at 62%.',
      status: 'Normal Systolic Function',
      perfusion: 'Optimal Subendocardial Flow',
      vessel: 'LAD / LCx Dual Bed'
    },
    {
      id: 'aorta',
      name: 'Ascending Aorta & Supra-Aortic Arch',
      position: new THREE.Vector3(0.05, 1.35, 0.25),
      cameraPos: new THREE.Vector3(0.1, 1.6, 3.8),
      targetPos: new THREE.Vector3(0.05, 1.35, 0.25),
      clinicalNote: 'Systemic outflow tract distributing blood to cerebrum and periphery. Caliber measured at 32mm with pliable trileaflet aortic valve and no post-stenotic dilation.',
      status: 'Normal Caliber (32mm)',
      perfusion: 'Systemic Conduit',
      vessel: 'Aorta Ascendens'
    },
    {
      id: 'sa_node',
      name: 'Right Atrium & Sinoatrial (SA) Node',
      position: new THREE.Vector3(0.95, 0.6, 0.35),
      cameraPos: new THREE.Vector3(2.2, 0.8, 3.8),
      targetPos: new THREE.Vector3(0.95, 0.6, 0.35),
      clinicalNote: 'Primary intrinsic cardiac pacemaker generating regular 68 BPM sinus rhythm. Internodal electrical tracts propagate seamlessly toward AV node.',
      status: 'Sinus Rhythm Generator',
      perfusion: 'RCA Nodal Branch',
      vessel: 'Sinoatrial Nodal Artery'
    },
    {
      id: 'septum',
      name: 'Interventricular Septum & Bundle of His',
      position: new THREE.Vector3(-0.1, -0.2, 0.95),
      cameraPos: new THREE.Vector3(-0.3, -0.1, 3.2),
      targetPos: new THREE.Vector3(-0.1, -0.2, 0.95),
      clinicalNote: 'Muscular division between left and right ventricles. Houses high-speed His-Purkinje conduction fascicles coordinating synchronous biventricular contraction.',
      status: 'Synchronous Activation',
      perfusion: 'Septal Perforator Arteries',
      vessel: 'Septal Branches'
    }
  ];

  // 1. Initialize Three.js Scene, Cameras, Shaders, PBR Lighting
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x030712, 0.032);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    camera.position.copy(targetCamPos.current);
    cameraRef.current = camera;

    // Clipping plane for cross-section view
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0.2);
    clippingPlaneRef.current = clipPlane;

    // PBR Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;

    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // High-Dynamic Range Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3-Point Medical Studio Lighting
    const ambientLight = new THREE.HemisphereLight(0x06b6d4, 0x1e1b4b, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keyLight.position.set(4.5, 7.5, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x38bdf8, 2.2);
    cyanRim.position.set(-5, 4.5, -4);
    scene.add(cyanRim);

    const roseUnderglow = new THREE.PointLight(0xe11d48, 1.8, 10);
    roseUnderglow.position.set(0, -2.5, 1.2);
    scene.add(roseUnderglow);

    // Contact shadow floor
    const shadowGeo = new THREE.PlaneGeometry(9, 9);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.42,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.95;
    scene.add(shadowPlane);

    // Cardiac Group Root
    const heartGroup = new THREE.Group();
    heartGroupRef.current = heartGroup;
    scene.add(heartGroup);

    // Procedural Anatomical Myocardium Materials
    const normalMap = createMyocardiumNormalMap();
    normalMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const initialMyoTexture = createMyocardiumTexture(visualMode);
    initialMyoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Photorealistic PBR Myocardium Material with wet pericardial clearcoat
    const myocardiumMat = new THREE.MeshPhysicalMaterial({
      color: 0x991b1b,
      map: initialMyoTexture,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.45, 0.45),
      roughness: 0.30,
      metalness: 0.05,
      clearcoat: 0.92,
      clearcoatRoughness: 0.16,
      ior: 1.48,
      wireframe: wireframeMode
    });
    materialsRef.current.push(myocardiumMat);

    const atriaMat = new THREE.MeshPhysicalMaterial({
      color: 0x881337,
      map: initialMyoTexture,
      roughness: 0.40,
      metalness: 0.06,
      clearcoat: 0.75,
      wireframe: wireframeMode
    });
    materialsRef.current.push(atriaMat);

    const aortaMat = new THREE.MeshPhysicalMaterial({
      color: 0xbe123c,
      roughness: 0.20,
      metalness: 0.14,
      clearcoat: 0.88,
      clearcoatRoughness: 0.14,
      wireframe: wireframeMode
    });
    materialsRef.current.push(aortaMat);

    const pulmonaryMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7, // Deoxygenated pulmonary cyan/blue
      roughness: 0.26,
      metalness: 0.12,
      clearcoat: 0.75,
      wireframe: wireframeMode
    });
    materialsRef.current.push(pulmonaryMat);

    const coronaryArteryMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.15,
      metalness: 0.25,
      wireframe: wireframeMode
    });
    materialsRef.current.push(coronaryArteryMat);

    // Cobalt-Chromium Laser-Cut Drug-Eluting Stent Material
    const stentMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.98,
      roughness: 0.08,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      clearcoat: 1.0,
      reflectivity: 0.98
    });
    materialsRef.current.push(stentMat);

    // Ventricular Myocardial Geometry
    const apexShape = new THREE.Shape();
    apexShape.moveTo(0, 0.45);
    apexShape.bezierCurveTo(-0.75, 0.75, -1.35, 0.15, -1.15, -0.6);
    apexShape.bezierCurveTo(-0.95, -1.35, 0, -1.8, 0, -1.9);
    apexShape.bezierCurveTo(0, -1.8, 0.95, -1.35, 1.15, -0.6);
    apexShape.bezierCurveTo(1.35, 0.15, 0.75, 0.75, 0, 0.45);

    const extrudeSettings = {
      depth: 1.45,
      bevelEnabled: true,
      bevelSegments: 16,
      steps: 6,
      bevelSize: 0.48,
      bevelThickness: 0.55
    };

    const apexGeo = new THREE.ExtrudeGeometry(apexShape, extrudeSettings);
    apexGeo.center();
    const apexMesh = new THREE.Mesh(apexGeo, myocardiumMat);
    apexMesh.castShadow = true;
    apexMesh.receiveShadow = true;
    proceduralHeartMeshRef.current = apexMesh;
    heartGroup.add(apexMesh);

    // Left Atrium
    const leftAtriumGeo = new THREE.SphereGeometry(0.70, 36, 28);
    leftAtriumGeo.scale(1.15, 0.88, 0.92);
    const leftAtrium = new THREE.Mesh(leftAtriumGeo, atriaMat);
    leftAtrium.position.set(-0.78, 0.82, -0.2);
    leftAtrium.castShadow = true;
    heartGroup.add(leftAtrium);

    // Right Atrium
    const rightAtriumGeo = new THREE.SphereGeometry(0.74, 36, 28);
    rightAtriumGeo.scale(1.22, 0.92, 1.05);
    const rightAtrium = new THREE.Mesh(rightAtriumGeo, atriaMat);
    rightAtrium.position.set(0.90, 0.74, 0.12);
    rightAtrium.castShadow = true;
    heartGroup.add(rightAtrium);

    // Aortic Arch & Supra-Aortic Branches
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.1, 0.6, 0.2),
      new THREE.Vector3(-0.05, 1.25, 0.32),
      new THREE.Vector3(0.2, 1.62, 0.15),
      new THREE.Vector3(0.55, 1.48, -0.32),
      new THREE.Vector3(0.58, 0.72, -0.65)
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 42, 0.35, 24, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
    aortaMesh.castShadow = true;
    heartGroup.add(aortaMesh);

    // 3 Supra-Aortic Branches
    const branches = [
      { start: new THREE.Vector3(0.05, 1.5, 0.26), end: new THREE.Vector3(0.12, 2.08, 0.32), radius: 0.085 },
      { start: new THREE.Vector3(0.22, 1.58, 0.18), end: new THREE.Vector3(0.32, 2.12, 0.22), radius: 0.075 },
      { start: new THREE.Vector3(0.38, 1.55, 0.02), end: new THREE.Vector3(0.48, 2.06, 0.04), radius: 0.075 }
    ];
    branches.forEach(b => {
      const curve = new THREE.CatmullRomCurve3([b.start, b.end]);
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, b.radius, 14, false), aortaMat);
      heartGroup.add(mesh);
    });

    // Pulmonary Trunk and Bilateral Arteries
    const pulmonaryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.22, 0.52, 0.48),
      new THREE.Vector3(0.06, 1.08, 0.42),
      new THREE.Vector3(-0.36, 1.18, 0.12),
      new THREE.Vector3(-0.85, 1.12, -0.38)
    ]);
    const pulmonaryMesh = new THREE.Mesh(new THREE.TubeGeometry(pulmonaryCurve, 36, 0.29, 20, false), pulmonaryMat);
    pulmonaryMesh.castShadow = true;
    heartGroup.add(pulmonaryMesh);

    const rightPulmonaryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.06, 1.08, 0.42),
      new THREE.Vector3(0.5, 1.15, -0.1),
      new THREE.Vector3(0.95, 1.05, -0.4)
    ]);
    const rightPulmonaryMesh = new THREE.Mesh(new THREE.TubeGeometry(rightPulmonaryCurve, 20, 0.22, 16, false), pulmonaryMat);
    heartGroup.add(rightPulmonaryMesh);

    // Superior Vena Cava
    const svcCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.98, 0.85, 0.02),
      new THREE.Vector3(0.92, 1.78, -0.12)
    ]);
    const svcMesh = new THREE.Mesh(new THREE.TubeGeometry(svcCurve, 18, 0.25, 18, false), pulmonaryMat);
    heartGroup.add(svcMesh);

    // Coronary Arteries (LAD, Diagonal D1, Circumflex LCX, Right Coronary RCA)
    const ladCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, 0.8, 0.82),
      new THREE.Vector3(-0.36, 0.48, 1.12),
      new THREE.Vector3(-0.45, 0.15, 1.25), // Stent location
      new THREE.Vector3(-0.54, -0.25, 1.22),
      new THREE.Vector3(-0.46, -0.72, 1.06),
      new THREE.Vector3(-0.26, -1.22, 0.86),
      new THREE.Vector3(0.0, -1.6, 0.62)
    ]);
    const ladMesh = new THREE.Mesh(new THREE.TubeGeometry(ladCurve, 48, 0.070, 16, false), coronaryArteryMat);
    heartGroup.add(ladMesh);

    const d1Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.36, 0.48, 1.12),
      new THREE.Vector3(-0.68, 0.2, 1.05),
      new THREE.Vector3(-0.95, -0.15, 0.75)
    ]);
    heartGroup.add(new THREE.Mesh(new THREE.TubeGeometry(d1Curve, 20, 0.046, 12, false), coronaryArteryMat));

    const rcaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.32, 0.62, 0.72),
      new THREE.Vector3(0.68, 0.32, 0.92),
      new THREE.Vector3(0.88, -0.22, 0.78),
      new THREE.Vector3(0.72, -0.85, 0.52)
    ]);
    heartGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rcaCurve, 32, 0.064, 14, false), coronaryArteryMat));

    // Mid-LAD Drug-Eluting Stent
    const stentSegmentCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, 0.28, 1.2),
      new THREE.Vector3(-0.48, 0.02, 1.26)
    ]);
    const stentGeo = new THREE.TubeGeometry(stentSegmentCurve, 26, 0.095, 18, false);
    const stentMesh = new THREE.Mesh(stentGeo, stentMat);
    stentMeshRef.current = stentMesh;
    heartGroup.add(stentMesh);

    // Dynamic Blood Particles System (Oxygenated + Deoxygenated)
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const isOxygenated = i % 2 === 0;
      const t = Math.random();
      const point = isOxygenated ? aortaCurve.getPoint(t) : pulmonaryCurve.getPoint(t);
      particlePositions[i * 3] = point.x + (Math.random() - 0.5) * 0.16;
      particlePositions[i * 3 + 1] = point.y + (Math.random() - 0.5) * 0.16;
      particlePositions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 0.16;

      if (isOxygenated) {
        particleColors[i * 3] = 1.0;
        particleColors[i * 3 + 1] = 0.22;
        particleColors[i * 3 + 2] = 0.38;
      } else {
        particleColors[i * 3] = 0.08;
        particleColors[i * 3 + 1] = 0.72;
        particleColors[i * 3 + 2] = 1.0;
      }
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const bloodParticles = new THREE.Points(particleGeo, particleMat);
    bloodParticlesRef.current = bloodParticles;
    heartGroup.add(bloodParticles);

    // Conduction System (Purkinje fibers)
    const conductionPoints = [
      new THREE.Vector3(0.95, 0.6, 0.35), new THREE.Vector3(0.1, 0.3, 0.4), // SA to AV
      new THREE.Vector3(0.1, 0.3, 0.4), new THREE.Vector3(0.0, -0.1, 0.6),  // AV to His
      new THREE.Vector3(0.0, -0.1, 0.6), new THREE.Vector3(-0.3, -0.7, 0.7), // Left bundle
      new THREE.Vector3(0.0, -0.1, 0.6), new THREE.Vector3(0.3, -0.7, 0.6),  // Right bundle
      new THREE.Vector3(-0.3, -0.7, 0.7), new THREE.Vector3(-0.5, -1.3, 0.5), // Purkinje LV
      new THREE.Vector3(0.3, -0.7, 0.6), new THREE.Vector3(0.4, -1.2, 0.4)    // Purkinje RV
    ];
    const conductionGeo = new THREE.BufferGeometry().setFromPoints(conductionPoints);
    const conductionMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
      transparent: true,
      opacity: 0.85
    });
    const conductionLines = new THREE.LineSegments(conductionGeo, conductionMat);
    conductionLinesRef.current = conductionLines;
    heartGroup.add(conductionLines);

    renderer.compile(scene, camera);

    // Interactive Drag Orbit Controls with Inertia
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !heartGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rotationVelocityY = deltaX * 0.007;
      rotationVelocityX = deltaY * 0.007;

      heartGroupRef.current.rotation.y += rotationVelocityY;
      heartGroupRef.current.rotation.x += rotationVelocityX;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.0035;
      targetCamPos.current.z = Math.min(8.5, Math.max(2.4, targetCamPos.current.z + zoomFactor));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop with Physiological Systolic & Diastolic Cycle
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let lastAudioTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Dual-phase cardiac cycle (atrial kick + ventricular ejection)
      const bps = bpm / 60;
      const beatPhase = (time * bps * Math.PI * 2) % (Math.PI * 2);
      
      let pulseScale = 1.0;
      const p1 = Math.sin(beatPhase);
      const p2 = Math.sin(beatPhase * 2 + 0.3);

      if (p1 > 0.4) {
        pulseScale = 1.0 + Math.pow(p1, 4) * 0.085;
      } else if (p2 > 0.5) {
        pulseScale = 1.0 + Math.pow(p2, 3) * 0.045;
      }

      // Audio heartbeat triggers (S1 and S2 sound synched to mechanical contraction)
      if (isPlayingAudio) {
        const beatInterval = 60 / bpm;
        if (time - lastAudioTime > beatInterval) {
          lastAudioTime = time;
          playStethoscopeSound('S1', activeScenario === 'severe_cad');
          setTimeout(() => {
            playStethoscopeSound('S2');
          }, 240);
        }
      }

      if (heartGroupRef.current) {
        heartGroupRef.current.scale.set(pulseScale, pulseScale, pulseScale);

        if (autoRotate && !isDragging) {
          heartGroupRef.current.rotation.y += 0.0035;
        }

        if (!isDragging) {
          rotationVelocityX *= 0.92;
          rotationVelocityY *= 0.92;
          heartGroupRef.current.rotation.x += rotationVelocityX;
          heartGroupRef.current.rotation.y += rotationVelocityY;
        }
      }

      // Stent metallic glow pulse
      if (stentMeshRef.current) {
        const emissivePulse = activeScenario === 'patent_stent' 
          ? 0.55 + Math.sin(time * 3.5) * 0.35
          : 0.15;
        (stentMeshRef.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = emissivePulse;
      }

      // Conduction system electrical glow
      if (conductionLinesRef.current) {
        const condPulse = (Math.sin(beatPhase * 2) + 1) * 0.5;
        (conductionLinesRef.current.material as THREE.LineBasicMaterial).opacity = 0.3 + condPulse * 0.65;
      }

      // Camera Damping
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 4.0, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 4.0, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 4.0, delta);

      currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookAt.current.x, 4.0, delta);
      currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookAt.current.y, 4.0, delta);
      currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookAt.current.z, 4.0, delta);
      camera.lookAt(currentLookAt.current);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);

      renderer.dispose();
      materialsRef.current.forEach(m => m.dispose());
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update scene fog on theme change
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.fog = new THREE.FogExp2(isDark ? 0x030712 : 0xf1f5f9, 0.032);
    }
  }, [isDark]);

  // 2. Real-Time ECG Oscilloscope Sweep synced to BPM & Theme
  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const bgCol = isDark ? '#030712' : '#ffffff';
    const gridCol = isDark ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.16)';

    // Clear background
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, width, height);

    // Draw background ECG grid
    ctx.strokeStyle = gridCol;
    ctx.lineWidth = 1;
    for (let gx = 0; gx < width; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy < height; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    let prevX = 0;
    let prevY = centerY;

    const renderEcg = () => {
      animId = requestAnimationFrame(renderEcg);
      const sweepSpeed = (bpm / 60) * 3.8;
      
      const newX = (x + sweepSpeed) % width;
      if (newX < x) {
        // Wrap around: clear trailing section
        prevX = 0;
      }
      x = newX;

      // Erase trail ahead of the beam
      ctx.fillStyle = bgCol;
      ctx.fillRect(x, 0, 18, height);

      // Compute P-Q-R-S-T wave based on position in cardiac cycle
      const cycleLength = width / (bpm / 30);
      const posInCycle = (x % cycleLength) / cycleLength;

      let yOffset = 0;
      if (posInCycle > 0.15 && posInCycle < 0.22) {
        // P-wave (atrial depolarization)
        yOffset = -Math.sin((posInCycle - 0.15) / 0.07 * Math.PI) * 10;
      } else if (posInCycle >= 0.26 && posInCycle < 0.28) {
        // Q-wave
        yOffset = 5;
      } else if (posInCycle >= 0.28 && posInCycle < 0.32) {
        // R-wave (ventricular depolarization spike)
        const stemiElevation = activeScenario === 'acute_ischemia' ? 12 : 0;
        yOffset = -Math.sin((posInCycle - 0.28) / 0.04 * Math.PI) * (42 + stemiElevation);
      } else if (posInCycle >= 0.32 && posInCycle < 0.35) {
        // S-wave
        yOffset = 12;
      } else if (posInCycle >= 0.42 && posInCycle < 0.58) {
        // T-wave (ventricular repolarization)
        const tWaveInverted = activeScenario === 'acute_ischemia' ? -1 : 1;
        yOffset = -Math.sin((posInCycle - 0.42) / 0.16 * Math.PI) * (14 * tWaveInverted);
      }

      const curY = centerY + yOffset;

      // Draw phosphor glowing beam
      ctx.shadowBlur = 8;
      ctx.shadowColor = activeScenario === 'acute_ischemia' ? '#f43f5e' : '#06b6d4';
      ctx.strokeStyle = activeScenario === 'acute_ischemia' ? '#f43f5e' : '#22d3ee';
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, curY);
      ctx.stroke();

      ctx.shadowBlur = 0;
      prevX = x;
      prevY = curY;
    };

    renderEcg();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [bpm, activeScenario, isDark]);

  // 3. Update Wireframe Mode
  useEffect(() => {
    materialsRef.current.forEach(mat => {
      (mat as any).wireframe = wireframeMode;
    });
  }, [wireframeMode]);

  // 4. Update Visual Texture Mode & Ischemia Scenarios
  useEffect(() => {
    if (!rendererRef.current) return;
    const isHeatmap = visualMode === 'heatmap' || visualMode === 'stent_reperfusion';
    const effectiveMode = activeScenario === 'acute_ischemia' ? 'ischemia' : visualMode;
    const newTexture = createMyocardiumTexture(effectiveMode);
    newTexture.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();

    materialsRef.current.forEach(mat => {
      if ((mat as THREE.MeshPhysicalMaterial).map) {
        (mat as THREE.MeshPhysicalMaterial).map = newTexture;
        mat.needsUpdate = true;
      }
    });
  }, [visualMode, activeScenario]);

  // 5. Update Blood Particles & Conduction System Visibility
  useEffect(() => {
    if (bloodParticlesRef.current) {
      bloodParticlesRef.current.visible = showBloodFlow;
    }
    if (conductionLinesRef.current) {
      conductionLinesRef.current.visible = showConduction;
    }
  }, [showBloodFlow, showConduction]);

  // 6. Cross-Section Internal Chamber Clipping
  useEffect(() => {
    if (!rendererRef.current || !clippingPlaneRef.current) return;
    if (isCrossSection) {
      rendererRef.current.clippingPlanes = [clippingPlaneRef.current];
    } else {
      rendererRef.current.clippingPlanes = [];
    }
  }, [isCrossSection]);

  // 7. Preset Camera Navigation
  const handleViewSelect = (view: 'anterior' | 'posterior' | 'lateral' | 'aorta' | 'stent') => {
    setActiveView(view);
    setActiveHotspot(null);
    if (!heartGroupRef.current) return;

    if (view === 'anterior') {
      targetCamPos.current.set(0, 0.25, 5.2);
      targetLookAt.current.set(0, 0, 0);
      heartGroupRef.current.rotation.set(0, 0, 0);
    } else if (view === 'posterior') {
      targetCamPos.current.set(0, 0.35, -5.2);
      targetLookAt.current.set(0, 0, 0);
      heartGroupRef.current.rotation.set(0, Math.PI, 0);
    } else if (view === 'lateral') {
      targetCamPos.current.set(-3.8, 0.2, 3.2);
      targetLookAt.current.set(-0.5, -0.4, 0.6);
    } else if (view === 'aorta') {
      targetCamPos.current.set(0.1, 1.8, 3.6);
      targetLookAt.current.set(0.1, 1.3, 0.2);
    } else if (view === 'stent') {
      targetCamPos.current.set(-0.85, 0.35, 3.1);
      targetLookAt.current.set(-0.45, 0.15, 1.25);
      const stentSpot = hotspots.find(h => h.id === 'stent');
      if (stentSpot) setActiveHotspot(stentSpot);
    }
  };

  // 8. Select Hotspot
  const handleSelectHotspot = (spot: Hotspot) => {
    setActiveHotspot(spot);
    targetCamPos.current.copy(spot.cameraPos);
    targetLookAt.current.copy(spot.targetPos);
  };

  // 9. Stethoscopic Auscultation Trigger
  const handleAuscultate = (pointId: string) => {
    setActiveAuscultation(pointId);
    playStethoscopeSound('S1', activeScenario === 'severe_cad');
    setTimeout(() => {
      playStethoscopeSound('S2');
    }, 240);
  };

  // 10. GLTF / GLB File Importer
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const loader = new GLTFLoader();

    loader.load(
      fileUrl,
      (gltf) => {
        if (!sceneRef.current || !heartGroupRef.current) return;

        // Hide procedural heart mesh and load custom GLB
        if (proceduralHeartMeshRef.current) {
          proceduralHeartMeshRef.current.visible = false;
        }

        // Remove previous custom GLB if any
        if (customGlbGroupRef.current) {
          heartGroupRef.current.remove(customGlbGroupRef.current);
        }

        const model = gltf.scene;
        // Compute bounding box and normalize scale
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.4 / (maxDim || 1);
        model.scale.set(scale, scale, scale);

        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center.multiplyScalar(scale));

        // Enable shadows and PBR shading on all child meshes
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              materialsRef.current.push(mesh.material as THREE.Material);
            }
          }
        });

        customGlbGroupRef.current = model;
        heartGroupRef.current.add(model);
        setLoadedFileName(file.name);
      },
      undefined,
      (error) => {
        console.error('Error loading custom GLB/GLTF model:', error);
      }
    );
  };

  // 11. Export Current 3D Heart as Real .GLB File
  const handleExportGlb = () => {
    if (!heartGroupRef.current) return;
    setIsExportingGlb(true);

    const exporter = new GLTFExporter();
    exporter.parse(
      heartGroupRef.current,
      (gltf) => {
        const output = gltf instanceof ArrayBuffer ? gltf : JSON.stringify(gltf, null, 2);
        const blob = new Blob([output], { type: 'model/gltf-binary' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `cardiolens_3d_heart_${activeScenario}_${bpm}bpm.glb`;
        link.click();
        URL.revokeObjectURL(link.href);
        setIsExportingGlb(false);
      },
      (error) => {
        console.error('GLTF Export failed:', error);
        setIsExportingGlb(false);
      },
      { binary: true }
    );
  };

  // 12. Snapshot Capture (High-Res PNG with medical metadata)
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `CardioLens_Anatomical_Capture_${Date.now()}.png`;
    link.click();
  };

  // Reset to default procedural anatomical model
  const handleResetToDefaultModel = () => {
    if (customGlbGroupRef.current && heartGroupRef.current) {
      heartGroupRef.current.remove(customGlbGroupRef.current);
      customGlbGroupRef.current = null;
    }
    if (proceduralHeartMeshRef.current) {
      proceduralHeartMeshRef.current.visible = true;
    }
    setLoadedFileName(null);
    handleViewSelect('anterior');
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const el = mountRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-2xl transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[780px]'
    }`}>
      {/* 1. TOP CLINICAL TELEMETRY STATUS BAR */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs">
        {/* Left: Patient & Case Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-semibold text-white">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>4D DIGITAL CARDIAC TWIN</span>
          </div>
          <span className="hidden md:inline-block text-slate-500">|</span>
          <div className="hidden md:flex items-center gap-2 text-slate-300">
            <span className="text-slate-400">Model:</span>
            <span className="font-mono text-cyan-400">
              {loadedFileName ? loadedFileName : 'CardioLens PBR Heart GLB (Multi-Chamber)'}
            </span>
          </div>
          <span className="hidden lg:inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium">
            LAD Stent Patent (100% Flow)
          </span>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Audio Auscultation Toggle */}
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition ${
              isPlayingAudio 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20' 
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Stethoscopic Audio Auscultation (S1 / S2 sounds)"
          >
            {isPlayingAudio ? <Volume2 className="h-3.5 w-3.5 text-rose-400" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'Auscultating' : 'Listen S1/S2'}</span>
          </button>

          {/* Export .GLB Button */}
          <button
            onClick={handleExportGlb}
            disabled={isExportingGlb}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-medium transition disabled:opacity-50"
            title="Download the current 3D Heart as a real standard .GLB file"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{isExportingGlb ? 'Exporting...' : 'Export .GLB'}</span>
          </button>

          {/* Snapshot Button */}
          <button
            onClick={handleCaptureSnapshot}
            className="p-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition"
            title="Capture high-resolution medical snapshot"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Theater'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. THREE.JS 3D CANVAS VIEWPORT */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* 3. FLOATING INTERACTIVE 3D HOTSPOT LABELS (Anatomical Overlay) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            onClick={() => handleSelectHotspot(spot)}
            className={`pointer-events-auto absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
              activeHotspot?.id === spot.id ? 'scale-110 z-20' : 'hover:scale-105 opacity-80 hover:opacity-100'
            }`}
            style={{
              // Approximate responsive 2D screen projections for resting anterior orientation
              top: spot.id === 'aorta' ? '24%' :
                   spot.id === 'sa_node' ? '34%' :
                   spot.id === 'stent' ? '46%' :
                   spot.id === 'septum' ? '54%' : '66%',
              left: spot.id === 'aorta' ? '52%' :
                    spot.id === 'sa_node' ? '68%' :
                    spot.id === 'stent' ? '42%' :
                    spot.id === 'septum' ? '50%' : '38%'
            }}
          >
            <div className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-cyan-400/80 rounded-full pl-1.5 pr-2.5 py-1 text-[11px] font-medium text-white shadow-xl backdrop-blur-md">
              <span className={`h-2.5 w-2.5 rounded-full ${
                spot.id === 'stent' 
                  ? 'bg-cyan-400 animate-ping' 
                  : 'bg-rose-500'
              }`}></span>
              <span className="hidden sm:inline">{spot.name}</span>
              <span className="sm:hidden">{spot.id.toUpperCase()}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 4. CLINICAL HOTSPOT DIAGNOSTIC DRAWER (When a Hotspot is selected) */}
      {activeHotspot && (
        <div className="absolute top-14 left-4 sm:left-6 max-w-sm z-30 bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400">
                <Crosshair className="h-3.5 w-3.5" />
                <span>ANATOMICAL TARGET</span>
              </div>
              <h4 className="font-bold text-white text-sm">{activeHotspot.name}</h4>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-xs"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300">
              <p className="leading-relaxed">{activeHotspot.clinicalNote}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block">Hemodynamic Status</span>
                <span className="font-semibold text-emerald-400">{activeHotspot.status}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block">Perfusion Index</span>
                <span className="font-semibold text-cyan-300">{activeHotspot.perfusion}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">Supplying Vessel: <strong className="text-slate-200">{activeHotspot.vessel}</strong></span>
              <button
                onClick={() => handleViewSelect('anterior')}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Reset Camera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING HUD CONTROLS COCKPIT (Right Sidebar) */}
      <div className="absolute top-14 right-4 sm:right-6 z-20 flex flex-col gap-3 max-w-[280px] w-full pointer-events-none">
        {/* Navigation Tabs */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-1.5 flex items-center justify-between text-xs font-medium text-slate-400 shadow-xl">
          <button
            onClick={() => setActiveTab('perfusion')}
            className={`flex-1 py-1 px-2 rounded-xl transition flex items-center justify-center gap-1 ${
              activeTab === 'perfusion' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'hover:text-white'
            }`}
          >
            <Flame className="h-3 w-3 text-amber-400" />
            <span>Heat</span>
          </button>
          <button
            onClick={() => setActiveTab('anatomy')}
            className={`flex-1 py-1 px-2 rounded-xl transition flex items-center justify-center gap-1 ${
              activeTab === 'anatomy' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'hover:text-white'
            }`}
          >
            <Layers className="h-3 w-3 text-rose-400" />
            <span>Layers</span>
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 py-1 px-2 rounded-xl transition flex items-center justify-center gap-1 ${
              activeTab === 'telemetry' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'hover:text-white'
            }`}
          >
            <Activity className="h-3 w-3 text-emerald-400" />
            <span>Vitals</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-1 px-2 rounded-xl transition flex items-center justify-center gap-1 ${
              activeTab === 'audio' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'hover:text-white'
            }`}
          >
            <Stethoscope className="h-3 w-3 text-blue-400" />
            <span>Listen</span>
          </button>
        </div>

        {/* Tab 1: 3D HEATMAP & ISCHEMIA PERFUSION SUITE */}
        {activeTab === 'perfusion' && (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-xl space-y-3 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-400" />
                <span>3D Heatmap Perfusion</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">SPECT/PET</span>
            </div>

            {/* Visual Color-Graded Legend */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>0% Ischemia</span>
                <span>50%</span>
                <span className="text-rose-400 font-semibold">100% Hyperemia</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gradient-to-r from-blue-700 via-cyan-500 via-emerald-500 via-yellow-400 to-rose-600 border border-slate-700"></div>
            </div>

            {/* Ischemia Scenario Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-300">Clinical Perfusion Scenario:</label>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => {
                    setActiveScenario('patent_stent');
                    setVisualMode('heatmap');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-left transition flex items-center justify-between ${
                    activeScenario === 'patent_stent' 
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-semibold' 
                      : 'bg-slate-950/60 border border-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>1. Reperfused Stent (Normal)</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </button>

                <button
                  onClick={() => {
                    setActiveScenario('acute_ischemia');
                    setVisualMode('ischemia');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-left transition flex items-center justify-between ${
                    activeScenario === 'acute_ischemia' 
                      ? 'bg-rose-500/25 border border-rose-500/60 text-rose-300 font-semibold' 
                      : 'bg-slate-950/60 border border-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-rose-300">2. Acute Mid-LAD Ischemia</span>
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                </button>

                <button
                  onClick={() => {
                    setActiveScenario('stress_hyperemia');
                    setVisualMode('stent_reperfusion');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-left transition flex items-center justify-between ${
                    activeScenario === 'stress_hyperemia' 
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold' 
                      : 'bg-slate-950/60 border border-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>3. Peak Stress Hyperemia</span>
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Custom GLB Upload */}
            <div className="pt-1 border-t border-slate-800/80">
              <input
                ref={fileInputRef}
                type="file"
                accept=".glb,.gltf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-1.5 px-3 bg-slate-950 hover:bg-slate-800 border border-dashed border-cyan-500/40 rounded-xl text-cyan-300 font-medium flex items-center justify-center gap-1.5 transition text-xs"
              >
                <Upload className="h-3.5 w-3.5 text-cyan-400" />
                <span>Upload Custom .GLB Heart</span>
              </button>
              {loadedFileName && (
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[180px]">{loadedFileName}</span>
                  <button onClick={handleResetToDefaultModel} className="text-rose-400 hover:underline">
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: ANATOMICAL LAYERS & CLIPPING */}
        {activeTab === 'anatomy' && (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-xl space-y-3 text-xs animate-in fade-in duration-150">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Anatomical Layers & Slices</span>
            </span>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Blood Flow Particles</span>
                <input
                  type="checkbox"
                  checked={showBloodFlow}
                  onChange={(e) => setShowBloodFlow(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Conduction System (His/Purkinje)</span>
                <input
                  type="checkbox"
                  checked={showConduction}
                  onChange={(e) => setShowConduction(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Internal Cavity Cross-Section</span>
                <input
                  type="checkbox"
                  checked={isCrossSection}
                  onChange={(e) => setIsCrossSection(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Wireframe Polygon Grid</span>
                <input
                  type="checkbox"
                  checked={wireframeMode}
                  onChange={(e) => setWireframeMode(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                <span className="text-slate-300">Smooth 360° Gyro Orbit</span>
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700"
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 3: BIOMETRIC VITALS & HEMODYNAMICS */}
        {activeTab === 'telemetry' && (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-xl space-y-3 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>Cardiac Hemodynamics</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">LIVE SYNC</span>
            </div>

            {/* Heart Rate Slider */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Heart Rate</span>
                <span className="font-mono font-bold text-rose-400 text-sm">{bpm} BPM</span>
              </div>
              <input
                type="range"
                min="45"
                max="160"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>45 Brady</span>
                <span>60-100 Normal</span>
                <span>160 Tachy</span>
              </div>
            </div>

            {/* Key Telemetry Readouts */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">Ejection Fraction</span>
                <span className="font-bold text-emerald-400 text-sm">62% (Normal)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">Cardiac Output</span>
                <span className="font-bold text-cyan-300 text-sm">5.2 L/min</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">Stroke Volume</span>
                <span className="font-bold text-slate-200">76 mL/beat</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">Blood Pressure</span>
                <span className="font-bold text-slate-200">118/76 mmHg</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: STETHOSCOPIC AUSCULTATION (Audio Heart Sounds) */}
        {activeTab === 'audio' && (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-xl space-y-3 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4 text-cyan-400" />
                <span>Phonocardiogram Auscultation</span>
              </span>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`p-1 rounded-lg ${isPlayingAudio ? 'text-rose-400' : 'text-slate-500'}`}
              >
                {isPlayingAudio ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Select an anatomical listening landmark to auscultate physiological valve closure sounds (S1 Lub and S2 Dub):
            </p>

            <div className="space-y-1.5">
              {auscultationPoints.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => handleAuscultate(pt.id)}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-left transition flex items-center justify-between ${
                    activeAuscultation === pt.id 
                      ? 'bg-cyan-500/20 border border-cyan-500/60 text-cyan-300 font-semibold' 
                      : 'bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div>
                    <span className="block font-medium">{pt.name}</span>
                    <span className="text-[10px] text-slate-500">{pt.sound}</span>
                  </div>
                  <Radio className={`h-3.5 w-3.5 ${activeAuscultation === pt.id ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. BOTTOM SYNCHRONIZED ECG OSCILLOSCOPE STRIP & VIEW SWITCHER */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none">
        {/* Real-time Synced ECG Rhythm Canvas */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-2.5 shadow-2xl flex items-center gap-3 w-full md:w-auto">
          <div className="shrink-0 flex items-center gap-2 px-1 text-xs">
            <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono">LEAD II ECG</div>
              <div className="font-bold text-white font-mono text-xs">{bpm} BPM · SINUS</div>
            </div>
          </div>
          <canvas
            ref={ecgCanvasRef}
            width={240}
            height={44}
            className="w-[200px] sm:w-[240px] h-[44px] rounded-lg border border-slate-900 bg-slate-950"
          />
        </div>

        {/* Camera Preset View Switcher Bar */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-1.5 flex items-center gap-1 shadow-2xl overflow-x-auto max-w-full text-xs">
          <button
            onClick={() => handleViewSelect('anterior')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
              activeView === 'anterior' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Anterior (Front)
          </button>
          <button
            onClick={() => handleViewSelect('posterior')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
              activeView === 'posterior' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Posterior (Back)
          </button>
          <button
            onClick={() => handleViewSelect('lateral')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
              activeView === 'lateral' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            LV Apex
          </button>
          <button
            onClick={() => handleViewSelect('aorta')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
              activeView === 'aorta' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Aortic Arch
          </button>
          <button
            onClick={() => handleViewSelect('stent')}
            className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              activeView === 'stent' 
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold' 
                : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>LAD Stent</span>
          </button>
        </div>
      </div>
    </div>
  );
};
