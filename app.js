document.addEventListener('DOMContentLoaded', () => {
  // Current Time Clock
  function updateClock() {
    const timeEl = document.getElementById('currentTime')
    if (timeEl) {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      timeEl.textContent = `${hours}:${minutes}`
    }
  }
  setInterval(updateClock, 1000)
  updateClock()

  // Navigation and State
  const screens = {
    1: document.getElementById('screen-1'),
    2: document.getElementById('screen-2'),
    3: document.getElementById('screen-3'),
    4: document.getElementById('screen-4'),
    5: document.getElementById('screen-5')
  }

  let currentScreen = 1

  // Navigation function
  function goToScreen(screenNumber) {
    // Remove active class from all
    Object.values(screens).forEach(screen => {
      if (screen) screen.classList.remove('active')
    })

    // Add to targeted screen
    if (screens[screenNumber]) {
      screens[screenNumber].classList.add('active')
      currentScreen = screenNumber
      onScreenLoad(screenNumber)
    }
  }

  // Dynamic Island feedback helper
  function triggerDynamicIsland(message, duration = 3000) {
    const island = document.getElementById('dynamicIsland')
    const textEl = island.querySelector('.island-text')

    if (island && textEl) {
      textEl.textContent = message
      island.style.width = '240px'
      island.style.justifyContent = 'center'
      textEl.style.opacity = '1'
      textEl.style.pointerEvents = 'auto'

      setTimeout(() => {
        island.style.width = '110px'
        island.style.justifyContent = 'flex-end'
        textEl.style.opacity = '0'
        textEl.style.pointerEvents = 'none'
      }, duration)
    }
  }

  // Event Listeners for Nav buttons
  document.getElementById('goto-screen-2').addEventListener('click', () => {
    goToScreen(2)
  })

  // Back buttons
  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', e => {
      const target = btn.getAttribute('data-target')
      goToScreen(parseInt(target))
    })
  })

  // Form inputs & button validation
  const patientForm = document.getElementById('patientForm')
  const initColetaBtn = document.getElementById('goto-screen-3')

  // Store patient data globally for state reuse
  let patientData = {
    name: '',
    age: '',
    region: '',
    symptoms: ''
  }

  initColetaBtn.addEventListener('click', () => {
    if (patientForm.checkValidity()) {
      patientData.name = document.getElementById('patientName').value
      patientData.age = document.getElementById('patientAge').value
      patientData.region = document.getElementById('patientRegion').value
      patientData.symptoms = document.getElementById('patientSymptoms').value

      // Update screens that display patient info
      document.getElementById('activePatientDisplay').textContent =
        `Paciente: ${patientData.name} (${patientData.age} anos)`
      document.getElementById('finalName').textContent = patientData.name
      document.getElementById('finalAge').textContent =
        `${patientData.age} anos`
      document.getElementById('finalRegion').textContent = patientData.region

      goToScreen(3)
    } else {
      patientForm.reportValidity()
    }
  })

  // Screen 3 progress variables
  const progressRing = document.getElementById('progressRing')
  const progressPercent = document.getElementById('progressPercent')
  const logBody = document.getElementById('logBody')
  const screen3Btn = document.getElementById('goto-screen-4')

  // Circumference of the progress circle
  const radius = progressRing.r.baseVal.value
  const circumference = radius * 2 * Math.PI
  progressRing.style.strokeDasharray = `${circumference} ${circumference}`
  progressRing.style.strokeDashoffset = circumference

  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference
    progressRing.style.strokeDashoffset = offset
    progressPercent.textContent = `${percent}%`
  }

  // Hardware simulation logs queue
  const logsList = [
    { text: 'Iniciando subsistema OrbiPen...', delay: 200, type: 'info' },
    {
      text: 'Realizando escaneamento óptico da derme... OK',
      delay: 1200,
      type: 'ok'
    },
    {
      text: 'Verificando perfusão tecidual periférica... OK',
      delay: 2200,
      type: 'info'
    },
    {
      text: 'Coletando microgota de sangue via microagulha retrátil... OK',
      delay: 3500,
      type: 'ok'
    },
    {
      text: 'Carregando cartucho fluídico integrado... OK',
      delay: 4400,
      type: 'info'
    },
    {
      text: 'Sequenciando biomarcadores genômicos locais...',
      delay: 5500,
      type: 'pending'
    },
    {
      text: 'Transcrevendo assinaturas moleculares a 75%...',
      delay: 7000,
      type: 'pending'
    }
  ]

  let timers = []

  function runExameSimulation() {
    // Reset state
    setProgress(0)
    logBody.innerHTML = ''
    screen3Btn.disabled = true
    screen3Btn.classList.add('disabled')

    // Clear previous timers if any
    timers.forEach(t => clearTimeout(t))
    timers = []

    // Progress percentage animation
    let percent = 0
    const progressInterval = setInterval(() => {
      if (percent < 75) {
        percent++
        setProgress(percent)
      } else {
        clearInterval(progressInterval)
        screen3Btn.disabled = false
        screen3Btn.classList.remove('disabled')
        triggerDynamicIsland('Análise Pausada (75%)')
      }
    }, 80)

    // Render logs dynamically based on scheduled delays
    logsList.forEach(log => {
      const timer = setTimeout(() => {
        const entry = document.createElement('div')
        entry.className = `log-entry log-${log.type}`

        if (log.type === 'ok') {
          entry.innerHTML = `<span>[OK] ${log.text}</span>`
        } else if (log.type === 'pending') {
          entry.innerHTML = `<span>[...] ${log.text}</span>`
        } else {
          entry.innerHTML = `<span>[INFO] ${log.text}</span>`
        }

        logBody.appendChild(entry)
        logBody.scrollTop = logBody.scrollHeight
      }, log.delay)

      timers.push(timer)
    })
  }

  screen3Btn.addEventListener('click', () => {
    goToScreen(4)
  })

  // Screen 4 Uplink Simulation
  const uplinkSpinner = document.getElementById('uplinkSpinner')
  const uplinkStatusText = document.getElementById('uplinkStatusText')
  const uplinkStatusBox = document.getElementById('uplinkStatusBox')
  const screen4Btn = document.getElementById('goto-screen-5')
  let uplinkTimer

  function runUplinkSimulation() {
    // Reset state
    screen4Btn.disabled = true
    screen4Btn.classList.add('disabled')
    uplinkSpinner.style.display = 'block'
    uplinkStatusText.textContent = 'Criptografando & Transmitindo...'
    uplinkStatusText.className = ''

    // Dynamic Island warning
    triggerDynamicIsland('Sem Conexão Terrestre', 3500)

    // Change connection status bar color/text temporarily to indicate failover LEO
    const orbitalBar = document.getElementById('orbitalBar')
    const connectionText = document.getElementById('connectionText')

    orbitalBar.style.borderColor = 'rgba(236, 204, 104, 0.4)'
    orbitalBar.style.background = 'rgba(236, 204, 104, 0.08)'
    connectionText.textContent = 'Uplink Satélite LEO: Transmitindo...'

    clearTimeout(uplinkTimer)
    uplinkTimer = setTimeout(() => {
      uplinkSpinner.style.display = 'none'
      uplinkStatusText.textContent = 'Enviado & Criptografado com Sucesso'
      uplinkStatusText.className = 'uplink-success'

      // Revert orbital bar to Green success
      orbitalBar.style.borderColor = 'rgba(222, 255, 154, 0.2)'
      orbitalBar.style.background = 'rgba(222, 255, 154, 0.05)'
      connectionText.textContent = 'Sincronizado via Rede Orbital LEO'

      screen4Btn.disabled = false
      screen4Btn.classList.remove('disabled')
      triggerDynamicIsland('Uplink Concluído!')
    }, 3000)
  }

  screen4Btn.addEventListener('click', () => {
    goToScreen(5)
  })

    // Screen 5 action buttons and simulations
    const pdfModal = document.getElementById("pdfModal");
    const closePdfModal = document.getElementById("closePdfModal");
    const downloadLink = document.getElementById("downloadLink");
    const pdfProgressBar = document.getElementById("pdfProgressBar");
    const pdfPercentText = document.getElementById("pdfPercentText");
    const pdfStatusDesc = document.getElementById("pdfStatusDesc");

    let pdfInterval;

    document.getElementById("btnPdf").addEventListener("click", () => {
        pdfModal.classList.add("active");
        triggerDynamicIsland("Gerando PDF...");
        
        // Reset PDF progress UI
        pdfProgressBar.style.width = "0%";
        pdfPercentText.textContent = "0%";
        pdfStatusDesc.textContent = "Preparando criptografia de ponta a ponta...";
        downloadLink.style.display = "none";

        let percent = 0;
        clearInterval(pdfInterval);
        pdfInterval = setInterval(() => {
            if (percent < 100) {
                percent += 5;
                pdfProgressBar.style.width = `${percent}%`;
                pdfPercentText.textContent = `${percent}%`;
                if (percent === 50) {
                    pdfStatusDesc.textContent = "Formatando dados clínicos de DNA...";
                }
            } else {
                clearInterval(pdfInterval);
                pdfStatusDesc.textContent = "Relatório PDF gerado com sucesso!";
                
                // Create a mock PDF text content download link
                const reportContent = `
                ====================================================
                ORBIMED CLINICAL REPORT - UPLINK SATELLITE LEO
                ====================================================
                Paciente: ${patientData.name}
                Idade: ${patientData.age} anos
                Região: ${patientData.region}
                Sintomas: ${patientData.symptoms}
                
                ANÁLISE DE BIOMARCADORES ORBIPEN:
                - Escaneamento Derme: OK
                - Amostragem Microgota: OK
                - Sequenciamento Genômico Local: 75% concluído
                
                RESULTADO DO DIAGNÓSTICO DE IA ORBIBRAIN:
                - Risco: Alto Alerta
                - Marcador Identificado: M-ONC.04 (Anomalia Celular)
                - Confiança: 98.4%
                ====================================================
                `;
                const blob = new Blob([reportContent], { type: "text/plain" });
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.style.display = "inline-flex";
                triggerDynamicIsland("PDF Pronto para Baixar!");
            }
        }, 100);
    });

    closePdfModal.addEventListener("click", () => {
        pdfModal.classList.remove("active");
        clearInterval(pdfInterval);
    });

    // Teleconsulta elements
    const teleModal = document.getElementById("teleModal");
    const closeTeleModal = document.getElementById("closeTeleModal");
    const btnDeclineCall = document.getElementById("btnDeclineCall");
    const callingPulseRings = document.getElementById("callingPulseRings");
    const callingStatus = document.getElementById("callingStatus");
    const doctorVideoPreview = document.getElementById("doctorVideoPreview");
    const avatarPlaceholder = document.getElementById("avatarPlaceholder");

    let teleTimer;

    document.getElementById("btnTele").addEventListener("click", () => {
        teleModal.classList.add("active");
        triggerDynamicIsland("Ligando para Urgência...");

        // Reset calling view
        avatarPlaceholder.style.display = "flex";
        callingPulseRings.style.display = "block";
        callingStatus.textContent = "Chamando Teleconsulta de Urgência...";
        doctorVideoPreview.style.display = "none";

        clearTimeout(teleTimer);
        teleTimer = setTimeout(() => {
            // Simulate answer
            avatarPlaceholder.style.display = "none";
            callingPulseRings.style.display = "none";
            callingStatus.textContent = "Conexão Estabelecida com Dr. Silva - Oncológico";
            doctorVideoPreview.style.display = "flex";
            triggerDynamicIsland("Chamada em Andamento");
        }, 2500);
    });

    function hangUpCall() {
        teleModal.classList.remove("active");
        clearTimeout(teleTimer);
        triggerDynamicIsland("Chamada Finalizada");
    }

    closeTeleModal.addEventListener("click", hangUpCall);
    btnDeclineCall.addEventListener("click", hangUpCall);

    document.getElementById("resetFlow").addEventListener("click", (e) => {
        e.preventDefault();
        // Reset form inputs
        patientForm.reset();
        
        // Reset orbital connection indicator text
        const orbitalBar = document.getElementById("orbitalBar");
        const connectionText = document.getElementById("connectionText");
        orbitalBar.style.borderColor = "var(--card-border)";
        orbitalBar.style.background = "rgba(222, 255, 154, 0.05)";
        connectionText.textContent = "Conexão Orbital: Ativa (Satélite LEO)";

        goToScreen(1);
        triggerDynamicIsland("Sessão Reiniciada");
    });

  // Handler when screen becomes active
  function onScreenLoad(screenNumber) {
    if (screenNumber === 3) {
      runExameSimulation()
    } else if (screenNumber === 4) {
      runUplinkSimulation()
    }
  }
})
