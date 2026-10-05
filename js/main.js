/**
 * ORBIMED — ENGINE JAVASCRIPT PRINCIPAL
 * - Telemetria dinâmica simulada
 * - Canvas interativo de fluxo de dados (Data Flow Canvas) com suporte a Retina/HiDPI
 * - Simulação de Failover Orbital LEO
 * - Canvas de partículas estelares de fundo
 * - Alternador de arquitetura C4 Model
 * - Sistema de Modais de Especificações
 */

// Inicialização imediata de ícones Lucide
if (window.lucide) {
  lucide.createIcons()
}

// Latência dinâmica simulada na barra de telemetria
setInterval(() => {
  const latElement = document.getElementById('telemetryLatency')
  if (latElement) {
    const simulated = Math.floor(38 + Math.random() * 12)
    latElement.textContent = `${simulated}ms`
  }
}, 3000)

// ==========================================
// 1. ENGINE DO DATA FLOW CANVAS (ORBIMED)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('orbimedFlowCanvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const toggleBtn = document.getElementById('toggleFailoverBtn')
  const statusLabel = document.getElementById('statusLabel')
  const statusDot = document.querySelector('.status-dot')

  let isLeoMode = false

  // Ajustar resolução para telas Retina/DPI elevado
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
  }
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // Nós do Ecossistema OrbiMed
  const nodes = [
    {
      id: 1,
      label: 'OrbiPen',
      sub: 'ESP32 / BLE GATT',
      x: 0.1,
      y: 0.58,
      icon: '🖊️'
    },
    {
      id: 2,
      label: 'iPad Station',
      sub: 'Swift 6 / Edge',
      x: 0.3,
      y: 0.58,
      icon: '📱'
    },
    {
      id: 3,
      label: 'Starlink LEO',
      sub: 'Órbita 550km',
      x: 0.5,
      y: 0.22,
      icon: '🛰️'
    },
    {
      id: 4,
      label: 'FastAPI Cloud',
      sub: 'Python Backend',
      x: 0.7,
      y: 0.58,
      icon: '⚡'
    },
    {
      id: 5,
      label: 'OrbiBrain AI',
      sub: 'Score < 3min',
      x: 0.9,
      y: 0.58,
      icon: '🧠'
    }
  ]

  // Partículas de Dados
  let particles = []
  for (let i = 0; i < 14; i++) {
    particles.push({
      progress: Math.random(),
      speed: 0.0035 + Math.random() * 0.003
    })
  }

  // Loop de Animação
  function animate() {
    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height

    ctx.clearRect(0, 0, w, h)

    // Posições Calculadas dos Nós
    const coords = nodes.map(n => ({
      ...n,
      px: n.x * w,
      py: n.y * h
    }))

    // Desenhar Conexões (Linhas de Sinal)
    ctx.lineWidth = 2

    // 1. OrbiPen -> App Mobile (BLE)
    drawLine(coords[0], coords[1], '#deff9a', 'BLE 5.3')

    if (!isLeoMode) {
      // Conexão Terrestre Direta: App -> Gateway
      drawLine(coords[1], coords[3], 'rgba(34, 197, 94, 0.6)', '4G / HTTPS')
    } else {
      // Conexão Orbital Failover: App -> Satélite -> Gateway
      drawLine(coords[1], coords[2], '#38bdf8', 'Uplink LEO')
      drawLine(coords[2], coords[3], '#38bdf8', 'Downlink Ground')
    }

    // Gateway -> OrbiBrain (AI)
    drawLine(coords[3], coords[4], '#a855f7', 'gRPC / ML Pipeline')

    // Desenhar Partículas em Movimento
    particles.forEach(p => {
      p.progress += p.speed
      if (p.progress >= 1) p.progress = 0

      let startNode, endNode, color

      if (!isLeoMode) {
        if (p.progress < 0.33) {
          startNode = coords[0]
          endNode = coords[1]
          color = '#deff9a'
        } else if (p.progress < 0.66) {
          startNode = coords[1]
          endNode = coords[3]
          color = '#22c55e'
        } else {
          startNode = coords[3]
          endNode = coords[4]
          color = '#a855f7'
        }
        drawParticle(startNode, endNode, (p.progress % 0.33) * 3, color)
      } else {
        if (p.progress < 0.25) {
          startNode = coords[0]
          endNode = coords[1]
          color = '#deff9a'
        } else if (p.progress < 0.5) {
          startNode = coords[1]
          endNode = coords[2]
          color = '#38bdf8'
        } else if (p.progress < 0.75) {
          startNode = coords[2]
          endNode = coords[3]
          color = '#38bdf8'
        } else {
          startNode = coords[3]
          endNode = coords[4]
          color = '#a855f7'
        }
        drawParticle(startNode, endNode, (p.progress % 0.25) * 4, color)
      }
    })

    // Desenhar os Cards dos Nós
    coords.forEach(drawNodeCard)

    requestAnimationFrame(animate)
  }

  function drawLine(from, to, color, label) {
    ctx.beginPath()
    ctx.setLineDash([6, 6])
    ctx.strokeStyle = color
    ctx.moveTo(from.px, from.py)
    ctx.lineTo(to.px, to.py)
    ctx.stroke()
    ctx.setLineDash([])
  }

  function drawParticle(from, to, localProgress, color) {
    const x =
      from.px + (to.px - from.px) * Math.min(Math.max(localProgress, 0), 1)
    const y =
      from.py + (to.py - from.py) * Math.min(Math.max(localProgress, 0), 1)

    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 14
    ctx.fill()
    ctx.shadowBlur = 0
  }

  function drawNodeCard(node) {
    const cardW = 126
    const cardH = 74
    const x = node.px - cardW / 2
    const y = node.py - cardH / 2

    // Card Glassmorphism
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
    ctx.strokeStyle =
      node.id === 3 && isLeoMode ? '#38bdf8' : 'rgba(222, 255, 154, 0.3)'
    ctx.lineWidth = node.id === 3 && isLeoMode ? 2.5 : 1

    ctx.beginPath()
    ctx.roundRect(x, y, cardW, cardH, 12)
    ctx.fill()
    ctx.stroke()

    // Glow especial se for o satélite com LEO ativado
    if (node.id === 3 && isLeoMode) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'
      ctx.stroke()
    }

    // Texto do Ícone e Título
    ctx.font = '18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(node.icon, node.px, y + 25)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText(node.label, node.px, y + 45)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px sans-serif'
    ctx.fillText(node.sub, node.px, y + 61)
  }

  // Toggle do Failover Orbital
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isLeoMode = !isLeoMode
      if (isLeoMode) {
        statusLabel.textContent = 'Starlink LEO (Failover Ativo)'
        statusLabel.className = 'status-leo'
        statusDot.style.backgroundColor = '#38bdf8'
        statusDot.style.boxShadow = '0 0 10px #38bdf8'
        toggleBtn.querySelector('.btn-text').textContent =
          'Restaurar Conexão Terrestre (4G / Fibra)'
      } else {
        statusLabel.textContent = '4G / Terrestre Ativa'
        statusLabel.className = 'status-online'
        statusDot.style.backgroundColor = '#22c55e'
        statusDot.style.boxShadow = '0 0 10px #22c55e'
        toggleBtn.querySelector('.btn-text').textContent =
          'Simular Redes Terrestres Offline (Ativar Failover Starlink LEO)'
      }
    })
  }

  animate()
})

// ==========================================
// 2. CANVAS DE FUNDO (ESTRELAS ORBITAIS)
// ==========================================
const starsCanvas = document.getElementById('starsCanvas')
if (starsCanvas) {
  const sCtx = starsCanvas.getContext('2d')
  let sW,
    sH,
    stars = []

  function resizeStars() {
    sW = starsCanvas.width = window.innerWidth
    sH = starsCanvas.height = window.innerHeight
  }
  window.addEventListener('resize', resizeStars)
  resizeStars()

  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * sW,
      y: Math.random() * sH,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random()
    })
  }

  function renderStars() {
    sCtx.clearRect(0, 0, sW, sH)
    sCtx.fillStyle = '#deff9a'
    stars.forEach(s => {
      sCtx.globalAlpha = 0.2 + 0.3 * Math.sin(Date.now() * 0.002 + s.x)
      sCtx.beginPath()
      sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      sCtx.fill()
    })
    requestAnimationFrame(renderStars)
  }
  renderStars()
}

// ==========================================
// 3. ALTERNADOR DE ABAS C4 MODEL
// ==========================================
function switchC4Tab(tab) {
  const cards = {
    field: document.getElementById('c4-card-field'),
    orbital: document.getElementById('c4-card-orbital'),
    cloud: document.getElementById('c4-card-cloud')
  }

  const buttons = {
    all: document.getElementById('tab-all'),
    field: document.getElementById('tab-field'),
    orbital: document.getElementById('tab-orbital'),
    cloud: document.getElementById('tab-cloud')
  }

  Object.values(buttons).forEach(btn => {
    if (btn)
      btn.className =
        'px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-all'
  })

  if (buttons[tab]) {
    buttons[tab].className =
      'px-4 py-2 rounded-lg bg-bio-lime text-space-950 font-bold transition-all'
  }

  Object.values(cards).forEach(c => {
    if (!c) return
    c.style.display = 'block'
    c.style.opacity = '1'
    c.style.transform = 'scale(1)'
  })

  if (tab !== 'all') {
    Object.keys(cards).forEach(k => {
      if (k !== tab && cards[k]) {
        cards[k].style.opacity = '0.35'
        cards[k].style.transform = 'scale(0.98)'
      }
    })
  }
}

// ==========================================
// 4. MODAL DE ESPECIFICAÇÕES
// ==========================================
const modalContent = {
  orbipen: `
    <div class="flex items-center space-x-3 text-bio-lime mb-2">
      <i data-lucide="cpu" class="w-6 h-6"></i>
      <h3 class="text-xl font-bold text-white">Especificações: OrbiPen MVP</h3>
    </div>
    <p class="text-xs font-mono text-gray-400 pb-3 border-b border-white/10">HARDWARE IoT — ESP32 / ARDUINO + BIO-MEMS + BLE 5.3</p>
    <div class="space-y-3 text-xs text-gray-300">
      <p>A <strong>OrbiPen</strong> utiliza microcontrolador <strong class="text-bio-lime">ESP32 / Arduino Nano 33 BLE</strong> de baixo custo como base do MVP. Realiza triagem molecular e espectrometria óptica minimamente invasiva, transmitindo via <strong class="text-bio-lime">BLE 5.3</strong> em tempo real ao dispositivo iOS/iPadOS pareado — sem necessidade de transporte de amostras ou refrigeração.</p>
      <div class="grid grid-cols-2 gap-3 pt-2 font-mono">
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Microcontrolador</span>
          <span class="text-white font-bold">ESP32 / Arduino Nano 33</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Conectividade</span>
          <span class="text-bio-lime font-bold">BLE 5.3 + ECDSA</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Espectro óptico</span>
          <span class="text-white font-bold">400nm – 900nm</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Microagulha</span>
          <span class="text-white font-bold">0.2mm estéril</span>
        </div>
      </div>
    </div>
  `,
  app: `
    <div class="flex items-center space-x-3 text-orbital-cyan mb-2">
      <i data-lucide="tablet" class="w-6 h-6"></i>
      <h3 class="text-xl font-bold text-white">Arquitetura: OrbiMed App</h3>
    </div>
    <p class="text-xs font-mono text-gray-400 pb-3 border-b border-white/10">NATIVO UNIVERSAL iOS &amp; iPadOS · SWIFT 6 · APPLE HEALTHKIT</p>
    <div class="space-y-3 text-xs text-gray-300">
      <p>Aplicativo <strong class="text-orbital-cyan">nativo e universal</strong> para iPhone e iPad. No <strong>iPad</strong>, oferece interface ampliada ideal para prontuários, teleconferência e uso por agentes de campo. Opera 100% offline-first, assinando o payload clínico localmente no Secure Enclave e comutando de canal automaticamente via failover <strong class="text-orbital-cyan">Starlink LEO</strong>.</p>
      <div class="grid grid-cols-2 gap-3 pt-2 font-mono">
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Plataformas</span>
          <span class="text-white font-bold">iPhone &amp; iPad (Universal)</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Hub Biométrico</span>
          <span class="text-white font-bold">Apple HealthKit</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">IA de Borda</span>
          <span class="text-white font-bold">CoreML Neural Engine</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Failover</span>
          <span class="text-orbital-cyan font-bold">Wi-Fi &gt; 4G &gt; Starlink</span>
        </div>
      </div>
    </div>
  `,
  brain: `
    <div class="flex items-center space-x-3 text-purple-400 mb-2">
      <i data-lucide="brain" class="w-6 h-6"></i>
      <h3 class="text-xl font-bold text-white">Motor de Inferência: OrbiBrain</h3>
    </div>
    <p class="text-xs font-mono text-gray-400 pb-3 border-b border-white/10">CLOUD PREDICTIVE AI ENGINE</p>
    <div class="space-y-3 text-xs text-gray-300">
      <p>Microsserviços em Go gerenciam ingestão concorrente massiva enquanto redes neurais em PyTorch analisam dados moleculares e predizem scores de risco.</p>
      <div class="grid grid-cols-2 gap-3 pt-2 font-mono">
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Inferência</span>
          <span class="text-white font-bold">&lt; 850ms em GPU</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Padrão</span>
          <span class="text-white font-bold">FHIR R4 / DICOM</span>
        </div>
      </div>
    </div>
  `
}

function openModal(type) {
  const modal = document.getElementById('specModal')
  const content = document.getElementById('modalContent')
  if (modalContent[type]) {
    content.innerHTML = modalContent[type]
    if (window.lucide) lucide.createIcons()
    modal.classList.remove('hidden')
    modal.classList.add('flex')
  }
}

function closeModal() {
  const modal = document.getElementById('specModal')
  if (modal) {
    modal.classList.add('hidden')
    modal.classList.remove('flex')
  }
}

window.addEventListener('click', e => {
  const modal = document.getElementById('specModal')
  if (e.target === modal) closeModal()
})

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal()
})
