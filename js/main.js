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

// Gerador pseudoaleatório criptograficamente seguro (conformidade OWASP / Sonar javascript:S2245)
function getSecureRandom() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return array[0] / (0xffffffff + 1)
  }
  return 0.5
}

// Latência dinâmica simulada na barra de telemetria
setInterval(() => {
  const latElement = document.getElementById('telemetryLatency')
  if (latElement) {
    const simulated = Math.floor(38 + getSecureRandom() * 12)
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
      progress: getSecureRandom(),
      speed: 0.0035 + getSecureRandom() * 0.003
    })
  }

  // Loop de Animação
  function animate() {
    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height

    ctx.clearRect(0, 0, w, h)

    // Posições Calculadas dos Nós Responsivas
    const isMobile = w < 600
    const isTablet = w >= 600 && w < 960
    const cardW = isMobile ? Math.min(Math.max(w * 0.17, 52), 64) : (isTablet ? 98 : 126)
    const cardH = isMobile ? 54 : (isTablet ? 64 : 74)
    const margin = cardW / 2 + (isMobile ? 8 : 16)
    const availableW = w - 2 * margin
    const mobileX = [0, 0.25, 0.5, 0.75, 1.0]

    const coords = nodes.map((n, idx) => {
      const relX = isMobile ? mobileX[idx] : n.x
      return {
        ...n,
        px: isMobile ? margin + relX * availableW : n.x * w,
        py: n.y * h,
        cardW,
        cardH,
        isMobile,
        isTablet
      }
    })

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
    const cardW = node.cardW || 126
    const cardH = node.cardH || 74
    const x = node.px - cardW / 2
    const y = node.py - cardH / 2

    // Card Glassmorphism
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
    ctx.strokeStyle =
      node.id === 3 && isLeoMode ? '#38bdf8' : 'rgba(222, 255, 154, 0.3)'
    ctx.lineWidth = node.id === 3 && isLeoMode ? 2.5 : 1

    ctx.beginPath()
    ctx.roundRect(x, y, cardW, cardH, node.isMobile ? 8 : 12)
    ctx.fill()
    ctx.stroke()

    // Glow especial se for o satélite com LEO ativado
    if (node.id === 3 && isLeoMode) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'
      ctx.stroke()
    }

    if (node.isMobile) {
      ctx.font = '13px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(node.icon, node.px, y + 18)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 8.5px sans-serif'
      const shortLabels = {
        'OrbiPen': 'OrbiPen',
        'iPad Station': 'iPad',
        'Starlink LEO': 'Starlink',
        'FastAPI Cloud': 'Cloud',
        'OrbiBrain AI': 'Brain AI'
      }
      ctx.fillText(shortLabels[node.label] || node.label, node.px, y + 33)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '7.5px sans-serif'
      const shortSubs = {
        'ESP32 / BLE GATT': 'BLE 5.3',
        'Swift 6 / Edge': 'Edge AI',
        'Órbita 550km': 'LEO Sat',
        'Python Backend': 'FastAPI',
        'Score < 3min': '< 3min'
      }
      ctx.fillText(shortSubs[node.sub] || node.sub, node.px, y + 45)
    } else if (node.isTablet) {
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(node.icon, node.px, y + 21)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 10.5px sans-serif'
      ctx.fillText(node.label, node.px, y + 39)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '9px sans-serif'
      ctx.fillText(node.sub, node.px, y + 53)
    } else {
      // Desktop
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
      x: getSecureRandom() * sW,
      y: getSecureRandom() * sH,
      r: getSecureRandom() * 1.5 + 0.5,
      alpha: getSecureRandom()
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
      <h3 class="text-xl font-bold text-white">Especificações: OrbiPen (MVP &amp; Roadmap)</h3>
    </div>
    <p class="text-xs font-mono text-gray-400 pb-3 border-b border-white/10">HARDWARE COLETOR · SOFTWARE-FIRST · ESP32 + SENSORES ANVISA</p>
    <div class="space-y-3 text-xs text-gray-300">
      <p><strong>MVP Pragmático (Hoje):</strong> Microcontrolador <strong class="text-bio-lime">ESP32 / Arduino (R$ 40 a R$ 60)</strong> atuando como servidor GATT, integrando sensores de saúde comerciais já certificados pela <strong class="text-white">ANVISA</strong> (oxímetros, glicosímetros BLE) via leitura de bytes brutos. Custo total &lt; R$ 150.</p>
      <p><strong>Roadmap Futuro (Fase 2):</strong> Miniaturização em dispositivo proprietário com microagulha retrátil de 0.2mm (Bio-MEMS) para biópsia líquida rápida e espectrometria óptica infravermelha (400nm – 900nm).</p>
      <div class="grid grid-cols-2 gap-3 pt-2 font-mono">
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Microcontrolador MVP</span>
          <span class="text-white font-bold">ESP32 GATT Server</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Comunicação</span>
          <span class="text-bio-lime font-bold">BLE 5.x GATT Standard</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Sensores MVP</span>
          <span class="text-white font-bold">Certificados ANVISA</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Visão Longo Prazo</span>
          <span class="text-orbital-cyan font-bold">Bio-MEMS 0.2mm</span>
        </div>
      </div>
    </div>
  `,
  app: `
    <div class="flex items-center space-x-3 text-orbital-cyan mb-2">
      <i data-lucide="tablet" class="w-6 h-6"></i>
      <h3 class="text-xl font-bold text-white">Estação de Campo: OrbiMed no iPad</h3>
    </div>
    <p class="text-xs font-mono text-gray-400 pb-3 border-b border-white/10">SWIFT 6 · iPAD &amp; iPADOS PRIORITÁRIO · PRIVACY-FIRST</p>
    <div class="space-y-3 text-xs text-gray-300">
      <p>O <strong>iPad</strong> foi eleito o hardware prioritário de campo: menor custo de aquisição e tela ampla para visualização de gráficos espectrais, mapas de calor de risco e prontuários ampliados pelo agente comunitário de saúde.</p>
      <p>Opera de forma <strong>100% offline-first</strong>: validações locais no Apple Neural Engine (CoreML), criptografia via Secure Enclave e roteamento inteligente via antena Starlink (LEO) quando sem 4G.</p>
      <div class="grid grid-cols-2 gap-3 pt-2 font-mono">
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Dispositivo Primário</span>
          <span class="text-white font-bold">iPad / iPadOS (Swift 6)</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Segurança</span>
          <span class="text-white font-bold">Secure Enclave + HealthKit</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Edge Processing</span>
          <span class="text-white font-bold">CoreML Offline</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Failover Orbital</span>
          <span class="text-orbital-cyan font-bold">Antena Starlink (LEO)</span>
        </div>
      </div>
    </div>
  `,
  brain: `
    <div class="flex items-center space-x-3 text-purple-400 mb-2">
      <i data-lucide="brain" class="w-6 h-6"></i>
      <h3 class="text-xl font-bold text-white">Motor Preditivo: OrbiBrain AI</h3>
    </div>
    <p class="text-xs font-mono text-gray-400 pb-3 border-b border-white/10">PYTHON (FASTAPI) · POSTGRESQL · S3 STORAGE · RISK SCORE &lt; 3 MIN</p>
    <div class="space-y-3 text-xs text-gray-300">
      <p>O <strong>OrbiBrain</strong> executa pipelines de inteligência artificial em <strong>Python (FastAPI)</strong>. Recebe o payload clínico do iPad, cruza com bases de bioinformática e calcula o <strong>Risk Score</strong> (Baixo, Moderado ou Alto Risco) em menos de 3 minutos.</p>
      <p><strong>Persistência Dupla:</strong> PostgreSQL para dados estruturados/prontuários e Object Storage compatível com S3 para arquivos brutos e logs de espectrometria.</p>
      <div class="grid grid-cols-2 gap-3 pt-2 font-mono">
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">API Framework</span>
          <span class="text-white font-bold">Python / FastAPI</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Persistência</span>
          <span class="text-white font-bold">PostgreSQL + S3</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Tempo de Resposta</span>
          <span class="text-bio-lime font-bold">&lt; 3 minutos</span>
        </div>
        <div class="p-2.5 rounded bg-space-900 border border-white/5">
          <span class="text-gray-500 block">Saída Clínica</span>
          <span class="text-purple-300 font-bold">Laudo PDF / Teleconsulta</span>
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

// ==========================================
// 6. CONTROLE DO MENU RESPONSIVO (MOBILE / iPAD)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn')
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer')
  const menuIconOpen = document.getElementById('menuIconOpen')
  const menuIconClose = document.getElementById('menuIconClose')
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link')

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true'
      mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded))
      mobileMenuDrawer.classList.toggle('hidden')
      if (menuIconOpen && menuIconClose) {
        menuIconOpen.classList.toggle('hidden')
        menuIconClose.classList.toggle('hidden')
      }
    })

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('hidden')
        mobileMenuBtn.setAttribute('aria-expanded', 'false')
        if (menuIconOpen && menuIconClose) {
          menuIconOpen.classList.remove('hidden')
          menuIconClose.classList.add('hidden')
        }
      })
    })
  }
})
