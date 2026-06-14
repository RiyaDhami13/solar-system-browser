# Solar System Browser 3D

A 3D solar system simulation I built using Three.js and custom GLSL shaders for a Hack Club project. It took about 10 hours to build, wrap my head around the 3D math, asset hunt, and debug. 

The app lets you look at all 8 planets orbiting in real time, zoom/rotate the camera, and click on any planet to pull up a local data panel with facts and milestones.

## Tech Stack
* Frontend: Vanilla HTML5, CSS3
* 3D Engine: Three.js (r128)
* Graphics: GLSL (Custom vertex and fragment shaders for the sun texture)
* Development Time: 10 Hours (Mostly spent on shader debugging, orbital math, and UI styling)

## How the Code Works

Everything is packed inside `index.html` to keep it running smoothly without any heavy build tools or npm installs:

* **3D Canvas and Camera:** I used Three.js to set up the core 3D scene, renderer, and an OrbitControls loop so you can drag to rotate the camera and scroll to zoom. The background starfield is generated dynamically by spawning a matrix of 2000 randomized point vertices.
* **Custom Sun Shader:** Instead of just pasting a flat image texture onto a sphere, I wrote custom GLSL vertex and fragment shaders. It uses animated procedural noise calculations directly on the GPU to give the sun a moving, fiery surface look.
* **Orbital Math and Geometry:** All 8 planets are loaded as separate sphere geometries with their own texture maps, set to orbit at different relative speeds and accurate axial tilts. Saturn's rings are rendered using a flat, double-sided ring geometry.
* **Raycasting and DOM UI:** To make the planets interactive, I used a Three.js Raycaster. When you click anywhere on the 3D canvas, it calculates where your mouse intersects in 3D space. If it hits a planet, a JavaScript function triggers a smooth camera interpolation (fly-to effect) and updates a standard HTML info panel on the screen using basic DOM targeting.

## How to Run it Locally

No installation or node modules needed. 

1. Clone the project:
```bash
   git clone [https://github.com/RiyaDhami13/solar-system-browser.git](https://github.com/RiyaDhami13/solar-system-browser.git)
   cd solar-system-browser
