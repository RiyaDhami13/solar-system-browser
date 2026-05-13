const canvas = document.getElementById('solarCanvas');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');
const infoPanel = document.getElementById('infoPanel');
const pauseBt = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const speedSlider = document.getElementById('speedSlider');
const pName = document.getElementById('p-name');
const pPeriod = document.getElementById('p-period');
const pTemp = document.getElementById('p-temp');
const pMoons = document.getElementById('p-moons');
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
  { id:'mercury', name:'Mercury', distance:10,  radius:0.5, 
    color:'#B5B5B5', speed:0.040, tilt:0.03, period:'88 days',   temp:'-180 to 430°C', moons:0,   type:'Rocky Planet',
  fact: 'Despite being closest to the Sun, Mercury is not the hottest planet',
  milestones: [
    {
      year:'1974', event: 'Mariner 10 - first mercury flyby, maps 45% of the surface.' },
      {year:'2011', event:'MESSENGER enters the orbit, discovers water ice in polar craters' },
      {year:'2025', event:'BepiColombo peforms its 6th flyby en route to orbit' },
  ]
  },

  { id:'venus',   name:'Venus', distance:16, radius:0.9,  color:'#E8C06B', speed:0.016, tilt:177, period:'225 days',  temp:'465°C avg', moons:0,   type:'Rocky Planet',
    fact:'A day on Venus is longer than its year. It also routes backwards- the sun rises here in the west.',
    milestones:[
      {year:'1970', event:'Venera-7 first spacecraft to land on another planet.' },
      {year:'1975', event:'Venera-9 sends first photograph from Veneus surface' },
      {year:'1990', event:'Magellan maps 98% of Venus via radar through thick clouds.' },
    ]
  },

  { id:'earth',   name:'Earth', distance:22, radius:1.0,  color:'#4B9CD3', speed:0.010, tilt:23.5, period:'365 days',  temp:'15°C avg',      moons:1,   type:'Rocky Planet',
    fact:'Earth is the only planet with plate tectonics- the process that recycles carbon and makes long term life possible',
    milestones: [
      {year:'1957', event:'Sputnik 1- first artifical satellite, begins the Space Age' },
      {year:'1969', event:'Apollo 11- humans walk on the Moon for the first time.' },
      {year:'1990', event:'Voyager 1 captures the Pale Blue Dot photograph from 6 billion km' },
    ]
  },


  { id:'mars',    name:'Mars', distance:30, radius:0.6,  color:'#C1440E', speed:0.005, tilt:25, period:'687 days',  temp:'-63°C avg',     moons:2,   type:'Rocky Planet', 
    fact:'Olympus Mons on the Mars is the tallest volcano in the solar system- 21 km high nearly the height of Everest.',
    milestones: [
      {year:'1997', event: 'Mars Pathfinder - So journer becomes the first Mars rover.' },
      {year:'2012', event: 'Curiosity confirms mars once had liquid water.' },
      {year:'2021', event:'Igenunity helicopter achieves first powered flight on another world.'}
    ]
      },

  { id:'jupiter', name:'Jupiter', distance:44, radius:3.0, color:'#C88B3A', speed:0.002, tilt:3, period:'12 years',  temp:'-110°C',        moons:95,  type:'Gas Giant' ,
    fact:'Jupiter is so massive it does not orbit the Sun - the Sun and Jupiter orbit their shared center of mass outside the Sun\'s surface.',
    milestones: [
      {year:'1979', event: 'Voyager 1 discovers Jupiter\'s rings and volcanic Io.' },
      {year:'1994', event: 'Shoemaker-Levy 9 comet crashes into Jupiter - first observed planetry impact' },
      {year:'2016', event: 'Juno enters orbit, maps magnetic fields and polar storms.' },
    ]
  },

  { id:'saturn',  name:'Saturn', distance:58, radius:2.5, color:'#E4D191', speed:0.001, tilt:26.7, period:'29 years',  temp:'-140°C',moons:146, type:'Gas Giant',
    fact:'Saturn\'s rings are only 10-100 metres thick despite spanning 282,000 km - proportionally thinner than a piece of paper',
    milestones: [
      {year:'2004', event: 'Cassini enters Saturn\'s orbit - begins 13 years study' },
      {year:'2005', event:'Huygens probe lands on Titan - first outer solar system landing' },
      {year:'2017', event:'Cassini\'s Grand Finale - dives between Saturn and rings 22 times' },
    ]

  },
  { id:'uranus',  name:'Uranus', distance:72, radius:1.8, color:'#7DE8E8', speed:0.0005, tilt:97.8, period:'84 years',  temp:'-197°C',        moons:28,  type:'Ice Giant' },
  { id:'neptune', name:'Neptune', orbitRadius:450, radius:12, color:'#4B70DD', speed:0.0002, angle:5.2, period:'165 years', temp:'-201°C', moons:16,  type:'Ice Giant',
    fact:'Uranus rotates on its side with a 97.8° tilt — likely caused by a massive collision billions of years ago.',
    milestones: [
      {year:'1781', event: 'William Herschel discovers Uranus - first planet found with telescope' },
      {year:'1986', event:'Voyager 2 flyby - the only spacecraft to visit Uranus' },
      {year:'2023', event: 'NASA names Uranus Orbiter top priority mission of the decade' },
    ]
  }, 
  {
    id:'neptune', name:'Neptune', distance:85, radius:1.6,
    color:'#4B70DD', speed:0.0002, tilt:28,
    type:'Ice Giant', period:'165 years',
    temp:'-201°C', moons:16,
    fact:'Neptune was discovered through mathematics before it was ever observed — predicted by calculating disturbances in Uranus\'s orbit.',
    milestones:[
      { year:'1846', event:'Neptune discovered through mathematical prediction alone.' },
      { year:'1989', event:'Voyager 2 flyby — discovers Great Dark Spot and geysers on Triton.' },
      { year:'2022', event:'James Webb captures clearest images of Neptune\'s rings in decades.' },
    ]
  },
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
  ctx.arc(cx, cy, planet.distance * zoomLevel,0, Math.PI *2);
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
function drawPlanet(cx,cy,planet) {
  const scaledOrbit = planet.distance * zoomLevel;
  const scaledRadius = Math.max(planet.radius * zoomLevel,2);

  const x = cx + Math.cos(planet.angle) * scaledOrbit;
  const y = cy + Math.sin(planet.angle) * scaledOrbit;

  planet.screenX = x;
  planet.screenY = y;

  const dist = getDistance(mouseX, mouseY, x, y);
  const isHovered = dist < scaledRadius + 8;

  if(isHovered || selectedPlanet?.id === planet.id) {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, scaledRadius * 3);
    glow.addColorStop(0,planet.color+'55');
    glow.addColorStop(0,planet.color+'00');
    ctx.beginPath();
    ctx.arc(x, y, scaledRadius * 3, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(x,y,scaledRadius, 0, Math.PI * 2);
  ctx.fillStyle = planet.color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    x - scaledRadius * 0.3,
    y - scaledRadius * 0.3,
    scaledRadius * 0.25,
    0, Math.PI * 2
  );
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fill();

  if(planet.id === 'saturn') {
    ctx.beginPath();
    ctx.ellipse(x, y, scaledRadius * 2.2, scaledRadius * 0.5, 0.4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(228,209,145,0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (isHovered) hoveredPlanet = planet;
  return isHovered;
}

//show Planet info
function showPlanetInfo(planet) {
  pName.textContent   = planet.name;
  pPeriod.textContent = planet.period;
  pTemp.textContent   = planet.temp;
  pMoons.textContent  = planet.moons;
  pType.textContent   = planet.type;
  infoPanel.classList.add('visible');
}

//updating planets
function updatePlanets() {
  if (isPaused) return;
  Planets.forEach(p => { p.angle += p.speed * speedMult; });
}

//render loop
function animate() {
  const center = getCenter();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hoveredPlanet = null;

  drawStars();
  Planets.forEach(p => drawOrbitRing(center.x, center.y, p));
  drawSun(center.x, center.y);
  Planets.forEach(p => drawPlanet(center.x, center.y, p));

  if (hoveredPlanet) {
    tooltip.textContent   = hoveredPlanet.name;
    tooltip.style.opacity = '1';
    canvas.style.cursor   = 'pointer';
  } else {
    tooltip.style.opacity = '0';
    canvas.style.cursor   = 'default';
  }

  updatePlanets();
  requestAnimationFrame(animate);
}

//events
canvas.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

canvas.addEventListener('click', () => {
  if (hoveredPlanet) {
    selectedPlanet = hoveredPlanet;
    showPlanetInfo(hoveredPlanet);
  }
});

canvas.addEventListener('wheel', e => {
  zoomLevel = Math.max(0.4, Math.min(2.5, zoomLevel + e.deltaY * -0.001));
}, { passive: true });

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
});

resetBtn.addEventListener('click', () => {
  Planets.forEach((p, i) => { p.angle = i * 0.8; });
  zoomLevel      = 1;
  selectedPlanet = null;
  infoPanel.classList.remove('visible');
});

speedSlider.addEventListener('input', e => {
  speedMult = parseFloat(e.target.value);
});

document.addEventListener('keydown', e => {
  const index = parseInt(e.key) - 1;
  if (index >= 0 && index < Planets.length) {
    selectedPlanet = Planets[index];
    showPlanetInfo(Planets[index]);
  }
});

//starting
animate();