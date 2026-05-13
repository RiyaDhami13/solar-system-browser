# ☀ Solar System Browser -- 3D

An interactive 3D solar system simulation built with Three.js and custom GLSL shaders.

🔗 **[Live Demo](https://riyadhami13.github.io/solar-system-browser/)**

---

##Features

- **Custom GLSL sun shader** — animated procedural noise gives the sun a realistic fiery surface
- **All 8 planets** orbiting in real time with accurate axial tilts and relative speeds
- **Saturn's rings** rendered with double-sided geometry
- **Starfield** of 2000 stars filling the background
- **Click any planet** to fly the camera to it and open an info panel
- **Info panel** with three tabs per planet — Facts, Milestones, and Did You Know
- **Drag to orbit** the camera around the solar system
- **Scroll to zoom** in and out
- **Pause / Resume** and **Reset View** controls

----

##Built With

- [Three.js r128](https://threejs.org/) — 3D rendering
- GLSL — custom vertex and fragment shaders for the sun
- Vanilla HTML, CSS, JavaScript — no build tools or frameworks

-----

## How to Run Locally
 
Just open `index.html` in a browser — no install needed.
 
```bash
git clone https://github.com/RiyaDhami13/solar-system-browser.git
cd solar-system-browser
open index.html
```
 
---
 
## Controls
 
| Action | Control |
|---|---|
| Orbit camera | Click and drag |
| Zoom | Scroll wheel |
| Inspect planet | Click on it |
| Close panel | × button |
| Pause animation | Pause button |
| Reset camera | Reset View button |
 
---
 
## Project Structure
 
```
index.html       — everything (HTML, CSS, JS, GLSL shaders)
```
 
---
 
*Built for Hack Club — Week 2 project*
