# ValeRoute — Documentação de Contexto
> Handoff para Claude Code · Gerado em 13/04/2025

---

## 1. Visão Geral do Projeto

**Nome da solução:** ValeRoute  
**Cliente:** Vale S.A. — Terminal Marítimo de Ponta da Madeira (TMPM)  
**Contexto:** Hackathon interno Vale · Pitch em vídeo de 3 minutos  
**Desafio original:** Melhorar a roteirização em tempo real para conectar veículos operacionais e equipes de campo no Porto Ponta da Madeira, eliminando dependência de processos manuais e comunicação informal (rádio, WhatsApp).

**Métricas exigidas pela Vale:**
- Roteirização em tempo real
- Conexão inteligente entre veículos e equipes operacionais em campo
- Possibilidade de replicação

---

## 2. Arquitetura da Solução

### Camada física — Hardware
- **Microcontrolador:** ESP32 (nacional, ~R$20-40/unidade)
- **Módulo GPS:** NEO-8M (u-blox), via serial ao ESP32
- **Comunicação principal:** LoRaWAN (longo alcance, baixo consumo, até 15km em área aberta)
- **Comunicação fallback:** 4G/LTE (módulo SIM7600)
- **Form factor:** Dispositivo compacto octogonal, base côncava para fixação em veículos

### Camada de comunicação
```
ESP32 + NEO-8M → LoRaWAN (RF) → Gateway → Internet → MQTT Broker → API REST/WebSocket → Frontend
```

### Payload transmitido por mensagem
```json
{
  "device_id": "VLE-3821",
  "lat": -2.5520,
  "lng": -44.3610,
  "timestamp": "2025-04-13T06:32:00Z",
  "velocidade": 28,
  "status": "routing"
}
```
> Metadados do veículo (placa, tipo, equipe) ficam no servidor, vinculados ao device_id. O hardware só transmite localização e status.

### Camada de software
- **Mapa:** Leaflet.js + OpenStreetMap
- **Roteirização inteligente:** Claude API (Anthropic) — decide qual veículo alocar e qual rota sugerir
- **Frontend:** HTML puro, zero dependência de servidor para rodar (exceto para tiles do OSM)
- **Stack:** HTML/CSS/JS, Leaflet.js via CDN, Geist font via Google Fonts

---

## 3. Design System Aprovado

**Estética:** Branco/cinza, inspiração macOS + Cinnamon/XFCE + softwares de gestão industrial (Ignite, Sensolus)  
**Princípio:** Leveza, limpeza, sutileza. Cor apenas para status. Zero gradientes, zero dark mode agressivo.

### Paleta
```css
--white:      #ffffff;
--surface:    #f9f9f9;
--muted:      #f2f2f2;
--border:     #e4e4e4;
--border2:    #c8c8c8;
--text1:      #1a1a1a;
--text2:      #555555;
--text3:      #aaaaaa;
--text4:      #d0d0d0;

/* Status — único uso de cor */
--green:      #1a8c5a;   /* online / disponível */
--green-bg:   #f0faf5;
--green-br:   #b8e8d0;
--amber:      #956a00;   /* idle / aguardando */
--amber-bg:   #fefaf0;
--amber-br:   #f0dfa0;
--red:        #c0392b;   /* offline / interdição */
--red-bg:     #fff5f5;
--red-br:     #f0c0bc;
--blue:       #2056c0;   /* em rota */
--blue-bg:    #f0f5ff;
--blue-br:    #b8ccf0;
```

### Tipografia
- **Display/UI:** Geist (Google Fonts) — weights 300, 400, 500
- **Dados técnicos / placas:** Geist Mono — weights 400, 500
- **NUNCA usar:** Inter, Roboto, Arial, system fonts

### Botões — IMPORTANTE
> **Todos os botões têm fundo branco.** Nenhum botão deve ter background escuro/preto.
> Diferenciação feita apenas por cor do texto e espessura da borda.

```css
.btn {
  background: #ffffff;
  border: 0.5px solid #c8c8c8;
  color: #1a1a1a;
  border-radius: 6px;
  font-family: 'Geist', sans-serif;
  font-size: 12px;
}
.btn:hover { background: #f9f9f9; }
/* NUNCA: background: #1a1a1a ou qualquer fill escuro */
```

### Mapa
- Tiles OSM com filtro CSS: `filter: saturate(0.2) brightness(1.06)` — dessaturado, suave
- Marcadores: círculos brancos com borda colorida por tipo de veículo
- Popups: fundo branco, borda 0.5px, radius 8px, sem sombra pesada

---

## 4. Coordenadas do Porto — ATENÇÃO ÀS IMPRECISÕES

### ⚠️ Aviso crítico sobre coordenadas

As coordenadas geradas automaticamente por IA (incluindo versões anteriores deste projeto) são **imprecisas e não devem ser usadas**. Apenas as coordenadas abaixo foram verificadas manualmente no Google Maps pelo desenvolvedor do projeto.

O Regulamento Portuário oficial da Vale (2025, Rev. 02, Art. 8) fornece coordenadas arredondadas em minutos inteiros — úteis como referência, mas menos precisas que as verificadas abaixo.

A Tábua de Marés da Marinha (DHN, F-41-412-001/91, atualizada 2020) registra a estação maregráfica do terminal em `02° 33'.9 S, 044° 22'.7 W`, confirmando a faixa geral das coordenadas.

### ✅ Coordenadas verificadas manualmente (usar estas)

```
Pier 4          -2.5516093787565404,  -44.37886196991344
Pier 3          -2.5623676208640966,  -44.379214049076126
Pier 1          -2.5660185044179937,  -44.378238787848936
Ponta da Madeira (terra)  -2.565083133064946,   -44.37528724511482
Portaria do Pier 4        -2.559505434070152,   -44.36466766976164
Portaria do Pier III      -2.5646636502314757,  -44.37662488749419
Portaria do Pier 1        -2.5657101572383048,  -44.37705623441668
Subestação SE-3150K-01    -2.5603999155329635,  -44.36282647717872
Virador de Vagões         -2.5680293295264036,  -44.34465188856429
```

### ❌ Coordenadas incorretas que NÃO devem ser usadas
As seguintes estimativas foram geradas por IA e estão erradas — não usar:
```
# ERRADAS — não usar
Pier I:          -2.5480, -44.3820   ← INCORRETO
Pier III:        -2.5530, -44.3760   ← INCORRETO
Pier IV:         -2.5620, -44.3850   ← INCORRETO
Portaria:        -2.5590, -44.3640   ← INCORRETO
Pátio estoc.:    -2.5560, -44.3590   ← INCORRETO
```

### 📍 Pontos pendentes de verificação
```
Núcleo de Apoio Vale   — coordenadas não verificadas ainda
Área de Armazenagem    — coordenadas não verificadas ainda
Área de Empilhamento   — coordenadas não verificadas ainda
Área de Recuperação    — coordenadas não verificadas ainda
```

### Centro do mapa recomendado
```javascript
map.setView([-2.5600, -44.3700], 14);
```

---

## 5. Estrutura Operacional do Terminal (fontes oficiais)

Fonte: Regulamento Portuário TMPM 2025 (Vale, Rev. 02, 10/04/2025)

- **Operação:** 24 horas, 7 dias por semana (Art. 29)
- **Piers ativos:** 3 piers, 5 berços de atracação
  - Pier 1: 1 berço · 490m operacional · DWT máx 410.000t · profundidade 24m
  - Pier 3: 2 berços (3N e 3S) · 671,9m operacional · DWT máx 410.000t (3S) e 215.000t (3N)
  - Pier 4: 2 berços (4N e 4S) · 510m operacional · DWT máx preferencial 320.000t · profundidade 25m
- **Segurança:** ISPS Nível 1 (Art. 50) — protocolo internacional
- **Controle de acesso:** "A entrada e o fluxo de veículos, equipamentos, cargas ou pessoas na Área do Terminal depende de autorização da Administração do Terminal." (Art. 60) — **este é o problema que o ValeRoute resolve**
- **Fluxo operacional:** Descarga (trem) → Empilhamento → Armazenagem → Recuperação → Embarque (pier)

---

## 6. Funcionalidades do Frontend (index.html)

### Implementadas
- [x] Mapa Leaflet.js com OpenStreetMap centrado no porto
- [x] Tiles dessaturados (estilo clean)
- [x] Painel lateral: busca por placa/equipe, filtros por tipo, lista de veículos
- [x] Marcadores por tipo: L (leve/verde), P (pesado/amber), C (carga/azul)
- [x] Detalhe do veículo ao clicar
- [x] Simulação de movimentação em tempo real (a cada 3s)
- [x] Alerta de via interditada
- [x] Rota ativa (azul tracejado) e rota recalculada (amber tracejado)
- [x] Modal de nova requisição de veículo
- [x] IA simula alocação de veículo com ETA
- [x] Toast de confirmação
- [x] Badge "IA Routing" com status

### Pendente / próximos passos
- [ ] Substituir coordenadas simuladas pelas verificadas (seção 4)
- [ ] Marcar os piers reais no mapa com labels
- [ ] Marcar portarias, subestação e virador de vagões
- [ ] Integrar Claude API real para decisão de roteamento
- [ ] Adicionar simulação de interdição clicável no mapa
- [ ] Polir animação de rota (usar Leaflet.Polyline.animate ou similar)
- [ ] Adicionar render/mockup do hardware ESP32 no vídeo

---

## 7. Frota Simulada (dados mock)

```javascript
const VEHICLES = [
  { id:'VLE-3821', tipo:'leve',   status:'routing', equipe:'Eq. Manutenção A', vel:'28 km/h' },
  { id:'VPE-0047', tipo:'pesado', status:'idle',    equipe:'Eq. Logística B',  vel:'0 km/h'  },
  { id:'VCG-1193', tipo:'carga',  status:'routing', equipe:'Eq. Embarque',     vel:'15 km/h' },
  { id:'VLE-2204', tipo:'leve',   status:'offline', equipe:'Eq. Segurança',    vel:'—'       },
  { id:'VPE-0091', tipo:'pesado', status:'idle',    equipe:'Eq. Recuperação',  vel:'0 km/h'  },
  { id:'VLE-0312', tipo:'leve',   status:'online',  equipe:'Eq. Manutenção B', vel:'0 km/h'  },
  { id:'VCG-0774', tipo:'carga',  status:'routing', equipe:'Eq. Carga Norte',  vel:'12 km/h' },
  { id:'VLE-1105', tipo:'leve',   status:'online',  equipe:'Eq. Inspeção',     vel:'0 km/h'  },
];
```

**Status possíveis:** `routing` (em rota/azul), `online` (disponível/verde), `idle` (aguardando/amber), `offline` (vermelho)  
**Tipos:** `leve`, `pesado`, `carga`

---

## 8. Estrutura de Arquivos

```
vale-porto/
├── index.html      ← aplicação completa (HTML puro, abre no navegador)
└── CONTEXT.md      ← este arquivo
```

Para rodar com mapa:
```bash
cd vale-porto
python3 -m http.server 8080
# Abrir: http://localhost:8080
```

---

## 9. Referências e Fontes Consultadas

| Documento | Fonte | Relevância |
|---|---|---|
| Regulamento Portuário TMPM 2025 | Vale S.A. (uso externo) | Coordenadas oficiais, estrutura operacional, Art. 60 |
| Tábua de Marés F-41-412-001/91 | Marinha do Brasil / DHN (atualizado 2020) | Confirma localização da estação maregráfica |
| Verificação manual Google Maps | Desenvolvedor do projeto | **Fonte primária de coordenadas — usar estas** |
| Wikipedia — Ponta da Madeira | Público | Contexto geral |
| Sensolus (sensolus.com) | Referência de produto | Inspiração de interface e funcionalidades |

---

## 10. Notas para o Pitch

- **Duração:** Vídeo de 3 minutos
- **Banca:** Mista (técnico + negócio)
- **Diferencial:** Hardware nacional (ESP32 + LoRaWAN), IA de roteamento integrada, solução específica para porto — não genérica
- **Frase-chave do regulamento para usar no pitch:** "A entrada e o fluxo de veículos, equipamentos, cargas ou pessoas na Área do Terminal depende de autorização da Administração do Terminal." (Art. 60 — hoje feito manualmente)
- **Argumento de replicabilidade:** Hardware barato, protocolo aberto (LoRaWAN), software web — pode ser implantado em qualquer terminal portuário ou mineração

---

*Documento gerado por Claude (Anthropic) com base em conversa de desenvolvimento — 13/04/2025*
