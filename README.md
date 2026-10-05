<div align="center">

# 🛰️ OrbiMed — Saúde Preditiva & Conectividade Orbital

### _Point-of-Care Molecular, Edge AI e Redundância Espacial para Áreas Remotas_

[![Status](https://img.shields.io/badge/Status-MVP%20Pronto-deff9a?style=for-the-badge&logoColor=05070a)](https://github.com)
[![Platform](https://img.shields.io/badge/Platform-iOS%20Swift%206-38bdf8?style=for-the-badge&logo=apple)](https://developer.apple.com/swift/)
[![Architecture](https://img.shields.io/badge/Architecture-C4%20Model%20%7C%20Edge--First-ffffff?style=for-the-badge)](https://c4model.com/)
[![License](https://img.shields.io/badge/License-Proprietary-gray?style=for-the-badge)](https://orbimed.tech)

<p align="center">
  <b>Democratizando o diagnóstico preditivo e genômico em regiões de vazio assistencial.</b><br>
  Inspirada no programa espacial <i>Artemis</i> da NASA, a <b>OrbiMed</b> combina sensores ópticos Bio-MEMS, processamento local via Swift CoreML e comunicação transparente com satélites de órbita baixa (LEO).
</p>

[🌐 Explorar Landing Page](index.html) • [📊 Painel Executivo](#-entregáveis-executivos)

</div>

---

## 📌 Sumário Executivo

Mais de **65% do território geográfico isolado** no Brasil (comunidades ribeirinhas, terras indígenas, postos de fronteira e minerações remotas) carece de infraestrutura de laboratórios e redes 3G/4G/5G confiáveis. Os exames convencionais e laudos oncológicos demandam de **30 a 90 dias** para retorno e frequentemente sofrem com a quebra da cadeia de frio no transporte biológico precário.

A **OrbiMed** soluciona esse gargalo crítico através de uma plataforma _Point-of-Care Software-First_ de alta viabilidade e resiliência:

1. **Hardware Coletor Acessível (MVP)**: Microcontrolador **ESP32 (R$ 40–60)** atuando como servidor GATT, integrando sensores de saúde de prateleira certificados pela **ANVISA** via **BLE 5.x**. No roadmap de longo prazo, miniaturização com microagulha 0.2mm Bio-MEMS.
2. **Estação de Campo no iPad**: Interface prioritária em **iPadOS (Swift 6)**, otimizada para agentes de campo com gráficos espectrais, prontuários ampliados, segurança via **Secure Enclave/HealthKit** e inferência local offline no **Apple Neural Engine**.
3. **Failover Espacial Starlink (LEO)**: Envio via rede 4G/5G quando disponível; na ausência de sinal terrestre, comutação automática para a antena **Starlink (satélites LEO a 550 km)** com payload ultraleve e latência de 20-40ms.
4. **OrbiBrain em Nuvem (Python / FastAPI)**: Cálculo automatizado de **Risk Score** em menos de 3 minutos, com persistência dupla em **PostgreSQL** e **Object Storage S3**.

---

## 🏗️ Os 3 Pilares do Ecossistema

```text
┌──────────────────────────┐         BLE 5.x         ┌──────────────────────────┐
│  OrbiPen (IoT Provisório)│ ──────────────────────► │  iPad / iOS (OrbiMed App)│
│  - ESP32 / Arduino       │     GATT Standard       │  - Swift 6 / SwiftUI     │
│  - Sensor de Prateleira  │                         │  - Edge Processing       │
└──────────────────────────┘                         └────────────┬─────────────┘
                                                                  │
                                            ┌─────────────────────┴─────────────────────┐
                                            │ Roteamento Inteligente (Hybrid-First)     │
                                            └─────────────────────┬─────────────────────┘
                                                                  │
                           ┌──────────────────────────────────────┴──────────────────────────────────────┐
                           ▼                                                                             ▼
                [Canal Primário Terrestre]                                                    [Canal Orbital Failover]
                Conexão Wi-Fi / 4G local                                                      Wi-Fi via Antena Starlink (LEO)
                (Payload JSON síncrono)                                                       (Payload JSON ultracompacto)
                           │                                                                             │
                           └──────────────────────────────┬──────────────────────────────────────────────┘
                                                          ▼
                                            ┌───────────────────────────┐
                                            │  Cloud Backend (FastAPI)  │
                                            │  - PostgreSQL + S3 Storage│
                                            └─────────────┬─────────────┘
                                                          ▼
                                            ┌───────────────────────────┐
                                            │  OrbiBrain AI (Python)    │
                                            │  - Processamento & Score  │
                                            │  - Retorno em < 3 minutos │
                                            └───────────────────────────┘
```

| Componente | Função | Tecnologias Principais |
| :--- | :--- | :--- |
| **01. OrbiPen (MVP)** | Coleta de biomarcadores via hardware de prateleira de baixo custo (&lt; R$ 150). | ESP32 GATT Server, Sensores ANVISA de prateleira, BLE 5.x, Firmware C / Arduino. Roadmap: Bio-MEMS 0.2mm. |
| **02. OrbiMed iPad Station** | Estação de campo do agente: prontuário, mapa de risco, offline-first e roteamento. | iPad / iPadOS, Swift 6, SwiftUI, Apple HealthKit, Secure Enclave, CoreML Offline. |
| **03. Conectividade Híbrida** | Failover transparente de telecomunicações para áreas sem cobertura celular. | Wi-Fi / 4G Primário, Failover via Antena Starlink (LEO 550 km), JSON/MQTT-SN ultraleve. |
| **04. OrbiBrain & Cloud** | Motor preditivo em nuvem, ingestão assíncrona e emissão de laudo estruturado. | Python / FastAPI, PostgreSQL, S3 Object Storage, PyTorch / SHAP, FHIR R4. |

---

## 🧭 Fluxo de Atendimento do Usuário (5 Etapas no iPad)

1. **Dashboard:** O agente comunitário de saúde abre o app no iPad e visualiza o pareamento automático com a OrbiPen via BLE e o status da conexão (4G ou Starlink LEO).
2. **Identificação:** Cadastro rápido do paciente (nome, idade, queixas e sintomas clínicos prioritários).
3. **Execução:** O sensor encosta no paciente; o iPad faz a leitura em tempo real e armazena os dados brutos na memória local segura (Offline-First).
4. **Comutação de Rede:** O aplicativo detecta a ausência de sinal celular e despacha o pacote binário/JSON ultracompacto via antena Starlink da base comunitária.
5. **Conduta Clínica:** O OrbiBrain processa o risco e a tela do iPad exibe o laudo com o **Risk Score** em menos de 3 minutos (Baixo, Moderado ou Alto Risco), permitindo gerar laudo em PDF, notificar o SUS ou iniciar teleconsulta imediata.

---



## 🗂️ Organização Modular do Código (Separated Concerns)

O projeto foi totalmente refatorado com separação estrita de responsabilidades entre **HTML, CSS e JavaScript**:

```text
.
├── index.html                   # Landing page institucional com Canvas Interativo e C4 Model
├── mobile-prototype.html        # Simulador interativo do iPhone 15 Pro
├── css/
│   ├── styles.css               # Design System dark mode (#05070a), glassmorphism e utilitários
│   └── mobile-prototype.css     # Chassi iPhone, Dynamic Island, radar wave e animações iOS
├── js/
│   ├── tailwind.config.js       # Configuração global de temas, cores (bio-lime, orbital-cyan) e keyframes
│   ├── main.js                  # Engine do Data Flow Canvas, estrelas orbitais e modais da landing page
│   └── mobile-prototype.js      # Máquina de estados, drivers BLE, CoreML e rotas de conectividade
└── README.md                    # Documentação oficial de engenharia e negócios
```

---

## 🎨 Identidade Visual & UI Guidelines

| Token              | Valor Hex / RGBA                     | Aplicação                                                 |
| :----------------- | :----------------------------------- | :-------------------------------------------------------- |
| **Deep Space**     | `#05070a`                            | Fundo principal da aplicação e chassi mobile              |
| **Surface Dark**   | `#0d1522` / `rgba(13, 21, 34, 0.65)` | Cards com efeito glassmorphism e modais                   |
| **Clinical White** | `#ffffff`                            | Tipografia principal de alta legibilidade                 |
| **Bio Lime**       | `#deff9a`                            | Botões primários, microagulha e status de prontidão       |
| **Orbital Cyan**   | `#38bdf8`                            | Feixes de satélite LEO, Bluetooth e indicadores espaciais |
| **Glass Border**   | `rgba(222, 255, 154, 0.12)`          | Delimitação sutil de cards e inputs                       |

---

## 📊 Entregáveis Executivos

- **Painel & Canvas em Tempo Real**: [Visualizar Data Flow Canvas](index.html#fluxo-dados)
- **Contato & Deck Técnico**: Acessível via [invest@orbimed.tech](mailto:invest@orbimed.tech).

---

## 🚀 Como Executar Localmente

Como a aplicação é orientada a padrões web modernos (_ES6 Vanilla, HTML5 Canvas Retina, Tailwind CSS via Engine Modular_), não há necessidade de etapas pesadas de build ou compiladores:

```bash
# Clone ou acesse o diretório do projeto
cd /Users/rodrigobelarmino/Documents/DEV/OrbiMed

# Abrir a Landing Page Institucional
open index.html
```

---

<div align="center">
  <sub>© 2026 OrbiMed Technologies Inc. Todos os direitos reservados. Conformidade médica LGPD / HIPAA / FHIR R4.</sub>
</div>
