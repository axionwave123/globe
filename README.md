# GLOBE — Kinetic RGB LED Engineering Lab

> A genuinely immersive, real-time 3D interactive experience built with **React Three Fiber** and **Three.js**.

![GLOBE](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-000000?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## The Experience

This is **not** a 2D website with 3D decorations.

**GLOBE** is a fully interactive 3D engineering laboratory centered around a kinetic RGB LED advertising machine:

- **Individual LED panels** modeled with real geometry, metallic frames, emissive surfaces and selection rings
- **Mechanical kinetic sections** that fold, expand and wave in synchronized real-time animation
- **Three concentric rotating rings** of LED modules
- **Click any panel** to select it — the control studio updates instantly
- **Change color & intensity** of any panel and see the 3D model respond in real time
- **Drive the mechanics**: arm fold angle, expand factor, rotation, animation speed
- **Full camera freedom**: orbit, zoom, drag, inspect from every angle
- **Cinematic rendering**: ACES tone mapping, bloom, chromatic aberration, contact shadows, environment reflections, stars

The entire experience feels like standing inside a futuristic 3D engineering lab.

## Tech Stack

| Layer | Technology |
|-------|------------|
| 3D Engine | Three.js |
| React Renderer | @react-three/fiber |
| Helpers | @react-three/drei |
| Post-processing | @react-three/postprocessing |
| Controls UI | leva |
| State | zustand |
| Build | Vite + TypeScript |

## Getting Started

```bash
# Clone
git clone https://github.com/axionwave123/globe.git
cd globe

# Install
npm install

# Run the lab
npm run dev
```

Open the local URL (usually `http://localhost:5173`) and start exploring.

## Controls

| Action | How |
|--------|-----|
| Rotate / Inspect | Left-drag |
| Zoom | Scroll / Pinch |
| Pan | Right-drag |
| Select LED Panel | Click any panel |
| Change color / intensity | Use the **SELECTED PANEL** section in the control studio (top-right) |
| Kinetic animation | Toggle, speed, arm fold & expand in the **KINETIC MECHANICS** panel |
| Global lighting & bloom | **ENGINEERING LAB** panel |

## Project Structure

```
src/
├── components/
│   ├── KineticMachine.tsx   # Fully modeled machine with rings + kinetic arms
│   ├── LEDPanel.tsx         # Individual interactive LED geometry
│   ├── Scene.tsx            # Canvas, lights, post-FX, OrbitControls
│   └── ControlStudio.tsx    # Real-time leva control panel
├── store.ts                 # Zustand store — all state is live-bound to the 3D scene
├── App.tsx
├── main.tsx
└── index.css
```

## Philosophy

Every visual element is real 3D geometry. No flat images, no pre-rendered video, no CSS 3D tricks. The machine is built from cylinders, boxes, toruses and spheres with physically-based materials, emissive LED surfaces, shadows and reflections. All controls write into a shared store that the 3D scene reads on every frame.

---

**GLOBE** — Built for the future of interactive 3D on the web.