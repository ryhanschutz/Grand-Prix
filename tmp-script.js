
// ════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════

const CENTER = [-2.5626, -44.3708];

let vehicles = [
  { id:'VAN-01', tag:'VR-101', type:'van',     emoji:'🚐', driver:'Carlos Mendes',  status:'available', lat:-2.5665, lng:-44.3735, image:null },
  { id:'VAN-02', tag:'VR-102', type:'van',     emoji:'🚐', driver:'Ana Lima',       status:'available', lat:-2.5648, lng:-44.3722, image:null },
  { id:'CAM-03', tag:'VR-201', type:'truck',   emoji:'🚛', driver:'João Silva',     status:'en-route',  lat:-2.5676, lng:-44.3698, image:null, modelUrl:'network-device.glb' },
  { id:'VAN-04', tag:'VR-103', type:'van',     emoji:'🚐', driver:'Pedro Costa',    status:'available', lat:-2.5590, lng:-44.3660, image:null },
  { id:'SUP-05', tag:'VR-301', type:'support', emoji:'🔧', driver:'Maria Santos',   status:'offline',   lat:-2.5604, lng:-44.3628, image:null },
  { id:'CAM-06', tag:'VR-202', type:'truck',   emoji:'🚛', driver:'Lucas Ferreira', status:'available', lat:-2.5657, lng:-44.3741, image:null, modelUrl:'network-device.glb' },
];

let teams = [
  { id:'EQ-ALPHA', name:'Equipe Alpha', members:4, location:'Pátio Norte',  lat:-2.5968, lng:-44.3648, status:'waiting',  req:'14:23', vehicle:null },
  { id:'EQ-BETA',  name:'Equipe Beta',  members:3, location:'Cais 07',      lat:-2.6025, lng:-44.3605, status:'assigned', req:'14:18', vehicle:'VAN-02' },
  { id:'EQ-GAMMA', name:'Equipe Gamma', members:6, location:'Portão Leste', lat:-2.5988, lng:-44.3574, status:'waiting',  req:'14:31', vehicle:null },
  { id:'EQ-DELTA', name:'Equipe Delta', members:2, location:'Armazém 12',   lat:-2.5996, lng:-44.3665, status:'assigned', req:'14:15', vehicle:'CAM-03' },
];

let routes = [];

let interdictions = [
  { id:'INT-01', name:'Manutenção Pátio Sul', lat:-2.6052, lng:-44.3622, radius:200, reason:'Pavimentação programada', since:'13:00', until:'17:00' },
];

let keyPoints = [
  { id:'KP-PI4', name:'Píer 4', lat:-2.5516093787565404, lng:-44.37886196991344, label:'4' },
  { id:'KP-PI3', name:'Píer 3', lat:-2.5623676208640966, lng:-44.379214049076126, label:'3' },
  { id:'KP-PI1', name:'Píer 1', lat:-2.5660185044179937, lng:-44.378238787848936, label:'1' },
  { id:'KP-PTM', name:'Ponta da Madeira', lat:-2.565083133064946, lng:-44.37528724511482, label:'PM' },
  { id:'KP-P4', name:'Portaria do Píer 4', lat:-2.559505434070152, lng:-44.36466766976164, label:'P4' },
  { id:'KP-P3', name:'Portaria do Píer 3', lat:-2.5646636502314757, lng:-44.37662488789419, label:'P3' },
  { id:'KP-P1', name:'Portaria do Píer 1', lat:-2.5657101572383048, lng:-44.37705623441668, label:'P1' },
  { id:'KP-SE', name:'Subestação SE-3150K-01', lat:-2.5603999155329635, lng:-44.36282647717872, label:'SE' },
  { id:'KP-VV', name:'Virador de Vagões', lat:-2.5680293295264036, lng:-44.34465188856429, label:'VV' },
];

function haversine(a, b) {
  const R = 6371000;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const x = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

const routingNodes = [
  { id: 0, name: 'Píer 4', lat:-2.5516093787565404, lng:-44.37886196991344 },
  { id: 1, name: 'Píer 3', lat:-2.5623676208640966, lng:-44.379214049076126 },
  { id: 2, name: 'Píer 1', lat:-2.5660185044179937, lng:-44.378238787848936 },
  { id: 3, name: 'Ponta da Madeira', lat:-2.565083133064946, lng:-44.37528724511482 },
  { id: 4, name: 'Portaria do Píer 4', lat:-2.559505434070152, lng:-44.36466766976164 },
  { id: 5, name: 'Portaria do Píer 3', lat:-2.5646636502314757, lng:-44.37662488789419 },
  { id: 6, name: 'Portaria do Píer 1', lat:-2.5657101572383048, lng:-44.37705623441668 },
  { id: 7, name: 'Subestação SE-3150K-01', lat:-2.5603999155329635, lng:-44.36282647717872 },
  { id: 8, name: 'Virador de Vagões', lat:-2.5680293295264036, lng:-44.34465188856429 },
];

const routingEdges = [
  { id: 0, source: 0, target: 4, weight: haversine(routingNodes[0], routingNodes[4]), isBlocked: false },
  { id: 1, source: 0, target: 3, weight: haversine(routingNodes[0], routingNodes[3]), isBlocked: false },
  { id: 2, source: 3, target: 1, weight: haversine(routingNodes[3], routingNodes[1]), isBlocked: false },
  { id: 3, source: 3, target: 2, weight: haversine(routingNodes[3], routingNodes[2]), isBlocked: false },
  { id: 4, source: 1, target: 2, weight: haversine(routingNodes[1], routingNodes[2]), isBlocked: false },
  { id: 5, source: 4, target: 7, weight: haversine(routingNodes[4], routingNodes[7]), isBlocked: false },
  { id: 6, source: 1, target: 5, weight: haversine(routingNodes[1], routingNodes[5]), isBlocked: false },
  { id: 7, source: 2, target: 6, weight: haversine(routingNodes[2], routingNodes[6]), isBlocked: false },
  { id: 8, source: 2, target: 8, weight: haversine(routingNodes[2], routingNodes[8]), isBlocked: false },
  { id: 9, source: 3, target: 8, weight: haversine(routingNodes[3], routingNodes[8]), isBlocked: false },
];

class MinHeap {
  constructor(compare) { this.items = []; this.compare = compare; }
  swap(i, j) { [this.items[i], this.items[j]] = [this.items[j], this.items[i]]; }
  parent(i) { return Math.floor((i - 1) / 2); }
  left(i) { return 2 * i + 1; }
  right(i) { return 2 * i + 2; }
  push(item) {
    this.items.push(item);
    let idx = this.items.length - 1;
    while (idx > 0) {
      const p = this.parent(idx);
      if (this.compare(this.items[idx], this.items[p]) < 0) { this.swap(idx, p); idx = p; } else break;
    }
  }
  pop() {
    if (!this.items.length) return null;
    this.swap(0, this.items.length - 1);
    const item = this.items.pop();
    let idx = 0;
    while (true) {
      const left = this.left(idx);
      const right = this.right(idx);
      let candidate = idx;
      if (left < this.items.length && this.compare(this.items[left], this.items[candidate]) < 0) candidate = left;
      if (right < this.items.length && this.compare(this.items[right], this.items[candidate]) < 0) candidate = right;
      if (candidate !== idx) { this.swap(idx, candidate); idx = candidate; } else break;
    }
    return item;
  }
  isEmpty() { return this.items.length === 0; }
}

const RoutingEngine = {
  nodes: routingNodes,
  edges: routingEdges,
  nodesMap: {},
  init() {
    this.nodesMap = this.nodes.reduce((acc, node) => { acc[node.id] = node; return acc; }, {});
    this.adjacency = this.buildAdjacency();
  },
  buildAdjacency() {
    const adj = {};
    for (const edge of this.edges) {
      if (edge.isBlocked) continue;
      adj[edge.source] = adj[edge.source] || [];
      adj[edge.source].push({ to: edge.target, cost: edge.weight, edgeId: edge.id });
      adj[edge.target] = adj[edge.target] || [];
      adj[edge.target].push({ to: edge.source, cost: edge.weight, edgeId: edge.id });
    }
    return adj;
  },
  heuristic(nodeId, goalId) {
    return haversine(this.nodesMap[nodeId], this.nodesMap[goalId]);
  },
  findNearestNode(lat, lng) {
    let bestId = null;
    let bestDist = Infinity;
    for (const node of this.nodes) {
      const dist = haversine({ lat, lng }, node);
      if (dist < bestDist) { bestDist = dist; bestId = node.id; }
    }
    return bestId;
  },
  findNearestEdge(lat, lng) {
    let best = null;
    let bestDist = Infinity;
    const point = { lat, lng };
    for (const edge of this.edges) {
      const a = this.nodesMap[edge.source];
      const b = this.nodesMap[edge.target];
      const dist = pointToSegmentDistance(point, a, b);
      if (dist < bestDist) { bestDist = dist; best = edge; }
    }
    return best;
  },
  findRoute(start, end) {
    const startId = typeof start === 'number' ? start : this.findNearestNode(start.lat, start.lng);
    const goalId = typeof end === 'number' ? end : this.findNearestNode(end.lat, end.lng);
    if (startId === null || goalId === null) return null;
    const adjacency = this.buildAdjacency();
    const open = new MinHeap((a, b) => a.f - b.f);
    const cameFrom = {};
    const gScore = {};
    const fScore = {};
    for (const node of this.nodes) {
      gScore[node.id] = Infinity;
      fScore[node.id] = Infinity;
    }
    gScore[startId] = 0;
    fScore[startId] = this.heuristic(startId, goalId);
    open.push({ id: startId, f: fScore[startId] });
    const visited = new Set();

    while (!open.isEmpty()) {
      const current = open.pop();
      if (visited.has(current.id)) continue;
      visited.add(current.id);
      if (current.id === goalId) {
        const path = [];
        let nodeId = goalId;
        while (nodeId !== undefined) {
          path.unshift(nodeId);
          nodeId = cameFrom[nodeId];
        }
        return { path, totalDistance: gScore[goalId] };
      }
      const neighbors = adjacency[current.id] || [];
      for (const neighbor of neighbors) {
        const tentative = gScore[current.id] + neighbor.cost;
        if (tentative < gScore[neighbor.to]) {
          cameFrom[neighbor.to] = current.id;
          gScore[neighbor.to] = tentative;
          fScore[neighbor.to] = tentative + this.heuristic(neighbor.to, goalId);
          open.push({ id: neighbor.to, f: fScore[neighbor.to] });
        }
      }
    }
    return null;
  },
  blockEdge(edgeId) {
    const edge = this.edges.find(e => e.id === edgeId);
    if (edge) { edge.isBlocked = true; this.adjacency = this.buildAdjacency(); }
    return edge;
  },
  unblockEdge(edgeId) {
    const edge = this.edges.find(e => e.id === edgeId);
    if (edge) { edge.isBlocked = false; this.adjacency = this.buildAdjacency(); }
    return edge;
  },
  toggleEdge(edgeId) {
    const edge = this.edges.find(e => e.id === edgeId);
    if (!edge) return null;
    edge.isBlocked = !edge.isBlocked;
    this.adjacency = this.buildAdjacency();
    return edge;
  },
  updateWeights() {
    this.adjacency = this.buildAdjacency();
  },
  getPathLatLngs(path) {
    return path.map(id => {
      const node = this.nodesMap[id];
      return [node.lat, node.lng];
    });
  }
};

RoutingEngine.init();

// ════════════════════════════════════════════════
// MAP INIT
// ════════════════════════════════════════════════

const map = L.map('map', { center: CENTER, zoom: 14, zoomControl: false });

const GRAPHOPPER_API_KEY = ''; // Adicione sua chave GraphHopper aqui para usar o roteamento GH.
const GRAPHOPPER_PROFILE = 'car'; // altere para 'truck' ou 'small_truck' se desejar.

const tileLayers = {
  light: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd', maxZoom: 20,
  }),
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com">Esri</a> — Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP',
    maxZoom: 20,
  }),
  labels: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd', maxZoom: 20,
  }),
};
let activeLayer = 'light';
tileLayers.light.addTo(map);

L.control.zoom({ position: 'bottomright' }).addTo(map);
const routeLayer = L.layerGroup().addTo(map);
const interdictionLayer = L.layerGroup().addTo(map);
let selectedVehicleId = null;
let selectedDestinationId = null;
let selectedRouteInfo = null;
let selectedRouteCoords = null;
let selectedRouteProgress = 0;
let interdictMode = false;
const networkViewerState = { container: null, scene: null, camera: null, renderer: null, model: null, animating: false };
const truckViewerState = { container: null, scene: null, camera: null, renderer: null, model: null, animating: false };

map.on('click', e => {
  if (!interdictMode) return;
  interdictMode = false;
  placeInterdictAt(e.latlng);
});

// ════════════════════════════════════════════════
// MARKERS
// ════════════════════════════════════════════════

const vMarkers = {};
const tMarkers = {};
const rLines   = {};
const poiMarkers = {};

const SCOLOR = { available:'#22C55E', 'en-route':'#F59E0B', offline:'#9CA3AF' };

function vIcon(v) {
  const c = SCOLOR[v.status];
  const iconHtml = v.image ? `<img src="${v.image}" alt="${v.id}" style="width:32px;height:32px;border-radius:9px;object-fit:cover;border:2px solid #fff">` : `<i class="fa-solid ${v.type === 'truck' ? 'fa-truck' : v.type === 'van' ? 'fa-van-shuttle' : 'fa-wrench'}" style="color:#fff;font-size:16px"></i>`;
  return L.divIcon({
    className: '',
    iconSize: [36, 43], iconAnchor: [18, 43],
    html: `<div style="display:flex;flex-direction:column;align-items:center">
      <div style="width:34px;height:34px;border-radius:9px;background:${c};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.18),0 0 0 2px #fff">${iconHtml}</div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid ${c};margin-top:-1px"></div>
    </div>`,
  });
}

function tIcon(t) {
  const c = t.status === 'waiting' ? '#3B82F6' : '#22C55E';
  const pulse = t.status === 'waiting'
    ? `<div style="position:absolute;top:50%;left:50%;width:44px;height:44px;border-radius:50%;border:2px solid ${c};animation:ring 2s infinite;z-index:0"></div>`
    : '';
  return L.divIcon({
    className: '',
    iconSize: [34, 43], iconAnchor: [17, 43],
    html: `<style>@keyframes ring{0%{transform:translate(-50%,-50%) scale(.7);opacity:1}100%{transform:translate(-50%,-50%) scale(1.6);opacity:0}}</style>
    <div style="position:relative;display:flex;flex-direction:column;align-items:center;width:34px">
      ${pulse}
      <div style="position:relative;z-index:1;width:32px;height:32px;border-radius:50%;background:${c};display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.15),0 0 0 2px #fff">👷</div>
      <div style="position:relative;z-index:1;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid ${c};margin-top:-1px"></div>
    </div>`,
  });
}

function popupV(v) {
  return `<div style="font-family:system-ui;min-width:180px">
    ${v.image ? `<img src="${v.image}" alt="${v.id}" style="width:100%;height:90px;object-fit:cover;border-radius:12px;margin-bottom:8px">` : ''}
    <div style="font-weight:700;font-size:14px;margin-bottom:5px">${v.id} <span style="font-size:11px;color:#6B7280">(${v.tag})</span></div>
    <div style="font-size:12px;color:#71717A">Motorista: ${v.driver}</div>
    <div style="font-size:12px;color:#71717A">Tipo: ${v.type === 'van' ? 'Van' : v.type === 'truck' ? 'Caminhão' : 'Suporte'}</div>
    <div style="font-size:12px;color:#71717A">Status: ${v.status === 'available' ? '🟢 Disponível' : v.status === 'en-route' ? '🟡 Em rota' : '⚫ Offline'}</div>
    <div style="font-size:12px;color:#6B7280;margin-top:6px">ValeRoute TAG: ${v.tag}</div>
  </div>`;
}

function popupT(t) {
  return `<div style="font-family:system-ui;min-width:156px">
    <div style="font-weight:700;font-size:14px;margin-bottom:5px">${t.name}</div>
    <div style="font-size:12px;color:#71717A">Local: ${t.location}</div>
    <div style="font-size:12px;color:#71717A">Membros: ${t.members}</div>
    <div style="font-size:12px;color:#71717A">Solicitado às ${t.req}</div>
    <div style="font-size:12px;margin-top:4px;color:${t.vehicle ? '#15803D' : '#1D4ED8'}">
      ${t.vehicle ? `✓ ${t.vehicle} a caminho` : '⏳ Aguardando veículo'}
    </div>
  </div>`;
}

function mountV(v) {
  const m = L.marker([v.lat, v.lng], { icon: vIcon(v), draggable: true }).addTo(map);
  m.bindPopup(popupV(v));
  m.on('click', () => highlightSidebarRow(v.id));
  m.on('dragend', e => {
    const p = e.target.getLatLng();
    v.lat = p.lat; v.lng = p.lng;
    m.setPopupContent(popupV(v));
    const r = routes.find(x => x.vid === v.id);
    if (r && rLines[r.id]) rLines[r.id].setLatLngs([[v.lat, v.lng],[r.tLat, r.tLng]]);
    toast(`${v.id} reposicionado`, `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`);
  });
  vMarkers[v.id] = m;
}

function mountT(t) {
  const m = L.marker([t.lat, t.lng], { icon: tIcon(t), draggable: true }).addTo(map);
  m.bindPopup(popupT(t));
  m.on('click', () => highlightSidebarRow(t.id));
  m.on('dragend', e => {
    const p = e.target.getLatLng();
    t.lat = p.lat; t.lng = p.lng;
    m.setPopupContent(popupT(t));
    toast(`${t.name} reposicionada`, `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`);
  });
  tMarkers[t.id] = m;
}

function routeLatLngs(r) {
  if (r.path && r.path.length) {
    return RoutingEngine.getPathLatLngs(r.path);
  }
  return [[r.fLat, r.fLng],[r.tLat, r.tLng]];
}

function mountRoute(r) {
  const line = L.polyline(routeLatLngs(r), {
    color: r.color, weight: 3, opacity: .85,
    dashArray: '10 8', className: 'animated-route',
  }).addTo(map);
  rLines[r.id] = line;
}

function clearRoutingLayer() {
  routeLayer.clearLayers();
}

function pointToSegmentDistance(point, a, b) {
  const lat1 = a.lat, lng1 = a.lng;
  const lat2 = b.lat, lng2 = b.lng;
  const lat0 = point.lat, lng0 = point.lng;
  const dx = lat2 - lat1;
  const dy = lng2 - lng1;
  if (dx === 0 && dy === 0) return haversine(point, a);
  const t = Math.max(0, Math.min(1, ((lat0 - lat1) * dx + (lng0 - lng1) * dy) / (dx * dx + dy * dy)));
  const proj = { lat: lat1 + t * dx, lng: lng1 + t * dy };
  return haversine(point, proj);
}

function drawBlockedEdge(edge) {
  const a = RoutingEngine.nodesMap[edge.source];
  const b = RoutingEngine.nodesMap[edge.target];
  if (!a || !b) return;
  L.polyline([[a.lat, a.lng], [b.lat, b.lng]], {
    color: '#DC2626', weight: 4, opacity: .8, dashArray: '8 6', interactive: false,
  }).addTo(interdictionLayer);
}

function routeIntersectsBlockedEdge(coords) {
  const blockedEdges = RoutingEngine.edges.filter(e => e.isBlocked);
  if (!blockedEdges.length) return false;
  const points = coords.map(c => ({ lat: c[0], lng: c[1] }));
  for (const edge of blockedEdges) {
    const a = RoutingEngine.nodesMap[edge.source];
    const b = RoutingEngine.nodesMap[edge.target];
    for (const pt of points) {
      if (pointToSegmentDistance(pt, a, b) < 60) return true;
    }
  }
  return false;
}

function getRoutePointAtFraction(coords, fraction) {
  if (!coords || coords.length === 0) return null;
  if (fraction <= 0) return { lat: coords[0][0], lng: coords[0][1] };
  if (fraction >= 1) return { lat: coords[coords.length - 1][0], lng: coords[coords.length - 1][1] };
  const distances = [0];
  for (let i = 1; i < coords.length; i++) {
    distances[i] = distances[i - 1] + haversine({ lat: coords[i - 1][1], lng: coords[i - 1][0] }, { lat: coords[i][1], lng: coords[i][0] });
  }
  const total = distances[distances.length - 1];
  const target = total * fraction;
  for (let i = 1; i < distances.length; i++) {
    if (target <= distances[i]) {
      const segment = target - distances[i - 1];
      const segmentLength = distances[i] - distances[i - 1];
      const t = segmentLength === 0 ? 0 : segment / segmentLength;
      const lat = coords[i - 1][1] + (coords[i][1] - coords[i - 1][1]) * t;
      const lng = coords[i - 1][0] + (coords[i][0] - coords[i - 1][0]) * t;
      return { lat, lng };
    }
  }
  return { lat: coords[coords.length - 1][1], lng: coords[coords.length - 1][0] };
}

function getRouteLength(coords) {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversine({ lat: coords[i - 1][1], lng: coords[i - 1][0] }, { lat: coords[i][1], lng: coords[i][0] });
  }
  return total;
}

function drawRoutingPath(latlngs, label) {
  clearRoutingLayer();
  if (!latlngs || !latlngs.length) return;
  const line = L.polyline(latlngs, {
    color: '#00BFA5', weight: 5, opacity: .92, dashArray: null,
  }).addTo(routeLayer);
  if (label) {
    L.marker(latlngs[0], { icon: L.divIcon({ className:'', html:`<div style="padding:4px 8px;background:#3B82F6;color:#fff;border-radius:999px;font-size:11px;">${label}</div>` }) }).addTo(routeLayer);
  }
  map.fitBounds(line.getBounds(), { padding: [40, 40] });
}

function buildDestinationButtons() {
  return keyPoints.map(point => {
    const active = selectedDestinationId === point.id ? ' active' : '';
    return `<button class="dest-btn${active}" onclick="selectDestination('${point.id}')">${point.name}</button>`;
  }).join('');
}

function setVehicleImage(url) {
  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
  if (!vehicle) return;
  vehicle.image = url;
  if (vMarkers[vehicle.id]) {
    vMarkers[vehicle.id].setIcon(vIcon(vehicle));
  }
  renderVehicles();
  updateSelectionPanel();
}

function handleVehicleImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => setVehicleImage(reader.result);
  reader.readAsDataURL(file);
}

function initNetworkViewer() {
  if (!window.THREE || !window.THREE.GLTFLoader) return;
  const container = document.getElementById('network-3d');
  if (!container) return;
  if (networkViewerState.renderer) {
    networkViewerState.renderer.dispose();
    networkViewerState.renderer.domElement.remove();
  }
  networkViewerState.container = container;
  networkViewerState.scene = new THREE.Scene();
  networkViewerState.camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
  networkViewerState.camera.position.set(0, 1.8, 4.2);
  networkViewerState.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  networkViewerState.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  networkViewerState.renderer.setSize(container.clientWidth, container.clientHeight, false);
  container.innerHTML = '';
  container.appendChild(networkViewerState.renderer.domElement);

  const ambient = new THREE.HemisphereLight(0xffffff, 0x444444, 1.1);
  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(4, 8, 5);
  networkViewerState.scene.add(ambient, directional);

  const floor = new THREE.GridHelper(6, 10, 0xdde7f2, 0xf5f7fa);
  floor.position.y = -0.02;
  networkViewerState.scene.add(floor);

  loadNetworkModel('network-device.glb');
  if (!networkViewerState.animating) {
    networkViewerState.animating = true;
    requestAnimationFrame(animateNetworkViewer);
  }
  window.addEventListener('resize', () => {
    if (!networkViewerState.renderer || !networkViewerState.camera || !networkViewerState.container) return;
    networkViewerState.camera.aspect = networkViewerState.container.clientWidth / networkViewerState.container.clientHeight;
    networkViewerState.camera.updateProjectionMatrix();
    networkViewerState.renderer.setSize(networkViewerState.container.clientWidth, networkViewerState.container.clientHeight, false);
  });
}

function loadNetworkModel(url) {
  if (!window.THREE || !window.THREE.GLTFLoader || !networkViewerState.scene) return;
  const loader = new THREE.GLTFLoader();
  loader.load(url, gltf => {
    if (networkViewerState.model) {
      networkViewerState.scene.remove(networkViewerState.model);
    }
    networkViewerState.model = gltf.scene;
    networkViewerState.model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(networkViewerState.model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    networkViewerState.model.position.x -= center.x;
    networkViewerState.model.position.y -= center.y;
    networkViewerState.model.position.z -= center.z;
    const scale = 2.2 / size;
    networkViewerState.model.scale.setScalar(scale);
    networkViewerState.scene.add(networkViewerState.model);
  }, undefined, error => {
    console.error('Falha ao carregar modelo 3D:', error);
    if (networkViewerState.container) {
      networkViewerState.container.innerHTML = '<div style="padding:16px;text-align:center;color:#6B7280;font-size:13px">Falha ao carregar o modelo 3D.</div>';
    }
  });
}

function animateNetworkViewer() {
  if (!networkViewerState.renderer || !networkViewerState.scene || !networkViewerState.camera) return;
  if (networkViewerState.model) {
    networkViewerState.model.rotation.y += 0.006;
  }
  networkViewerState.renderer.render(networkViewerState.scene, networkViewerState.camera);
  requestAnimationFrame(animateNetworkViewer);
}

function updateSelectionPanel() {
  const panel = document.getElementById('selection-panel');
  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
  const dest = keyPoints.find(p => p.id === selectedDestinationId);

  if (!vehicle) {
    panel.innerHTML = `Selecione um veículo para começar. <div style="margin-top:8px;font-size:11px;color:var(--text-4)">Depois, escolha um destino predefinido como Píer 1, Píer 3 ou Portaria.</div>`;
    return;
  }

  const details = [`<div class="strong">Veículo: ${vehicle.id}</div>`, `<div style="margin-top:4px;color:var(--text-3)">Motorista: ${vehicle.driver} · ${vehicle.type === 'van' ? 'Van' : vehicle.type === 'truck' ? 'Caminhão' : 'Suporte'}</div>`, `<div style="margin-top:4px;color:var(--text-4)">ValeRoute TAG: <strong>${vehicle.tag}</strong></div>`];
  if (dest) {
    details.push(`<div style="margin-top:8px">Destino: <strong>${dest.name}</strong></div>`);
  } else {
    details.push(`<div style="margin-top:8px;color:var(--text-4)">Escolha um destino pré-definido abaixo para traçar a rota.</div>`);
  }
  if (selectedRouteInfo) {
    details.push(`<div style="margin-top:8px;color:var(--text-4)">Distância: ${Math.round(selectedRouteInfo.distance)} m · Duração: ${Math.ceil(selectedRouteInfo.duration / 60)} min</div>`);
  }
  details.push(`<div class="dest-list">${buildDestinationButtons()}</div>`);
  if (vehicle.modelUrl) {
    details.push(`<div id="truck-preview" style="margin-top:12px;height:200px;border:1px solid var(--border);border-radius:14px;overflow:hidden;background:#F8FAFC"></div>`);
  }
  details.push(`<div style="margin-top:12px;display:grid;gap:8px">
      <input id="vehicle-image-url" type="text" placeholder="URL da imagem do veículo" style="width:100%;padding:9px 10px;border:1px solid var(--border);border-radius:10px;font-size:12px;color:var(--text);">
      <button class="act-btn primary" style="width:100%;padding:10px 12px;" onclick="setVehicleImage(document.getElementById('vehicle-image-url').value)">Atualizar imagem</button>
      <input id="vehicle-image-file" type="file" accept="image/*" onchange="handleVehicleImageUpload(event)" style="font-size:11px;color:var(--text-3);">
    </div>`);
  panel.innerHTML = details.join('');
  setTimeout(() => refreshTruckPreview(vehicle), 0);
}

function selectVehicle(id) {
  selectedVehicleId = id;
  selectedDestinationId = null;
  selectedRouteInfo = null;
  selectedRouteCoords = null;
  selectedRouteProgress = 0;
  document.querySelectorAll('.item-row').forEach(row => row.classList.toggle('selected', row.dataset.id === id));
  updateSelectionPanel();
  calculateSelectedRoute();
}

function initTruckViewer(container) {
  if (!window.THREE || !window.THREE.GLTFLoader) return;
  if (truckViewerState.renderer) {
    truckViewerState.renderer.dispose();
    truckViewerState.renderer.domElement.remove();
  }
  truckViewerState.container = container;
  truckViewerState.scene = new THREE.Scene();
  truckViewerState.camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
  truckViewerState.camera.position.set(0, 1.8, 3.8);
  truckViewerState.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  truckViewerState.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  truckViewerState.renderer.setSize(container.clientWidth, container.clientHeight, false);
  container.innerHTML = '';
  container.appendChild(truckViewerState.renderer.domElement);
  const ambient = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7.5);
  truckViewerState.scene.add(ambient, dirLight);
  const grid = new THREE.GridHelper(6, 12, 0xcccccc, 0xeeeeee);
  grid.position.y = 0;
  truckViewerState.scene.add(grid);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0xf8fafe, opacity:0.9, transparent:true }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.01;
  truckViewerState.scene.add(floor);
  if (!truckViewerState.animating) {
    truckViewerState.animating = true;
    requestAnimationFrame(animateTruckPreview);
  }
}

function loadTruckModel(url) {
  if (!window.THREE || !window.THREE.GLTFLoader) return;
  const loader = new THREE.GLTFLoader();
  if (!truckViewerState.container) return;
  loader.load(url, gltf => {
    if (truckViewerState.model) {
      truckViewerState.scene.remove(truckViewerState.model);
    }
    truckViewerState.model = gltf.scene;
    truckViewerState.model.traverse(child => {
      if (child.isMesh) child.castShadow = true;
    });
    const box = new THREE.Box3().setFromObject(truckViewerState.model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    truckViewerState.model.position.x += (truckViewerState.model.position.x - center.x);
    truckViewerState.model.position.y += (truckViewerState.model.position.y - center.y);
    truckViewerState.model.position.z += (truckViewerState.model.position.z - center.z);
    const scale = 2.2 / size;
    truckViewerState.model.scale.setScalar(scale);
    truckViewerState.scene.add(truckViewerState.model);
    truckViewerState.camera.position.set(0, 1.8, 3.8);
  }, undefined, error => {
    console.error('Falha ao carregar modelo 3D do caminhão:', error);
    if (truckViewerState.container) {
      truckViewerState.container.innerHTML = '<div style="padding:16px;text-align:center;color:#6B7280;font-size:13px">Falha ao carregar o modelo 3D.</div>';
    }
  });
}

function refreshTruckPreview(vehicle) {
  const container = document.getElementById('truck-preview');
  if (!container) return;
  if (!vehicle || !vehicle.modelUrl) {
    container.innerHTML = '<div style="padding:16px;text-align:center;color:#6B7280;font-size:13px">Modelo 3D não disponível.</div>';
    return;
  }
  if (!truckViewerState.container || truckViewerState.container !== container) {
    initTruckViewer(container);
  }
  loadTruckModel(vehicle.modelUrl);
}

function animateTruckPreview() {
  if (!truckViewerState.renderer || !truckViewerState.scene || !truckViewerState.camera) return;
  if (truckViewerState.model) {
    truckViewerState.model.rotation.y += 0.005;
  }
  truckViewerState.renderer.render(truckViewerState.scene, truckViewerState.camera);
  requestAnimationFrame(animateTruckPreview);
}

function selectDestination(id) {
  selectedDestinationId = id;
  selectedRouteInfo = null;
  selectedRouteCoords = null;
  selectedRouteProgress = 0;
  updateSelectionPanel();
  calculateSelectedRoute();
  const point = keyPoints.find(p => p.id === id);
  if (point) map.flyTo([point.lat, point.lng], 16, { duration: .9 });
}

async function fetchGraphhopperRoute(origin, destination, vehicleType) {
  if (!GRAPHOPPER_API_KEY) return null;
  try {
    const profile = vehicleType === 'truck' ? 'truck' : 'car';
    const url = `https://graphhopper.com/api/1/route?point=${origin.lat},${origin.lng}&point=${destination.lat},${destination.lng}&profile=${profile}&locale=pt-BR&points_encoded=false&vehicle=${profile}&calc_points=true&instructions=false&key=${GRAPHOPPER_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    if (!json.paths || !json.paths.length) return null;
    const path = json.paths[0];
    const coordinates = (path.points && path.points.coordinates) || [];
    return {
      distance: path.distance,
      duration: path.time || path.instructions?.reduce((sum, item) => sum + (item.time || 0), 0) || 0,
      geometry: { coordinates }
    };
  } catch (error) {
    console.warn('GraphHopper fetch failed', error);
    return null;
  }
}

async function fetchOsrmRoute(origin, destination) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&steps=false`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.code !== 'Ok' || !json.routes || !json.routes.length) return null;
    return json.routes[0];
  } catch (error) {
    console.warn('OSRM fetch failed', error);
    return null;
  }
}

async function fetchRoute(origin, destination, vehicleType) {
  if (GRAPHOPPER_API_KEY) {
    const route = await fetchGraphhopperRoute(origin, destination, vehicleType);
    if (route) return route;
  }
  return await fetchOsrmRoute(origin, destination);
}

async function calculateSelectedRoute() {
  if (!selectedVehicleId || !selectedDestinationId) return;
  const vehicle = vehicles.find(v => v.id === selectedVehicleId);
  const dest = keyPoints.find(p => p.id === selectedDestinationId);
  if (!vehicle || !dest) return;
  selectedRouteInfo = null;
  const route = await fetchRoute({ lat: vehicle.lat, lng: vehicle.lng }, { lat: dest.lat, lng: dest.lng }, vehicle.type);
  if (!route) {
    toast('Roteamento indisponível', 'Não foi possível calcular a rota com o serviço de mapa.');
    updateSelectionPanel();
    return;
  }
  let coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
  if (routeIntersectsBlockedEdge(coords)) {
    const localRoute = RoutingEngine.findRoute({ lat: vehicle.lat, lng: vehicle.lng }, { lat: dest.lat, lng: dest.lng });
    if (localRoute && localRoute.path && localRoute.path.length) {
      coords = RoutingEngine.getPathLatLngs(localRoute.path);
      selectedRouteCoords = coords;
      selectedRouteProgress = 0;
      selectedRouteInfo = { distance: localRoute.totalDistance, duration: Math.ceil(localRoute.totalDistance / 12) * 60 };
      drawRoutingPath(coords, `${vehicle.id} → ${dest.label}`);
      updateSelectionPanel();
      toast('Rota alternativa', 'Rota ajustada para evitar a interdição local.');
      return;
    }
    toast('Rota bloqueada', 'Interdição impede o uso deste caminho.');
    updateSelectionPanel();
    return;
  }
  selectedRouteCoords = coords;
  selectedRouteProgress = 0;
  selectedRouteInfo = { distance: route.distance, duration: route.duration };
  drawRoutingPath(coords, `${vehicle.id} → ${dest.label}`);
  updateSelectionPanel();
  toast('Rota atualizada', `Rota de ${vehicle.id} para ${dest.name} calculada.`);
}

async function runRoutingDemo() {
  if (!selectedVehicleId || !selectedDestinationId) {
    toast('Selecione veículo e destino', 'Clique em um veículo na lista e defina um destino no mapa.');
    return;
  }
  await calculateSelectedRoute();
}

function rerouteActivePaths() {
  routes.forEach(r => {
    const v = vehicles.find(x => x.id === r.vid);
    const t = teams.find(x => x.id === r.tid);
    if (!v || !t) return;
    const routeData = RoutingEngine.findRoute({ lat: v.lat, lng: v.lng }, { lat: t.lat, lng: t.lng });
    if (routeData && routeData.path && routeData.path.length) {
      r.path = routeData.path;
      r.coords = RoutingEngine.getPathLatLngs(routeData.path);
      r.totalDistance = routeData.totalDistance;
      if (rLines[r.id]) rLines[r.id].setLatLngs(r.coords);
    } else {
      toast('Rota interrompida', `Não foi possível rerotar ${r.vid} para ${t.name}.`);
      if (rLines[r.id]) { map.removeLayer(rLines[r.id]); delete rLines[r.id]; }
    }
  });
  renderAll();
}

function findTeamRoute(v, t) {
  const result = RoutingEngine.findRoute({ lat: v.lat, lng: v.lng }, { lat: t.lat, lng: t.lng });
  if (!result) return null;
  return result;
}

function poiIcon(point) {
  return L.divIcon({
    className: '',
    iconSize: [34, 42], iconAnchor: [17, 42],
    html: `<div style="display:flex;flex-direction:column;align-items:center">
      <div style="width:30px;height:30px;border-radius:10px;background:#1D4ED8;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;box-shadow:0 2px 10px rgba(0,0,0,.16)">${point.label}</div>
      <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #1D4ED8;margin-top:-1px"></div>
    </div>`,
  });
}

function popupPOI(point) {
  return `<div style="font-family:system-ui;min-width:160px">
    <div style="font-weight:700;font-size:14px;margin-bottom:5px">${point.name}</div>
    <div style="font-size:12px;color:#71717A">${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}</div>
    <div style="margin-top:10px;text-align:right"><button onclick="selectDestination('${point.id}')" style="font-size:12px;padding:6px 10px;background:#3B82F6;color:#fff;border:none;border-radius:8px;cursor:pointer">Definir destino</button></div>
  </div>`;
}

function mountPOI(point) {
  const m = L.marker([point.lat, point.lng], { icon: poiIcon(point) }).addTo(map);
  m.bindPopup(popupPOI(point));
  poiMarkers[point.id] = m;
}

function mountInterdict(i) {
  L.circle([i.lat, i.lng], {
    radius: i.radius,
    color: '#EF4444', fillColor: '#EF4444',
    fillOpacity: .1, weight: 2, dashArray: '6 4',
  }).addTo(map).bindPopup(
    `<div style="font-family:system-ui"><div style="font-weight:700;color:#DC2626">⚠ ${i.name}</div>
    <div style="font-size:12px;color:#71717A;margin-top:3px">${i.reason}</div>
    <div style="font-size:12px;color:#71717A">${i.since} – ${i.until}</div></div>`
  );
}

vehicles.forEach(mountV);
teams.forEach(mountT);
routes.forEach(mountRoute);
interdictions.forEach(mountInterdict);
keyPoints.forEach(mountPOI);

// ════════════════════════════════════════════════
// SIDEBAR RENDER
// ════════════════════════════════════════════════

function renderVehicles() {
  const avail = vehicles.filter(v => v.status === 'available');
  const enrt  = vehicles.filter(v => v.status === 'en-route');
  const off   = vehicles.filter(v => v.status === 'offline');
  let h = '';
  if (avail.length) h += `<div class="section-lbl">Disponíveis (${avail.length})</div>` + avail.map(vRow).join('');
  if (enrt.length)  h += `<div class="section-lbl">Em Rota (${enrt.length})</div>`       + enrt.map(vRow).join('');
  if (off.length)   h += `<div class="section-lbl">Offline (${off.length})</div>`        + off.map(vRow).join('');
  const panel = document.getElementById('tab-vehicles');
  panel.innerHTML = h;
  panel.querySelectorAll('.item-row').forEach(r => r.addEventListener('click', () => {
    selectVehicle(r.dataset.id);
    flyToVehicle(r.dataset.id);
  }));
}

function vRow(v) {
  const iconClass = v.type === 'truck' ? 'fa-truck' : v.type === 'van' ? 'fa-van-shuttle' : 'fa-wrench';
  const bc = v.status === 'available' ? 'b-available' : v.status === 'en-route' ? 'b-route' : 'b-offline';
  const bl = v.status === 'available' ? 'Disponível' : v.status === 'en-route' ? 'Em Rota' : 'Offline';
  const selected = selectedVehicleId === v.id ? ' selected' : '';
  return `<div class="item-row${selected}" data-id="${v.id}">
    <div class="item-icon ${v.type === 'van' ? 'i-van' : v.type === 'truck' ? 'i-truck' : 'i-support'}"><i class="fa-solid ${iconClass}" style="font-size:16px;"></i></div>
    <div class="item-body"><div class="item-title">${v.id}</div><div class="item-sub">${v.driver} · ${v.tag}</div></div>
    <div class="item-right"><span class="badge ${bc}">${bl}</span></div>
  </div>`;
}

function renderTeams() {
  const wait = teams.filter(t => t.status === 'waiting');
  const asgn = teams.filter(t => t.status === 'assigned');
  let h = '';
  if (wait.length) h += `<div class="section-lbl">Aguardando (${wait.length})</div>` + wait.map(tRow).join('');
  if (asgn.length) h += `<div class="section-lbl">Em Atendimento (${asgn.length})</div>` + asgn.map(tRow).join('');
  const panel = document.getElementById('tab-teams');
  panel.innerHTML = h || '<div class="empty">Nenhuma equipe registrada</div>';
  panel.querySelectorAll('.item-row').forEach(r => r.addEventListener('click', () => flyToTeam(r.dataset.id)));
}

function tRow(t) {
  const bc = t.status === 'waiting' ? 'b-waiting' : 'b-assigned';
  const bl = t.status === 'waiting' ? 'Aguardando' : 'Designado';
  const sub = t.vehicle ? `${t.location} · ${t.vehicle}` : `${t.location} · ${t.members} membros`;
  return `<div class="item-row" data-id="${t.id}">
    <div class="item-icon i-team">👷</div>
    <div class="item-body"><div class="item-title">${t.name}</div><div class="item-sub">${sub}</div></div>
    <div class="item-right"><span class="badge ${bc}">${bl}</span></div>
  </div>`;
}

function renderRoutes() {
  const panel = document.getElementById('tab-routes');
  if (!routes.length) { panel.innerHTML = '<div class="empty">Nenhuma rota ativa</div>'; return; }
  let h = `<div class="section-lbl">Rotas Ativas (${routes.length})</div>`;
  h += routes.map(r => {
    const team = teams.find(t => t.id === r.tid);
    return `<div class="route-card">
      <div class="rc-header"><span class="rc-id">${r.id}</span><span class="rc-eta">ETA ${r.eta}</span></div>
      <div class="rc-parties">
        <span class="rc-v">${r.vid}</span><span class="rc-arrow">→</span>
        <span class="rc-t">${team ? team.location : r.tid}</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${r.prog}%"></div></div>
      <div class="progress-foot"><span>${r.prog}% concluído</span><span>${r.tid}</span></div>
    </div>`;
  }).join('');
  panel.innerHTML = h;
}

function renderAlerts() {
  const panel = document.getElementById('tab-alerts');
  if (!interdictions.length) { panel.innerHTML = '<div class="empty">Nenhuma interdição ativa</div>'; return; }
  let h = `<div class="section-lbl">Interdições Ativas (${interdictions.length})</div>`;
  h += interdictions.map(i => `<div class="interd-card">
    <div class="interd-name">⚠ ${i.name}</div>
    <div class="interd-meta">${i.reason}</div>
    <div class="interd-time">Das ${i.since} às ${i.until}</div>
  </div>`).join('');
  panel.innerHTML = h;
}

function updateStats() {
  document.getElementById('st-v').textContent = vehicles.length;
  document.getElementById('st-t').textContent = teams.length;
  document.getElementById('st-r').textContent = routes.length;
  document.getElementById('st-a').textContent = interdictions.length;
}

function renderAll() {
  renderVehicles(); renderTeams(); renderRoutes(); renderAlerts(); updateStats();
}

// ════════════════════════════════════════════════
// TABS
// ════════════════════════════════════════════════

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ════════════════════════════════════════════════
// FLY-TO
// ════════════════════════════════════════════════

// ════════════════════════════════════════════════
// LAYER TOGGLE
// ════════════════════════════════════════════════

function toggleLayer() {
  const btn = document.getElementById('layer-btn');
  if (activeLayer === 'light') {
    map.removeLayer(tileLayers.light);
    tileLayers.satellite.addTo(map);
    tileLayers.labels.addTo(map);
    activeLayer = 'satellite';
    btn.textContent = '🗺 Mapa';
  } else {
    map.removeLayer(tileLayers.satellite);
    map.removeLayer(tileLayers.labels);
    tileLayers.light.addTo(map);
    activeLayer = 'light';
    btn.textContent = '🛰 Satélite';
  }
}

// Coordinate display on mousemove
map.on('mousemove', e => {
  const el = document.getElementById('coords');
  el.style.display = 'block';
  document.getElementById('coord-text').textContent =
    `${e.latlng.lat.toFixed(5)}°S  ${Math.abs(e.latlng.lng).toFixed(5)}°W`;
});
map.on('mouseout', () => { document.getElementById('coords').style.display = 'none'; });

function flyToVehicle(id) {
  const v = vehicles.find(x => x.id === id);
  if (v && vMarkers[id]) { map.flyTo([v.lat, v.lng], 17, { duration: .8 }); setTimeout(() => vMarkers[id].openPopup(), 900); }
}
function flyToTeam(id) {
  const t = teams.find(x => x.id === id);
  if (t && tMarkers[id]) { map.flyTo([t.lat, t.lng], 17, { duration: .8 }); setTimeout(() => tMarkers[id].openPopup(), 900); }
}
function highlightSidebarRow(id) {
  document.querySelectorAll('.item-row').forEach(r => r.style.background = '');
  const row = document.querySelector(`[data-id="${id}"]`);
  if (row) { row.style.background = 'var(--bg-muted)'; row.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
}
function fitAll() {
  const pts = [
    ...vehicles.map(v => [v.lat, v.lng]),
    ...teams.map(t => [t.lat, t.lng]),
    ...keyPoints.map(k => [k.lat, k.lng]),
  ];
  if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [60, 60] });
}

// ════════════════════════════════════════════════
// CLOCK
// ════════════════════════════════════════════════

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const WDAYS  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function tick() {
  const n = new Date();
  document.getElementById('clock').textContent =
    String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
  document.getElementById('cdate').textContent =
    `${WDAYS[n.getDay()]}, ${n.getDate()} ${MONTHS[n.getMonth()]}`;
}
tick(); setInterval(tick, 1000);

// ════════════════════════════════════════════════
// TOASTS
// ════════════════════════════════════════════════

function toast(title, msg, ms = 4000) {
  const c = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<div class="t-title">${title}</div><div class="t-msg">${msg}</div>`;
  c.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 200); }, ms);
}

// ════════════════════════════════════════════════
// SIMULATION
// ════════════════════════════════════════════════

let simOn = false, simTimer = null;

function toggleSim() {
  simOn = !simOn;
  document.getElementById('sim-btn').textContent = simOn ? '⏸ Pausar' : '▶ Simular';
  if (simOn) {
    toast('Simulação iniciada', 'Veículos em rota sendo movimentados.');
    simTimer = setInterval(simTick, 1200);
  } else {
    clearInterval(simTimer);
    toast('Simulação pausada', 'Movimentação suspensa.');
  }
}

function simTick() {
  if (selectedRouteCoords && selectedVehicleId && !routes.some(r => r.vid === selectedVehicleId)) {
    const v = vehicles.find(x => x.id === selectedVehicleId);
    if (v) {
      selectedRouteProgress = Math.min(100, selectedRouteProgress + 3);
      const pos = getRoutePointAtFraction(selectedRouteCoords, selectedRouteProgress / 100);
      if (pos) {
        v.lat = pos.lat;
        v.lng = pos.lng;
        if (vMarkers[v.id]) vMarkers[v.id].setLatLng([v.lat, v.lng]);
      }
      if (selectedRouteProgress >= 100) {
        toast(`${v.id} chegou!`, `${v.id} chegou ao destino selecionado.`);
        selectedRouteCoords = null;
      }
    }
  }

  routes.forEach(r => {
    const v = vehicles.find(x => x.id === r.vid);
    if (!v) return;
    r.prog = Math.min(100, r.prog + 3);
    const coordList = r.coords && r.coords.length ? r.coords : routeLatLngs(r);
    const pos = getRoutePointAtFraction(coordList, r.prog / 100);
    if (pos) {
      v.lat = pos.lat;
      v.lng = pos.lng;
      if (vMarkers[r.vid]) vMarkers[r.vid].setLatLng([v.lat, v.lng]);
    }

    if (r.prog >= 100) {
      const team = teams.find(x => x.id === r.tid);
      toast(`${v.id} chegou!`, `${v.id} chegou a ${team ? team.location : r.tid}.`);
      if (team) { team.status = 'in-transit'; team.vehicle = null; }
      v.status = 'available';
      vMarkers[v.id].setIcon(vIcon(v));
      if (rLines[r.id]) { map.removeLayer(rLines[r.id]); delete rLines[r.id]; }
    }
  });
  routes = routes.filter(r => r.prog < 100);
  renderAll();
}

// ════════════════════════════════════════════════
// NEW REQUEST
// ════════════════════════════════════════════════

let teamSeq = 5;
const TEAM_NAMES = ['Equipe Echo','Equipe Foxtrot','Equipe Golf','Equipe Hotel','Equipe India'];
const LOCS = ['Berço 09','Pátio Leste','Portão Norte','Torre de Controle','Oficina Central','Armazém 03','Cais 11'];

function newRequest() {
  const name = TEAM_NAMES[Math.floor(Math.random() * TEAM_NAMES.length)];
  const loc  = LOCS[Math.floor(Math.random() * LOCS.length)];
  const lat  = CENTER[0] + (Math.random() - .5) * .016;
  const lng  = CENTER[1] + (Math.random() - .5) * .016;
  const id   = `EQ-${String(teamSeq++).padStart(3,'0')}`;
  const now  = new Date();
  const req  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const t    = { id, name, members: Math.ceil(Math.random() * 5) + 1, location: loc, lat, lng, status:'waiting', req, vehicle:null };

  teams.push(t);
  mountT(t);
  toast('Nova solicitação', `${name} pediu transporte — ${loc}.`);

  const free = vehicles.find(v => v.status === 'available');
  if (free) setTimeout(() => autoAssign(free, t), 1800);

  renderAll();
  document.querySelector('[data-tab="teams"]').click();
}

function autoAssign(v, t) {
  const COLORS = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EC4899'];
  const rid = `RO-${String(routes.length + 1).padStart(3,'0')}`;
  const r = {
    id: rid, vid: v.id, tid: t.id,
    fLat: v.lat, fLng: v.lng, tLat: t.lat, tLng: t.lng,
    prog: 0,
    eta: `${Math.ceil(Math.random() * 8) + 2} min`,
    color: COLORS[routes.length % COLORS.length],
  };
  v.status = 'en-route';
  t.status = 'assigned';
  t.vehicle = v.id;
  const routeData = findTeamRoute(v, t);
  if (routeData) {
    r.path = routeData.path;
    r.coords = RoutingEngine.getPathLatLngs(routeData.path);
    r.totalDistance = routeData.totalDistance;
    drawRoutingPath(r.coords);
  }
  routes.push(r);
  mountRoute(r);
  vMarkers[v.id].setIcon(vIcon(v));
  tMarkers[t.id].setIcon(tIcon(t));
  tMarkers[t.id].setPopupContent(popupT(t));
  toast('Match automático', `${v.id} designado para ${t.name}.`);
  renderAll();
}

// ════════════════════════════════════════════════
// ADD INTERDICTION
// ════════════════════════════════════════════════

let intSeq = 2;
const INT_NAMES = ['Inspeção de Segurança','Obra em Andamento','Operação de Carga','Manutenção Elétrica','Vistoria de Equipamentos'];

function addInterdict() {
  interdictMode = !interdictMode;
  if (interdictMode) {
    toast('Selecione no mapa', 'Clique em um ponto do mapa para criar a interdição.');
  } else {
    toast('Interdição cancelada', 'Nenhum ponto foi bloqueado.');
  }
}

function placeInterdictAt(latlng) {
  const name = INT_NAMES[Math.floor(Math.random() * INT_NAMES.length)];
  const now  = new Date();
  const since = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const until = `${String(now.getHours() + 2).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const i = { id:`INT-${String(intSeq++).padStart(2,'0')}`, name, lat:latlng.lat, lng:latlng.lng, radius:160, reason:name, since, until };
  interdictions.push(i);
  interdictMode = false;
  mountInterdict(i);
  const edge = RoutingEngine.findNearestEdge(latlng.lat, latlng.lng);
  if (edge) {
    RoutingEngine.blockEdge(edge.id);
    drawBlockedEdge(edge);
    toast('Via bloqueada', `Trecho ${edge.id} agora está interditado.`);
    rerouteActivePaths();
  }
  renderAll();
  document.querySelector('[data-tab="alerts"]').click();
}

// ════════════════════════════════════════════════
// BOOT
// ════════════════════════════════════════════════

renderAll();
updateSelectionPanel();
initNetworkViewer();
setTimeout(() => toast('Sistema operacional', 'Rastreamento em tempo real ativo.'), 600);
setTimeout(() => toast('Interdição ativa', 'Pátio Sul interditado para manutenção.'), 2400);
setTimeout(() => toast('VAN-01 disponível', 'Veículo aguardando nova solicitação.'), 4200);
