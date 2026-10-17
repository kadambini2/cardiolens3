import * as THREE from 'three';

export type PerfusionVisualMode = 
  | 'anatomical' 
  | 'heatmap' 
  | 'ischemia' 
  | 'stent_reperfusion' 
  | 'angiogram';

/**
 * Procedurally generates high-resolution photorealistic textures
 * for anatomical cardiac myocardium, SPECT/PET thermal heatmaps,
 * acute ischemia patterns, and coronary angiograms.
 */
export function createMyocardiumTexture(
  mode: PerfusionVisualMode | boolean = 'anatomical',
  ischemiaSeverity: number = 0 // 0 = fully healthy, 1.0 = severe infarct/hypoxia
): THREE.CanvasTexture {
  const visualMode: PerfusionVisualMode = 
    typeof mode === 'boolean' ? (mode ? 'heatmap' : 'anatomical') : mode;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  if (visualMode === 'heatmap' || visualMode === 'stent_reperfusion') {
    // CLINICAL THERMAL / PERFUSION HEATMAP (SPECT/PET Cardiac Ischemia Gradient)
    // Dark Blue (0% Flow) -> Cyan (25%) -> Green (50%) -> Yellow (75%) -> Bright Crimson/Gold (100% Hyperemic Flow)
    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0.0, '#1e3a8a'); // 0% Severe Hypoperfusion
    grad.addColorStop(0.2, '#0284c7'); // 25% Subendocardial baseline
    grad.addColorStop(0.4, '#059669'); // 50% Moderate baseline
    grad.addColorStop(0.65, '#eab308'); // 75% Normal myocardium
    grad.addColorStop(0.85, '#f97316'); // 90% Hyperemia
    grad.addColorStop(1.0, '#ef4444'); // 100% Stented LAD Reperfusion Peak

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Dynamic Iso-perfusion Contours
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 3;
    for (let r = 80; r < 850; r += 110) {
      ctx.beginPath();
      ctx.arc(430, 520, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Warm reperfusion hotspot over LAD stent territory (stent revascularization zone)
    const stentGlow = ctx.createRadialGradient(420, 480, 20, 420, 480, 240);
    stentGlow.addColorStop(0, 'rgba(255, 230, 0, 0.85)'); // Hot gold core
    stentGlow.addColorStop(0.4, 'rgba(239, 68, 68, 0.7)');
    stentGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = stentGlow;
    ctx.beginPath();
    ctx.arc(420, 480, 240, 0, Math.PI * 2);
    ctx.fill();

    // Thermal contour grid ticks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('SPECT 100% MBF', 440, 470);
    ctx.fillText('LAD TERRITORY', 440, 495);

  } else if (visualMode === 'ischemia') {
    // ACUTE MYOCARDIAL ISCHEMIA / STEMI SIMULATION
    // Cold, hypoxic purple/blue defect zone in anterior/apical segment
    const baseGrad = ctx.createRadialGradient(512, 512, 100, 512, 512, 600);
    baseGrad.addColorStop(0, '#581c87'); // Hypoxic ischemia
    baseGrad.addColorStop(0.35, '#1e1b4b'); // Deep ischemic zone
    baseGrad.addColorStop(0.7, '#7f1d1d'); // Border zone myocardium
    baseGrad.addColorStop(1.0, '#991b1b'); // Remote viable tissue
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Ischemic cold defect focus (LAD occlusion territory)
    const ischemicDefect = ctx.createRadialGradient(420, 500, 10, 420, 500, 320);
    ischemicDefect.addColorStop(0, '#0f172a'); // Infarct core (non-viable)
    ischemicDefect.addColorStop(0.4, '#1e1b4b'); // Severe ischemia
    ischemicDefect.addColorStop(0.8, '#312e81'); // Penumbra border
    ischemicDefect.addColorStop(1, 'rgba(127, 29, 29, 0)');
    ctx.fillStyle = ischemicDefect;
    ctx.beginPath();
    ctx.arc(420, 500, 320, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(420, 500, 260, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('ISCHEMIC PENUMBRA', 320, 490);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('FLOW < 15 mL/min/100g', 320, 515);

  } else if (visualMode === 'angiogram') {
    // FLUOROSCOPIC ANGIOGRAM / CONTRAST DYE MODE
    // High-contrast translucent luminescent vascular mapping
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 1024, 1024);

    // Coronary roadmap glowing grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1024; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Contrast dye vascular density
    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.beginPath();
    ctx.ellipse(450, 480, 80, 440, Math.PI / 10, 0, Math.PI * 2);
    ctx.fill();

  } else {
    // PHOTOREALISTIC ANATOMICAL MYOCARDIUM
    // 1. Base deep crimson muscular tissue with physiological gradient
    const baseGrad = ctx.createRadialGradient(512, 480, 40, 512, 512, 620);
    baseGrad.addColorStop(0, '#991b1b'); // Healthy oxygenated muscle
    baseGrad.addColorStop(0.4, '#831843'); // Rich ventricular muscle
    baseGrad.addColorStop(0.75, '#6b1126'); // Deep myocardium
    baseGrad.addColorStop(1, '#3b0712'); // Shadowed inferolateral wall
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Fibrous muscular striations (helical spiral orientation)
    ctx.strokeStyle = 'rgba(190, 24, 93, 0.38)';
    ctx.lineWidth = 2.2;
    for (let i = 0; i < 480; i++) {
      const y = Math.random() * 1024;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(
        280, y + (Math.random() - 0.5) * 75,
        720, y + (Math.random() - 0.5) * 75,
        1024, y
      );
      ctx.stroke();
    }

    // 3. Epicardial adipose (fat deposits) along the interventricular sulcus
    ctx.fillStyle = 'rgba(254, 240, 138, 0.28)'; // Soft lipid yellow
    ctx.beginPath();
    ctx.ellipse(460, 480, 75, 430, Math.PI / 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(253, 224, 71, 0.18)';
    ctx.beginPath();
    ctx.ellipse(470, 480, 50, 390, Math.PI / 12, 0, Math.PI * 2);
    ctx.fill();

    // 4. Microvascular capillary networks (delicate branching arterioles)
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.65)';
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 45; i++) {
      let x = 380 + Math.random() * 200;
      let y = 80 + Math.random() * 850;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let s = 0; s < 5; s++) {
        x += (Math.random() - 0.28) * 45;
        y += (Math.random() - 0.1) * 40;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generates an organic normal map for realistic micro-roughness
 */
export function createMyocardiumNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Neutral normal map base: RGB (128, 128, 255)
  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 36;
    data[i] = Math.min(255, Math.max(0, 128 + noise));     // Red (X normal)
    data[i + 1] = Math.min(255, Math.max(0, 128 + noise)); // Green (Y normal)
    data[i + 2] = 255;                                     // Blue (Z normal)
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
