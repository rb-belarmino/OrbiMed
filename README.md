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

Mais de **65% do território geográfico isolado** no Brasil (comunidades ribeirinhas, terras indígenas, postos de fronteira e minerações remotas) carece de infraestrutura de laboratórios e redes 3G/4G/5G confiáveis. Os exames convencionais demandam de **7 a 30 dias** para retorno e frequentemente sofrem com a quebra da cadeia de frio no transporte biológico.

A **OrbiMed** soluciona esse gargalo crítico através de uma plataforma _Point-of-Care_ de alta resiliência:

1. **Coleta Não-Invasiva**: Microagulha estéril de 0.2mm e espectrofotometria óptica seca (400nm–900nm), dispensando refrigeração.
2. **Edge AI Autônomo**: Inferência em tempo de execução via **Apple Neural Engine (ANE)** e modelos neurais **Swift CoreML** diretamente no dispositivo móvel.
3. **Failover Espacial (LEO)**: Envio via rede celular/fibra convencional; na ausência de sinal, comuta automaticamente para o enlace de satélites LEO (550 km), comprimindo e assinando o payload com criptografia militar.

---

## 🏗️ Os 3 Pilares do Ecossistema

```
 ┌─────────────────┐       BLE 5.3        ┌─────────────────────┐
 │  OrbiPen        │ ───────────────────> │  OrbiMed Mobile App │
 │  (IoT Bio-MEMS) │                      │  (Swift 6 / CoreML) │
 └─────────────────┘                      └──────────┬──────────┘
                                                     │
                             ┌───────────────────────┴───────────────────────┐
                             │                                               │
                      [Rede Terrestre]                                [Sem Cobertura]
                             │                                               │
                             ▼                                               ▼
                   ┌───────────────────┐                         ┌───────────────────────┐
                   │ 4G / 5G / Fibra   │                         │ Satélite LEO (550 km) │
                   └─────────┬─────────┘                         └───────────┬───────────┘
                             │                                               │
                             └───────────────────────┬───────────────────────┘
                                                     │ Uplink Criptografado
                                                     ▼
                                         ┌───────────────────────┐
                                         │   Cloud API Gateway   │
                                         │   (Golang / FastAPI)  │
                                         └───────────┬───────────┘
                                                     │
                                                     ▼
                                         ┌───────────────────────┐
                                         │       OrbiBrain       │
                                         │  (AI Engine / PyTorch)│
                                         └───────────────────────┘
```

| Componente                | Função                                                                      | Tecnologias Principais                                                        |
| :------------------------ | :-------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **01. OrbiPen**           | Dispositivo de mão portátil para leitura molecular e fotônica in loco.      | Bio-MEMS, Espectrometria (400-900nm), Microagulha 0.2mm, BLE 5.3, ECDSA.      |
| **02. OrbiMed App**       | Hub móvel híbrido, inferência CoreML nativa e roteamento de conectividade.  | Swift 6, SwiftUI, Apple HealthKit, Swift CoreML, SQLite/SwiftData encriptado. |
| **03. OrbiBrain & Cloud** | Motor preditivo em nuvem, ingestão em massa e emissão de laudos FHIR/DICOM. | Golang Microservices, Python / PyTorch, SHAP Explainability, FHIR R4.         |

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
