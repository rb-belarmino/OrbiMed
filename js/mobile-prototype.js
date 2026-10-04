/**
 * ORBIMED — MOBILE PROTOTYPE APP CONTROLLER (SWIFT/IOS SIMULATION)
 * Controla as 5 telas móveis, conexão BLE, Edge AI CoreML, failover de rede e persistência local.
 */

// Estado da Aplicação Móvel
const appState = {
  currentScreen: 1,
  selectedBleDevice: 'ESP32 Testbed',
  deviceStatus: 'Conectado (BLE 5.3)',
  patientData: {
    nome: 'Raimundo Nonato',
    idade: '52',
    comunidade: 'Polo Tapajós - Setor 03',
    sintomas: 'Fadiga crônica, picos febris noturnos, dor articular',
    biomarcadores: {
      glicemia: '108 mg/dL',
      spo2: '97%',
      espectroPico: '542 nm'
    }
  },
  networkStatus: 'offline', // 'online' (4G/Wi-Fi) ou 'offline' (LEO Failover)
  analysisCompleted: false,
  riskScore: {
    categoria: 'Baixo Risco Sistêmico',
    porcentagem: '14.2%',
    status: 'Normal',
    detalhes:
      'Assinatura espectrofotométrica sem marcadores inflamatórios agudos.'
  },
  localQueueCount: 3
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  initMobileTime()
  renderScreen(appState.currentScreen)
  if (window.lucide) lucide.createIcons()
})

// Relógio da Status Bar
function initMobileTime() {
  const timeElem = document.getElementById('mobileTimeDisplay')
  if (!timeElem) return

  function update() {
    const now = new Date()
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')
    timeElem.textContent = `${h}:${m}`
  }
  update()
  setInterval(update, 10000)
}

// Navegação entre Telas (1 a 5)
function navigateToScreen(screenNumber) {
  if (screenNumber < 1 || screenNumber > 5) return
  appState.currentScreen = screenNumber
  renderScreen(screenNumber)
  updateDynamicIsland(screenNumber)
}

// Atualizar Dynamic Island
function updateDynamicIsland(screenNumber) {
  const island = document.getElementById('dynamicIslandContent')
  if (!island) return

  if (screenNumber === 3) {
    island.innerHTML = `
      <div class="flex items-center gap-1.5 text-bio-lime">
        <i data-lucide="cpu" class="w-3.5 h-3.5 animate-pulse"></i>
        <span class="text-[10px] font-mono font-bold tracking-tight">CoreML</span>
      </div>
      <div class="w-2 h-2 rounded-full bg-bio-lime animate-ping"></div>
    `
  } else if (screenNumber === 4) {
    const isOffline = appState.networkStatus === 'offline'
    island.innerHTML = `
      <div class="flex items-center gap-1.5 ${isOffline ? 'text-orbital-cyan' : 'text-emerald-400'}">
        <i data-lucide="${isOffline ? 'satellite' : 'wifi'}" class="w-3.5 h-3.5"></i>
        <span class="text-[10px] font-mono font-bold tracking-tight">${isOffline ? 'LEO 550km' : '4G LTE'}</span>
      </div>
      <div class="w-2 h-2 rounded-full ${isOffline ? 'bg-orbital-cyan' : 'bg-emerald-400'} animate-pulse"></div>
    `
  } else {
    island.innerHTML = `
      <div class="w-2.5 h-2.5 rounded-full bg-bio-lime/80"></div>
      <div class="w-2.5 h-2.5 rounded-full bg-camera-lens bg-gray-800 border border-white/20"></div>
    `
  }

  if (window.lucide) lucide.createIcons()
}

// Seletor de Hardware BLE
function selectBleDevice(deviceName) {
  appState.selectedBleDevice = deviceName
  closeBleSelectorModal()
  renderScreen(appState.currentScreen)
  showToastNotification(`Dispositivo alterado para: ${deviceName}`)
}

function openBleSelectorModal() {
  const modal = document.getElementById('bleDeviceModal')
  if (modal) {
    modal.classList.remove('hidden')
    modal.classList.add('flex')
    if (window.lucide) lucide.createIcons()
  }
}

function closeBleSelectorModal() {
  const modal = document.getElementById('bleDeviceModal')
  if (modal) {
    modal.classList.add('hidden')
    modal.classList.remove('flex')
  }
}

// Toggle de Rede Terrestre vs. Offline (LEO)
function toggleNetworkStatus(status) {
  appState.networkStatus = status
  renderScreen(4)
  updateDynamicIsland(4)
}

// Toast Notification no topo da tela do iPhone
function showToastNotification(message) {
  const toast = document.getElementById('mobileToast')
  if (!toast) return
  toast.textContent = message
  toast.classList.remove('opacity-0', '-translate-y-4')
  toast.classList.add('opacity-100', 'translate-y-0')

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0')
    toast.classList.add('opacity-0', '-translate-y-4')
  }, 2400)
}

// Salvar na Fila Local
function saveToLocalQueue() {
  appState.localQueueCount++
  showToastNotification(
    `Laudo arquivado localmente (${appState.localQueueCount} pendentes)`
  )
  const queueBadge = document.getElementById('queueBadgeText')
  if (queueBadge) queueBadge.textContent = `${appState.localQueueCount} offline`
}

// Resetar para Nova Triagem
function resetNewTriage() {
  appState.currentScreen = 1
  appState.analysisCompleted = false
  renderScreen(1)
  updateDynamicIsland(1)
  showToastNotification('Nova sessão de triagem iniciada')
}

// Renderizador Principal das Telas
function renderScreen(screenNumber) {
  const container = document.getElementById('mobileScreenContent')
  if (!container) return

  let html = ''

  switch (screenNumber) {
    case 1:
      html = getScreen1Html()
      break
    case 2:
      html = getScreen2Html()
      break
    case 3:
      html = getScreen3Html()
      break
    case 4:
      html = getScreen4Html()
      break
    case 5:
      html = getScreen5Html()
      break
    default:
      html = getScreen1Html()
  }

  container.innerHTML = html
  if (window.lucide) lucide.createIcons()
}

// ==========================================
// TELAS DO PROTÓTIPO MÓVEL (1 A 5)
// ==========================================

function getScreen1Html() {
  return `
    <div class="space-y-4">
      <!-- Cabeçalho -->
      <div class="flex items-center justify-between pb-1">
        <div>
          <span class="text-[11px] font-mono text-bio-lime uppercase tracking-wider">Módulo de Campo v2.4</span>
          <h2 class="text-xl font-bold text-white tracking-tight">Triagem Point-of-Care</h2>
        </div>
        <div class="w-8 h-8 rounded-full bg-space-850 border border-white/10 flex items-center justify-center">
          <i data-lucide="user" class="w-4 h-4 text-gray-300"></i>
        </div>
      </div>

      <!-- Card Status Hardware Coleta BLE (Requisito 1) -->
      <div class="glass-card rounded-2xl p-4 border-bio-lime/30 relative overflow-hidden space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-bio-lime opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-bio-lime"></span>
            </span>
            <span class="text-xs font-mono font-bold text-white uppercase tracking-tight">Driver BLE Interoperável</span>
          </div>
          <button onclick="openBleSelectorModal()" class="text-[11px] font-mono text-bio-lime hover:underline flex items-center gap-1 bg-bio-lime/10 px-2 py-0.5 rounded border border-bio-lime/20">
            <span>Trocar</span>
            <i data-lucide="chevron-down" class="w-3 h-3"></i>
          </button>
        </div>

        <div class="bg-space-900/90 rounded-xl p-3 border border-white/5 space-y-1.5">
          <div class="text-[11px] text-gray-400 font-mono">Dispositivo Ativo:</div>
          <div class="text-sm font-semibold text-bio-lime flex items-center justify-between">
            <span>${appState.selectedBleDevice}</span>
            <span class="text-[10px] text-gray-400 font-mono">RSSI -46 dBm</span>
          </div>
          <div class="text-[10px] text-gray-400">Sensores Biométricos BLE Standard / OrbiPen Driver</div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div class="p-2 rounded bg-space-900/60 border border-white/5 flex items-center justify-between">
            <span class="text-gray-400">Bateria</span>
            <span class="text-white font-bold">94%</span>
          </div>
          <div class="p-2 rounded bg-space-900/60 border border-white/5 flex items-center justify-between">
            <span class="text-gray-400">Status</span>
            <span class="text-emerald-400 font-bold">Pronto</span>
          </div>
        </div>
      </div>

      <!-- Estatísticas Rápidas da Missão -->
      <div class="grid grid-cols-2 gap-3">
        <div class="p-3 rounded-xl bg-space-900/60 border border-white/10 space-y-1">
          <span class="text-[10px] font-mono text-gray-400">Fila Offline Local</span>
          <div class="text-lg font-bold font-mono text-white flex items-center gap-1.5">
            <i data-lucide="database" class="w-4 h-4 text-orbital-cyan"></i>
            <span id="queueBadgeText">${appState.localQueueCount} offline</span>
          </div>
        </div>
        <div class="p-3 rounded-xl bg-space-900/60 border border-white/10 space-y-1">
          <span class="text-[10px] font-mono text-gray-400">Tempo Médio Edge</span>
          <div class="text-lg font-bold font-mono text-bio-lime flex items-center gap-1.5">
            <i data-lucide="zap" class="w-4 h-4 text-bio-lime"></i>
            <span>&lt; 1.2s</span>
          </div>
        </div>
      </div>

      <!-- Histórico Recente de Triagem -->
      <div class="space-y-2">
        <span class="text-xs font-mono text-gray-400 uppercase tracking-wider">Últimos Pacientes</span>
        <div class="space-y-2">
          <div class="p-2.5 rounded-xl bg-space-900/70 border border-white/5 flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-white">Maria S. Tupinambá (41a)</div>
              <div class="text-[10px] text-gray-400 font-mono">Glicemia 98mg/dL • SpO2 99%</div>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Normal</span>
          </div>
          <div class="p-2.5 rounded-xl bg-space-900/70 border border-white/5 flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-white">Daví Yanomami (18a)</div>
              <div class="text-[10px] text-gray-400 font-mono">Febre Preditiva • Painel Viral</div>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Atenção</span>
          </div>
        </div>
      </div>

      <!-- CTA Iniciar Triagem -->
      <div class="pt-2">
        <button onclick="navigateToScreen(2)" class="w-full bg-bio-lime hover:bg-[#c9f17a] text-space-950 font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(222,255,154,0.3)]">
          <span>Iniciar Nova Coleta de Triagem</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `
}

function getScreen2Html() {
  return `
    <div class="space-y-4">
      <!-- Header com Voltar -->
      <div class="flex items-center justify-between pb-1">
        <button onclick="navigateToScreen(1)" class="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
          <span>Voltar</span>
        </button>
        <span class="text-[11px] font-mono text-bio-lime">Etapa 1 de 4</span>
      </div>

      <div>
        <h2 class="text-xl font-bold text-white tracking-tight">Identificação &amp; Triagem</h2>
        <p class="text-xs text-gray-400">Entrada de dados do paciente e sincronização BLE imediata.</p>
      </div>

      <!-- Badge Dispositivo Conectado -->
      <div class="p-2.5 rounded-xl bg-space-900 border border-bio-lime/20 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2 text-gray-300">
          <i data-lucide="bluetooth" class="w-3.5 h-3.5 text-bio-lime"></i>
          <span>${appState.selectedBleDevice}</span>
        </div>
        <span class="text-bio-lime text-[11px]">Sinal Estável</span>
      </div>

      <!-- Formulário Simplificado Lean -->
      <div class="space-y-3">
        <div>
          <label class="block text-[11px] font-mono text-gray-400 mb-1">Nome do Paciente / Registro de Campo</label>
          <input type="text" value="${appState.patientData.nome}" class="w-full bg-space-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-bio-lime">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-mono text-gray-400 mb-1">Idade</label>
            <input type="text" value="${appState.patientData.idade}" class="w-full bg-space-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-bio-lime">
          </div>
          <div>
            <label class="block text-[11px] font-mono text-gray-400 mb-1">Comunidade</label>
            <input type="text" value="${appState.patientData.comunidade}" class="w-full bg-space-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-bio-lime">
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-mono text-gray-400 mb-1">Queixas Clínicas / Sintomas</label>
          <textarea rows="2" class="w-full bg-space-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-bio-lime">${appState.patientData.sintomas}</textarea>
        </div>
      </div>

      <!-- Leitura Automática BLE -->
      <div class="p-3.5 rounded-xl bg-space-900/90 border border-orbital-cyan/30 space-y-2">
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="text-orbital-cyan font-bold flex items-center gap-1.5">
            <i data-lucide="radio" class="w-3.5 h-3.5 animate-pulse"></i>
            Leitura Bio-Sensorial Instantânea
          </span>
          <span class="text-[10px] text-gray-400">Driver Universal</span>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center font-mono">
          <div class="p-2 rounded bg-space-950/80 border border-white/5">
            <span class="text-[10px] text-gray-400 block">Glicemia</span>
            <span class="text-xs font-bold text-white">${appState.patientData.biomarcadores.glicemia}</span>
          </div>
          <div class="p-2 rounded bg-space-950/80 border border-white/5">
            <span class="text-[10px] text-gray-400 block">SpO2</span>
            <span class="text-xs font-bold text-bio-lime">${appState.patientData.biomarcadores.spo2}</span>
          </div>
          <div class="p-2 rounded bg-space-950/80 border border-white/5">
            <span class="text-[10px] text-gray-400 block">Espectro</span>
            <span class="text-xs font-bold text-orbital-cyan">${appState.patientData.biomarcadores.espectroPico}</span>
          </div>
        </div>
      </div>

      <!-- CTA Avançar para Análise -->
      <div class="pt-2">
        <button onclick="navigateToScreen(3)" class="w-full bg-bio-lime hover:bg-[#c9f17a] text-space-950 font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all">
          <span>Processar com Swift CoreML (Edge)</span>
          <i data-lucide="cpu" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `
}

function getScreen3Html() {
  return `
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between pb-1">
        <button onclick="navigateToScreen(2)" class="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
          <span>Voltar</span>
        </button>
        <span class="text-[11px] font-mono text-bio-lime">Etapa 2 de 4</span>
      </div>

      <div>
        <h2 class="text-xl font-bold text-white tracking-tight">Processamento de Borda</h2>
        <p class="text-xs text-gray-400">Inferência neural nativa e autônoma sem sinal de internet.</p>
      </div>

      <!-- Card CoreML Edge-First (Requisito 2) -->
      <div class="glass-card rounded-2xl p-4 border-bio-lime/30 space-y-3 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-bio-lime font-bold uppercase flex items-center gap-1.5">
            <i data-lucide="cpu" class="w-4 h-4"></i>
            Apple Neural Engine (ANE)
          </span>
          <span class="text-[10px] font-mono text-gray-400">Swift CoreML v3</span>
        </div>

        <!-- Animação do Pipeline de Borda -->
        <div class="py-2 flex items-center justify-between px-2">
          <div class="text-center space-y-1">
            <div class="w-10 h-10 rounded-xl bg-bio-lime/10 border border-bio-lime/30 flex items-center justify-center mx-auto text-bio-lime">
              <i data-lucide="activity" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] font-mono text-gray-300 block">Espectro</span>
          </div>

          <i data-lucide="chevron-right" class="w-4 h-4 text-gray-600"></i>

          <div class="text-center space-y-1">
            <div class="w-10 h-10 rounded-xl bg-orbital-cyan/10 border border-orbital-cyan/30 flex items-center justify-center mx-auto text-orbital-cyan">
              <i data-lucide="binary" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] font-mono text-gray-300 block">CoreML</span>
          </div>

          <i data-lucide="chevron-right" class="w-4 h-4 text-gray-600"></i>

          <div class="text-center space-y-1">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] font-mono text-gray-300 block">Enclave</span>
          </div>
        </div>

        <!-- Indicador de Status Concluído (Requisito 2) -->
        <div class="p-3 rounded-xl bg-space-900 border border-emerald-500/30 flex items-center justify-between">
          <div class="space-y-0.5">
            <div class="text-xs font-bold text-white flex items-center gap-1.5">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
              <span>Análise Concluída</span>
            </div>
            <div class="text-[10px] font-mono text-bio-lime">Análise Genômica / Preditiva de Borda Concluída</div>
          </div>
          <span class="text-[10px] font-mono text-gray-400">380ms</span>
        </div>
      </div>

      <!-- Detalhes do Payload Criptografado -->
      <div class="space-y-2 text-xs font-mono">
        <span class="text-gray-400 uppercase tracking-wider text-[10px]">Parâmetros Extraídos Localmente:</span>
        <div class="p-3 rounded-xl bg-space-900/70 border border-white/5 space-y-1.5 text-gray-300">
          <div class="flex justify-between">
            <span class="text-gray-500">• Assinatura Fotônica:</span>
            <span class="text-white font-bold">400-900nm Validado</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">• Criptografia de Borda:</span>
            <span class="text-orbital-cyan font-bold">AES-GCM-256 + ECDSA</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">• Tamanho do Payload:</span>
            <span class="text-bio-lime font-bold">2.4 KB (Ultra Compacto)</span>
          </div>
        </div>
      </div>

      <!-- CTA Avançar para Envio -->
      <div class="pt-2">
        <button onclick="navigateToScreen(4)" class="w-full bg-orbital-cyan hover:bg-sky-300 text-space-950 font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]">
          <span>Verificar Conectividade &amp; Disparar Uplink</span>
          <i data-lucide="satellite" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `
}

function getScreen4Html() {
  const isOffline = appState.networkStatus === 'offline'

  return `
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between pb-1">
        <button onclick="navigateToScreen(3)" class="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
          <span>Voltar</span>
        </button>
        <span class="text-[11px] font-mono text-bio-lime">Etapa 3 de 4</span>
      </div>

      <div>
        <h2 class="text-xl font-bold text-white tracking-tight">Conectividade &amp; Uplink</h2>
        <p class="text-xs text-gray-400">Simulador de failover automático entre rede terrestre e satélites LEO.</p>
      </div>

      <!-- Toggle de Rede Terrestre (Requisito 3) -->
      <div class="glass-card rounded-2xl p-4 border-white/10 space-y-3">
        <span class="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">Simular Status de Rede Terrestre:</span>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="toggleNetworkStatus('online')" class="py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${!isOffline ? 'bg-emerald-500 text-space-950 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-space-900 text-gray-400 hover:text-white border border-white/5'}">
            <i data-lucide="wifi" class="w-3.5 h-3.5"></i>
            <span>Com Internet</span>
          </button>
          <button onclick="toggleNetworkStatus('offline')" class="py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${isOffline ? 'bg-orbital-cyan text-space-950 shadow-[0_0_15px_rgba(56,189,248,0.4)]' : 'bg-space-900 text-gray-400 hover:text-white border border-white/5'}">
            <i data-lucide="satellite" class="w-3.5 h-3.5"></i>
            <span>Sem Internet (LEO)</span>
          </button>
        </div>
      </div>

      <!-- Condicional de Rota Ativa -->
      ${
        !isOffline
          ? `
        <!-- Modo Terrestre REST API -->
        <div class="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="text-emerald-400 font-bold flex items-center gap-2">
              <i data-lucide="zap" class="w-4 h-4"></i>
              Rota Terrestre Ativa (4G/5G/Wi-Fi)
            </span>
            <span class="text-emerald-400">&lt; 1s Latência</span>
          </div>
          <p class="text-xs text-gray-300">
            Conexão de banda larga detectada. O envio do pacote ocorre diretamente para os endpoints seguros da nuvem OrbiMed (FastAPI / OrbiBrain Gateway).
          </p>
          <div class="p-2.5 rounded-lg bg-space-950/70 text-[10px] font-mono text-gray-400 flex justify-between">
            <span>Protocolo: HTTPS / HTTP3 gRPC</span>
            <span class="text-emerald-400 font-bold">200 OK</span>
          </div>
        </div>
      `
          : `
        <!-- Modo Failover LEO com Radar -->
        <div class="p-4 rounded-2xl bg-sky-950/30 border border-orbital-cyan/40 space-y-3 relative overflow-hidden">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="text-orbital-cyan font-bold flex items-center gap-2">
              <i data-lucide="satellite" class="w-4 h-4 animate-bounce"></i>
              LEO Satellite Failover Ativado
            </span>
            <span class="text-orbital-cyan">Órbita 550km</span>
          </div>

          <!-- Componente de Compressão e Radar Animado -->
          <div class="py-4 flex flex-col items-center justify-center relative">
            <div class="w-16 h-16 rounded-full bg-orbital-cyan/10 border border-orbital-cyan flex items-center justify-center relative">
              <i data-lucide="radio" class="w-7 h-7 text-orbital-cyan"></i>
              <div class="radar-pulse-ring"></div>
              <div class="radar-pulse-ring delay-1"></div>
              <div class="radar-pulse-ring delay-2"></div>
            </div>
            <span class="text-[11px] font-mono text-orbital-cyan mt-3 font-semibold">Uplink Espacial em Curso...</span>
          </div>

          <!-- Compressão de Payload Reduzido (Requisito 3) -->
          <div class="p-2.5 rounded-lg bg-space-950/80 text-[10px] font-mono text-gray-300 space-y-1 border border-orbital-cyan/20">
            <div class="flex justify-between">
              <span class="text-gray-400">Compressão Brotli / Binary:</span>
              <span class="text-white font-bold">92% Redução</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Criptografia:</span>
              <span class="text-orbital-cyan font-bold">ECDSA P-256 no Enclave</span>
            </div>
          </div>
        </div>
      `
      }

      <!-- CTA Gerar Laudo -->
      <div class="pt-2">
        <button onclick="navigateToScreen(5)" class="w-full bg-bio-lime hover:bg-[#c9f17a] text-space-950 font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(222,255,154,0.3)]">
          <span>Finalizar e Emitir Laudo Preditivo</span>
          <i data-lucide="file-check" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `
}

function getScreen5Html() {
  return `
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between pb-1">
        <span class="text-[11px] font-mono text-bio-lime uppercase tracking-wider">Resultado Clínico Oficial</span>
        <span class="text-[10px] font-mono bg-bio-lime/10 text-bio-lime px-2 py-0.5 rounded border border-bio-lime/20">ID #7492-AMZ</span>
      </div>

      <div>
        <h2 class="text-xl font-bold text-white tracking-tight">Laudo Preditivo &amp; Score</h2>
        <p class="text-xs text-gray-400">Classificação com base nos biomarcadores e modelo de risco.</p>
      </div>

      <!-- Card do Risk Score Preditivo (Requisito 4) -->
      <div class="glass-card rounded-2xl p-4 border-bio-lime/40 space-y-3 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono text-gray-300">Índice Preditivo Geral</span>
          <span class="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
            <i data-lucide="check" class="w-3.5 h-3.5"></i>
            ${appState.riskScore.status}
          </span>
        </div>

        <div class="flex items-baseline gap-3">
          <div class="text-4xl font-extrabold font-mono text-bio-lime">${appState.riskScore.porcentagem}</div>
          <div class="text-xs font-bold text-white">${appState.riskScore.categoria}</div>
        </div>

        <!-- Barra de Progresso do Risco -->
        <div class="w-full h-2 rounded-full bg-space-900 overflow-hidden border border-white/10">
          <div class="h-full bg-gradient-to-r from-bio-lime to-emerald-400 rounded-full" style="width: 14.2%"></div>
        </div>

        <p class="text-[11px] text-gray-300 leading-relaxed pt-1">
          ${appState.riskScore.detalhes} Assinatura validada e compatível com parâmetros saudáveis da população ribeirinha.
        </p>
      </div>

      <!-- Identificação do Paciente no Laudo -->
      <div class="p-3 rounded-xl bg-space-900/80 border border-white/5 space-y-1.5 text-xs font-mono">
        <div class="flex justify-between">
          <span class="text-gray-400">Paciente:</span>
          <span class="text-white font-bold">${appState.patientData.nome} (52a)</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">Polo Base:</span>
          <span class="text-white">${appState.patientData.comunidade}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">Dispositivo Coleta:</span>
          <span class="text-bio-lime">${appState.selectedBleDevice}</span>
        </div>
      </div>

      <!-- Ações de Navegação & Persistência Local (Requisito 4) -->
      <div class="space-y-2.5 pt-2">
        <!-- Salvar na Fila Local (Offline) -->
        <button onclick="saveToLocalQueue()" class="w-full bg-space-850 hover:bg-space-800 text-white font-mono text-xs font-bold py-3 px-4 rounded-xl border border-white/15 hover:border-bio-lime/50 flex items-center justify-center gap-2 transition-all">
          <i data-lucide="hard-drive-download" class="w-4 h-4 text-orbital-cyan"></i>
          <span>Salvar na Fila Local (Offline)</span>
        </button>

        <!-- Nova Triagem -->
        <button onclick="resetNewTriage()" class="w-full bg-bio-lime hover:bg-[#c9f17a] text-space-950 font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(222,255,154,0.3)]">
          <i data-lucide="refresh-cw" class="w-4 h-4"></i>
          <span>Nova Triagem</span>
        </button>
      </div>
    </div>
  `
}
