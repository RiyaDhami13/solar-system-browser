const canvas = document.getElementById('solarCanvas');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById9('tooltip');
const infoPanel = document.getElementById('infoPanel');
const pauseBt = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const speedSlider = document.getElementById('speedSlider');
const pName = document.getElementById('p-name');
const pPeriod = document.getElementById('p-period');
const pPeriod = document.getElementById('p-period');
const pTemp = document.getElementById('p-temp');
const pMoons = document.getElementsById('p-moons');
const pType = document.getElementById('p-type');

//Canvas resizing
function resizeCanvas () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getCenter() {
  return{ x:canvas.width/2, y:canvas.height/2};
}

//Planet Data
const Planets = [
   { id:'mercury', name:'Mercury', orbitRadius:80,  radius:4,  color:'#B5B5B5', speed:0.0400, angle:0.0, period:'88 days',   temp:'-180 to 430°C', moons:0,   type:'Rocky'    },
  { id:'venus',   name:'Venus',   orbitRadius:120, radius:8,  color:'#E8C06B', speed:0.0160, angle:1.2, period:'225 days',  temp:'465°C avg',     moons:0,   type:'Rocky'    },
  { id:'earth',   name:'Earth',   orbitRadius:165, radius:9,  color:'#4B9CD3', speed:0.0100, angle:2.5, period:'365 days',  temp:'15°C avg',      moons:1,   type:'Rocky'    },
  { id:'mars',    name:'Mars',    orbitRadius:215, radius:6,  color:'#C1440E', speed:0.0050, angle:0.8, period:'687 days',  temp:'-63°C avg',     moons:2,   type:'Rocky'    },
  { id:'jupiter', name:'Jupiter', orbitRadius:285, radius:22, color:'#C88B3A', speed:0.0020, angle:3.1, period:'12 years',  temp:'-110°C',        moons:95,  type:'Gas Giant' },
  { id:'saturn',  name:'Saturn',  orbitRadius:350, radius:18, color:'#E4D191', speed:0.0010, angle:4.5, period:'29 years',  temp:'-140°C',        moons:146, type:'Gas Giant' },
  { id:'uranus',  name:'Uranus',  orbitRadius:405, radius:13, color:'#7DE8E8', speed:0.0005, angle:1.8, period:'84 years',  temp:'-197°C',        moons:28,  type:'Ice Giant' },
  { id:'neptune', name:'Neptune', orbitRadius:450, radius:12, color:'#4B70DD', speed:0.0002, angle:5.2, period:'165 years', temp:'-201°C',        moons:16,  type:'Ice Giant' },
];

//state
let hoveredPlanet = null;
let selectedPlanet = null;
let isPaused = false;
let speedMult = 1;
let zoomLevel = 1;
let mouseX = 0;
let mouseY = 0;

//distance helper
function getDistance(x1,y1,x2,y2) {
  const dx = x2 - x1;
  const dy = y2-y1;
  return Math.sqrt(dx*dx+dy*dy);
}

//draw stars
function drawStars() {
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 0; i <200; i++) {
    const x = (Math.sin(i * 127.1) * 0.5 + 0.5) * canvas.width;
    const y = (Math.sin(i * 311.7) * 0.5 + 0.5) * canvas.height;
    const size = (Math.sin(i*74.7) * 0.5+0.5)* 1.5;
    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI *2);
    ctx.fill();
  }
  }

//Draw Sun
function drawSun(cx, cy) {
  const glow = ctx.createRadialGradient(cx,cy,0,cx,cy,80);
  glow.addColorStop(0, 'rgba(253,184,19,0.4)');
  glow.addColorStop(0.5, 'rgba(253,184,19,0.1)');
  glow.addColorStop(1, 'rgba(253,184,19,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, 35, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

ctx.beginPath();
ctx.arc(cx-8,cy-8,12,0,Math.PI *2);
ctx.fillStyle = 'rgba(255,240,150,0.4)';
ctx.fill();
}

//drawwing orbit ring
function drawOrbitRing(cx,cy,planet) {
  ctx.beginPath();
  ctx.arc(cx, cy, planet.orbitRadius * zoomLevel,0, Math.PI *2);
  if(selectedPlanet?.id === planet.id) {
    ctx.strokeStyle = 'rgba(245,200,66,0.35)';
    ctx.lineWidth = 1.5;
  } else {
    ctx.strokeStyle = 'rgba((255,255,255,0.07)';
    ctx.lineWidth = 1;
  }
  ctx.stroke();
}

//drawing planets
