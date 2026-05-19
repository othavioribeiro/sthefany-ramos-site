import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = join(__dirname, 'Apresentacao-Site-Sthefany-Ramos.pdf');

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Raleway:wght@300;400;500;600;700&display=swap');

  :root {
    --rg: #C9956C;
    --rg-dark: #A67A52;
    --rg-light: #E8C5A8;
    --dark: #2C2416;
    --mid: #5C5044;
    --muted: #9B8E82;
    --ivory: #FAF8F4;
    --dove: #EAE5DE;
    --white: #FFFFFF;
  }

  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Raleway',sans-serif; background:#fff; color:var(--dark); }

  /* ── CAPA ── */
  .cover {
    width:100%; height:100vh; min-height:297mm;
    background: linear-gradient(150deg, #2C2416 0%, #3d3020 50%, #2C2416 100%);
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    text-align:center; padding:60px;
    page-break-after: always;
    position:relative; overflow:hidden;
  }
  .cover::before {
    content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse at 30% 40%, rgba(201,149,108,.18) 0%, transparent 55%),
                radial-gradient(ellipse at 70% 70%, rgba(201,149,108,.1) 0%, transparent 50%);
  }
  .cover-logo {
    font-family:'Playfair Display',serif;
    font-size:72px; font-style:italic;
    color: var(--rg-light);
    margin-bottom:8px;
    position:relative;
  }
  .cover-sub {
    font-size:11px; letter-spacing:.28em;
    text-transform:uppercase; color:rgba(255,255,255,.5);
    margin-bottom:64px; position:relative;
  }
  .cover-title {
    font-family:'Playfair Display',serif;
    font-size:32px; font-weight:600;
    color:#fff; line-height:1.3; margin-bottom:16px;
    position:relative;
  }
  .cover-title em { font-style:italic; color:var(--rg-light); }
  .cover-desc {
    font-size:14px; color:rgba(255,255,255,.55);
    line-height:1.8; max-width:480px;
    position:relative;
  }
  .cover-date {
    position:absolute; bottom:40px; right:60px;
    font-size:11px; color:rgba(255,255,255,.3);
    letter-spacing:.1em;
  }
  .cover-line {
    width:60px; height:2px;
    background: linear-gradient(to right, transparent, var(--rg), transparent);
    margin:32px auto;
    position:relative;
  }

  /* ── PÁGINAS ── */
  .page {
    width:100%; padding:60px 70px;
    page-break-after: always;
    min-height:297mm;
    background:#fff;
    position:relative;
  }
  .page:last-child { page-break-after: auto; }

  /* Header de página */
  .page-header {
    display:flex; align-items:center;
    gap:16px; margin-bottom:48px;
    padding-bottom:20px;
    border-bottom:2px solid var(--dove);
  }
  .page-num {
    width:36px; height:36px; border-radius:50%;
    background:var(--rg); color:#fff;
    display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:700; flex-shrink:0;
  }
  .page-tag {
    font-size:9px; letter-spacing:.28em; text-transform:uppercase;
    color:var(--rg); display:block; margin-bottom:4px;
  }
  .page-title {
    font-family:'Playfair Display',serif;
    font-size:26px; font-weight:600; color:var(--dark); line-height:1.2;
  }
  .page-title em { font-style:italic; color:var(--rg); }

  /* Footer de página */
  .page-footer {
    position:absolute; bottom:28px; left:70px; right:70px;
    display:flex; justify-content:space-between; align-items:center;
    border-top:1px solid var(--dove); padding-top:12px;
  }
  .page-footer span { font-size:9px; color:var(--muted); letter-spacing:.08em; }

  /* ── COMPONENTES ── */
  .section { margin-bottom:40px; }
  .section-title {
    font-family:'Playfair Display',serif;
    font-size:16px; font-weight:600; color:var(--dark);
    margin-bottom:16px;
    padding-left:14px;
    border-left:3px solid var(--rg);
  }

  /* Cards de info */
  .cards { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:28px; }
  .cards-2 { grid-template-columns:repeat(2,1fr); }
  .card {
    background:var(--ivory); border-radius:10px;
    padding:20px; border:1px solid var(--dove);
  }
  .card-icon { font-size:22px; margin-bottom:10px; }
  .card-label {
    font-size:9px; font-weight:700; letter-spacing:.2em;
    text-transform:uppercase; color:var(--rg); margin-bottom:6px;
  }
  .card-value {
    font-family:'Playfair Display',serif;
    font-size:18px; font-weight:600; color:var(--dark);
  }
  .card-desc { font-size:11px; color:var(--mid); line-height:1.6; margin-top:6px; }

  /* Tabelas */
  table { width:100%; border-collapse:collapse; margin-bottom:24px; }
  th {
    background:var(--dark); color:#fff;
    font-size:10px; font-weight:600; letter-spacing:.12em;
    text-transform:uppercase; padding:10px 14px; text-align:left;
  }
  th:first-child { border-radius:6px 0 0 0; }
  th:last-child  { border-radius:0 6px 0 0; }
  td { padding:10px 14px; font-size:12px; color:var(--mid); border-bottom:1px solid var(--dove); }
  tr:hover td { background:var(--ivory); }
  .tag-ok   { background:#d4edda; color:#155724; padding:2px 8px; border-radius:50px; font-size:10px; font-weight:700; }
  .tag-tech { background:rgba(201,149,108,.12); color:var(--rg-dark); padding:2px 8px; border-radius:50px; font-size:10px; font-weight:700; }

  /* Timeline */
  .timeline { position:relative; padding-left:28px; }
  .timeline::before { content:''; position:absolute; left:8px; top:6px; bottom:0; width:2px; background:var(--dove); }
  .tl-item { position:relative; margin-bottom:20px; }
  .tl-dot {
    position:absolute; left:-24px; top:4px;
    width:12px; height:12px; border-radius:50%;
    background:var(--rg); border:2px solid #fff;
    box-shadow:0 0 0 2px var(--rg-light);
  }
  .tl-label { font-size:9px; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:var(--rg); margin-bottom:3px; }
  .tl-text  { font-size:12px; color:var(--mid); line-height:1.6; }

  /* Paleta de cores */
  .palette { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; }
  .color-chip {
    display:flex; flex-direction:column; align-items:center; gap:6px;
  }
  .chip { width:52px; height:52px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,.1); }
  .chip-label { font-size:9px; color:var(--mid); text-align:center; font-weight:600; }
  .chip-hex   { font-size:9px; color:var(--muted); }

  /* Badges de tecnologia */
  .tech-list { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
  .tech-badge {
    background:var(--dark); color:var(--rg-light);
    padding:5px 14px; border-radius:50px;
    font-size:10px; font-weight:700; letter-spacing:.08em;
  }

  /* Seções do site */
  .sections-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
  .sitem {
    display:flex; align-items:center; gap:12px;
    background:var(--ivory); border-radius:8px;
    padding:12px 16px; border:1px solid var(--dove);
  }
  .sitem-num {
    width:28px; height:28px; border-radius:50%;
    background:var(--rg); color:#fff;
    display:flex; align-items:center; justify-content:center;
    font-size:11px; font-weight:700; flex-shrink:0;
  }
  .sitem-name { font-size:12px; font-weight:600; color:var(--dark); }
  .sitem-desc { font-size:10px; color:var(--muted); margin-top:2px; }

  /* Logos grid */
  .logos-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .logo-card {
    border:1px solid var(--dove); border-radius:8px;
    overflow:hidden;
  }
  .logo-preview {
    height:72px; display:flex; align-items:center; justify-content:center;
    font-family:'Playfair Display',serif; font-style:italic; font-size:18px;
  }
  .logo-card-label { padding:8px 12px; font-size:10px; color:var(--mid); font-weight:600; border-top:1px solid var(--dove); }

  /* Pipeline */
  .pipeline {
    display:flex; align-items:center;
    gap:0; background:var(--ivory);
    border-radius:12px; padding:24px; border:1px solid var(--dove);
    margin-bottom:20px;
  }
  .pipe-step {
    flex:1; text-align:center; position:relative;
  }
  .pipe-step::after {
    content:'→'; position:absolute; right:-12px; top:50%;
    transform:translateY(-50%); color:var(--rg);
    font-size:18px; font-weight:700;
  }
  .pipe-step:last-child::after { display:none; }
  .pipe-icon { font-size:28px; margin-bottom:8px; }
  .pipe-name { font-size:11px; font-weight:700; color:var(--dark); }
  .pipe-desc { font-size:9px; color:var(--muted); margin-top:2px; }

  /* Métricas */
  .metrics { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
  .metric {
    text-align:center; padding:20px 12px;
    background:var(--ivory); border-radius:10px;
    border:1px solid var(--dove);
  }
  .metric-num {
    font-family:'Playfair Display',serif;
    font-size:28px; font-weight:700; color:var(--rg);
    line-height:1;
  }
  .metric-label { font-size:9px; text-transform:uppercase; letter-spacing:.15em; color:var(--muted); margin-top:6px; }

  /* Alerta / destaque */
  .alert {
    background:rgba(201,149,108,.08); border-left:4px solid var(--rg);
    border-radius:0 8px 8px 0; padding:16px 20px;
    margin-bottom:20px;
  }
  .alert-title { font-size:12px; font-weight:700; color:var(--rg-dark); margin-bottom:6px; }
  .alert-text  { font-size:11px; color:var(--mid); line-height:1.7; }

  ul.list { padding-left:18px; }
  ul.list li { font-size:12px; color:var(--mid); line-height:2; }
  ul.list li strong { color:var(--dark); }
</style>
</head>
<body>

<!-- ══════════ CAPA ══════════ -->
<div class="cover">
  <div class="cover-logo">Sthefany Ramos</div>
  <div class="cover-sub">Uma Voz Dessa Geração</div>
  <div class="cover-line"></div>
  <div class="cover-title">Documentação Técnica<br>do <em>Site Oficial</em></div>
  <div class="cover-desc">
    Estrutura completa, tecnologias utilizadas, pipeline de deploy,
    infraestrutura e decisões de design do site sthefanyramos.com.br
  </div>
  <div class="cover-date">Abril 2026</div>
</div>

<!-- ══════════ PÁG 1 — VISÃO GERAL ══════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-num">1</div>
    <div>
      <span class="page-tag">Introdução</span>
      <div class="page-title">Visão <em>Geral</em> do Projeto</div>
    </div>
  </div>

  <div class="metrics">
    <div class="metric"><div class="metric-num">11</div><div class="metric-label">Seções do Site</div></div>
    <div class="metric"><div class="metric-num">3</div><div class="metric-label">Arquivos Core</div></div>
    <div class="metric"><div class="metric-num">9</div><div class="metric-label">Logos Gerados</div></div>
    <div class="metric"><div class="metric-num">100%</div><div class="metric-label">Gratuito</div></div>
  </div>

  <div class="section">
    <div class="section-title">Objetivo</div>
    <p style="font-size:13px;color:var(--mid);line-height:1.9;margin-bottom:20px;">
      Site institucional e de vendas para <strong>Sthefany Ramos</strong>, cantora de cerimônias de casamento,
      ministra de louvor e artista para eventos corporativos. O site tem como objetivo principal
      converter visitantes em clientes através de uma experiência visual premium, conteúdo
      estratégico e chamadas para ação direcionadas ao WhatsApp e formulário de contato.
    </p>
  </div>

  <div class="section">
    <div class="section-title">Stack Tecnológico</div>
    <div class="tech-list">
      <span class="tech-badge">HTML5 Semântico</span>
      <span class="tech-badge">CSS3 Custom Properties</span>
      <span class="tech-badge">Vanilla JavaScript</span>
      <span class="tech-badge">GSAP 3.12</span>
      <span class="tech-badge">Lenis 1.1</span>
      <span class="tech-badge">ScrollTrigger</span>
      <span class="tech-badge">Google Fonts</span>
      <span class="tech-badge">Font Awesome 6.5</span>
      <span class="tech-badge">Formspree</span>
      <span class="tech-badge">Vercel</span>
      <span class="tech-badge">GitHub</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Filosofia de Desenvolvimento</div>
    <div class="cards">
      <div class="card">
        <div class="card-icon">⚡</div>
        <div class="card-label">Performance</div>
        <div class="card-desc">Site estático sem frameworks pesados. Carregamento rápido, sem banco de dados ou servidor.</div>
      </div>
      <div class="card">
        <div class="card-icon">🛡️</div>
        <div class="card-label">Resiliência</div>
        <div class="card-desc">Todo efeito JS tem fallback CSS. Se GSAP falhar, o site permanece visível e funcional.</div>
      </div>
      <div class="card">
        <div class="card-icon">💎</div>
        <div class="card-label">Luxury Design</div>
        <div class="card-desc">Paleta Rosé Gold, fontes premium, efeitos cinematográficos e micro-interações elegantes.</div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>STHEFANY RAMOS — DOCUMENTAÇÃO TÉCNICA</span>
    <span>sthefanyramos.com.br</span>
  </div>
</div>

<!-- ══════════ PÁG 2 — ESTRUTURA DE ARQUIVOS ══════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-num">2</div>
    <div>
      <span class="page-tag">Arquitetura</span>
      <div class="page-title">Estrutura de <em>Arquivos</em></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Organização do Projeto</div>
    <table>
      <tr><th>Arquivo / Pasta</th><th>Tipo</th><th>Descrição</th></tr>
      <tr><td><strong>index.html</strong></td><td><span class="tag-tech">HTML</span></td><td>Página principal — toda estrutura do site em um único arquivo</td></tr>
      <tr><td><strong>css/style.css</strong></td><td><span class="tag-tech">CSS</span></td><td>Todos os estilos, variáveis, animações e responsividade</td></tr>
      <tr><td><strong>js/main.js</strong></td><td><span class="tag-tech">JS</span></td><td>Toda interatividade: scroll, tabs, FAQ, slider, GSAP, cursor</td></tr>
      <tr><td>js/vendor/gsap.min.js</td><td><span class="tag-tech">LIB</span></td><td>GSAP — animações profissionais (self-hosted)</td></tr>
      <tr><td>js/vendor/ScrollTrigger.min.js</td><td><span class="tag-tech">LIB</span></td><td>Plugin GSAP para animações no scroll (self-hosted)</td></tr>
      <tr><td>js/vendor/lenis.min.js</td><td><span class="tag-tech">LIB</span></td><td>Smooth scroll cinematográfico (self-hosted)</td></tr>
      <tr><td>images/</td><td><span class="tag-tech">MÍDIA</span></td><td>Fotos otimizadas (JPG) e vídeos de loop (MP4)</td></tr>
      <tr><td>logos/png/</td><td><span class="tag-tech">BRAND</span></td><td>9 versões do logotipo em PNG geradas via Puppeteer</td></tr>
      <tr><td>dist/</td><td><span class="tag-tech">DEPLOY</span></td><td>Pasta de deploy — espelho otimizado enviado ao Vercel</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Arquivos de Mídia</div>
    <table>
      <tr><th>Arquivo</th><th>Tamanho</th><th>Uso</th></tr>
      <tr><td>foto-sobre.jpg</td><td>189 KB</td><td>Foto principal da seção "Quem sou eu?" (convertida de HEIC)</td></tr>
      <tr><td>ministerio.jpg</td><td>204 KB</td><td>Foto de ministração — seção de igrejas e ministérios</td></tr>
      <tr><td>casamento1.jpg</td><td>373 KB</td><td>Cerimônia de casamento — slideshow hero + galeria</td></tr>
      <tr><td>evento2.jpg</td><td>464 KB</td><td>Evento social — seção eventos e slideshow hero</td></tr>
      <tr><td>evento1.jpg</td><td>165 KB</td><td>Eventos corporativos — seção serviços</td></tr>
      <tr><td>loop-casamentos.mp4</td><td>529 KB</td><td>Vídeo loop na seção de cerimônias de casamento</td></tr>
      <tr><td>loop-ministerio.mp4</td><td>405 KB</td><td>Vídeo loop na seção de ministério</td></tr>
      <tr><td>loop-eventos.mp4</td><td>88 KB</td><td>Vídeo vertical (portrait) na seção eventos</td></tr>
    </table>
  </div>

  <div class="page-footer">
    <span>STHEFANY RAMOS — DOCUMENTAÇÃO TÉCNICA</span>
    <span>sthefanyramos.com.br</span>
  </div>
</div>

<!-- ══════════ PÁG 3 — SEÇÕES DO SITE ══════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-num">3</div>
    <div>
      <span class="page-tag">Conteúdo</span>
      <div class="page-title">Seções do <em>Site</em></div>
    </div>
  </div>

  <div class="sections-grid">
    <div class="sitem"><div class="sitem-num">1</div><div><div class="sitem-name">Hero — Slideshow Ken Burns</div><div class="sitem-desc">3 fotos com zoom lento, crossfade suave de 24s, overlay cinematográfico</div></div></div>
    <div class="sitem"><div class="sitem-num">2</div><div><div class="sitem-name">Value Bar — Marquee</div><div class="sitem-desc">5 diferenciais em loop infinito com pausa no hover</div></div></div>
    <div class="sitem"><div class="sitem-num">3</div><div><div class="sitem-name">Quem Sou Eu?</div><div class="sitem-desc">Bio, foto, stats animados (5+ anos, 1M+ views, 100% ao vivo)</div></div></div>
    <div class="sitem"><div class="sitem-num">4</div><div><div class="sitem-name">Cerimônias de Casamento</div><div class="sitem-desc">Serviços, features (duo voz&violão, banda), vídeo loop vertical</div></div></div>
    <div class="sitem"><div class="sitem-num">5</div><div><div class="sitem-name">Ministrações & Adoração</div><div class="sitem-desc">YouTube embed + foto ministerio colorida</div></div></div>
    <div class="sitem"><div class="sitem-num">6</div><div><div class="sitem-name">Eventos Corporativos</div><div class="sitem-desc">Foto + vídeo portrait centralizado verticalmente</div></div></div>
    <div class="sitem"><div class="sitem-num">7</div><div><div class="sitem-name">Multimídia</div><div class="sitem-desc">Grade 2 vídeos YouTube 16:9 + galeria masonry 7 itens</div></div></div>
    <div class="sitem"><div class="sitem-num">8</div><div><div class="sitem-name">Depoimentos</div><div class="sitem-desc">Slider com swipe, auto-play 6s, aspas decorativas, dots animados</div></div></div>
    <div class="sitem"><div class="sitem-num">9</div><div><div class="sitem-name">FAQ</div><div class="sitem-desc">Accordion com barra lateral gold animada, 6 perguntas frequentes</div></div></div>
    <div class="sitem"><div class="sitem-num">10</div><div><div class="sitem-name">Contato</div><div class="sitem-desc">Formulário Formspree, WhatsApp, email, Instagram</div></div></div>
    <div class="sitem"><div class="sitem-num">11</div><div><div class="sitem-name">Footer</div><div class="sitem-desc">Logo, navegação, redes sociais, horários, barra gold</div></div></div>
  </div>

  <div style="margin-top:28px;">
    <div class="section-title">Elementos Globais</div>
    <div class="cards">
      <div class="card">
        <div class="card-label">Navegação</div>
        <div class="card-desc">Menu fixo com glassmorphism ao scroll. Dropdown de serviços. Menu mobile com overlay. Link "Quem sou eu?" + "Solicitar Orçamento" em destaque.</div>
      </div>
      <div class="card">
        <div class="card-label">Barra de Progresso</div>
        <div class="card-desc">Linha gold no topo da página que avança conforme o scroll — indica posição de leitura ao visitante.</div>
      </div>
      <div class="card">
        <div class="card-label">WhatsApp Flutuante</div>
        <div class="card-desc">Botão fixo bottom-right com tooltip "Fale comigo!". Link direto com mensagem pré-preenchida para o número +55 48 99979-2424.</div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <span>STHEFANY RAMOS — DOCUMENTAÇÃO TÉCNICA</span>
    <span>sthefanyramos.com.br</span>
  </div>
</div>

<!-- ══════════ PÁG 4 — DESIGN SYSTEM ══════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-num">4</div>
    <div>
      <span class="page-tag">Design</span>
      <div class="page-title">Sistema de <em>Design</em></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Paleta Cromática — Pérola Prestigiosa</div>
    <div class="palette">
      <div class="color-chip"><div class="chip" style="background:#C9956C;"></div><div class="chip-label">Rosé Gold</div><div class="chip-hex">#C9956C</div></div>
      <div class="color-chip"><div class="chip" style="background:#E8C5A8;"></div><div class="chip-label">RG Claro</div><div class="chip-hex">#E8C5A8</div></div>
      <div class="color-chip"><div class="chip" style="background:#A67A52;"></div><div class="chip-label">RG Escuro</div><div class="chip-hex">#A67A52</div></div>
      <div class="color-chip"><div class="chip" style="background:#FAF8F4;border:1px solid #EAE5DE;"></div><div class="chip-label">Marfim</div><div class="chip-hex">#FAF8F4</div></div>
      <div class="color-chip"><div class="chip" style="background:#EAE5DE;"></div><div class="chip-label">Dove</div><div class="chip-hex">#EAE5DE</div></div>
      <div class="color-chip"><div class="chip" style="background:#2C2416;"></div><div class="chip-label">Escuro</div><div class="chip-hex">#2C2416</div></div>
      <div class="color-chip"><div class="chip" style="background:#5C5044;"></div><div class="chip-label">Médio</div><div class="chip-hex">#5C5044</div></div>
      <div class="color-chip"><div class="chip" style="background:#9B8E82;"></div><div class="chip-label">Muted</div><div class="chip-hex">#9B8E82</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Tipografia</div>
    <table>
      <tr><th>Fonte</th><th>Uso</th><th>Pesos</th></tr>
      <tr><td><strong>Great Vibes</strong></td><td>Logo, nome hero, assinatura</td><td>Regular 400</td></tr>
      <tr><td><strong>Playfair Display</strong></td><td>Títulos de seção, subtítulos, depoimentos</td><td>Regular, Semibold, Bold, Italic</td></tr>
      <tr><td><strong>Raleway</strong></td><td>Corpo do texto, navegação, botões, tags</td><td>300, 400, 500, 600, 700</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Efeitos de Design Premium (Luxury Layer)</div>
    <table>
      <tr><th>Efeito</th><th>Tecnologia</th><th>Propósito</th></tr>
      <tr><td>Noise Grain Overlay</td><td>SVG feTurbulence via CSS</td><td>Textura premium que dá profundidade visual</td></tr>
      <tr><td>Glassmorphism Navbar</td><td>CSS backdrop-filter blur(24px)</td><td>Navbar premium ao scroll com efeito de vidro</td></tr>
      <tr><td>Ken Burns Slideshow</td><td>CSS keyframes + animation</td><td>Hero com zoom suave e crossfade entre 3 fotos</td></tr>
      <tr><td>Cursor Personalizado</td><td>GSAP + JS mousemove</td><td>Cursor dourado com anel de lag elegante</td></tr>
      <tr><td>Magnetic Buttons</td><td>GSAP to() + elastic.out</td><td>Botões que atraem o cursor com retorno elástico</td></tr>
      <tr><td>Parallax Hero</td><td>GSAP ScrollTrigger scrub</td><td>Slideshow move 20% mais devagar que o scroll</td></tr>
      <tr><td>Counter Animado</td><td>requestAnimationFrame</td><td>Stats contam de 0 até o valor ao entrar na viewport</td></tr>
      <tr><td>Smooth Scroll</td><td>Lenis 1.1.13</td><td>Rolagem cinematográfica com easing exponencial</td></tr>
    </table>
  </div>

  <div class="page-footer">
    <span>STHEFANY RAMOS — DOCUMENTAÇÃO TÉCNICA</span>
    <span>sthefanyramos.com.br</span>
  </div>
</div>

<!-- ══════════ PÁG 5 — PIPELINE & INFRAESTRUTURA ══════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-num">5</div>
    <div>
      <span class="page-tag">Infraestrutura</span>
      <div class="page-title">Pipeline de Deploy & <em>Hospedagem</em></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Fluxo de Publicação</div>
    <div class="pipeline">
      <div class="pipe-step">
        <div class="pipe-icon">✏️</div>
        <div class="pipe-name">Edição Local</div>
        <div class="pipe-desc">VS Code / Claude Code</div>
      </div>
      <div class="pipe-step">
        <div class="pipe-icon">📁</div>
        <div class="pipe-name">Git Commit</div>
        <div class="pipe-desc">git add + commit</div>
      </div>
      <div class="pipe-step">
        <div class="pipe-icon">🐙</div>
        <div class="pipe-name">GitHub Push</div>
        <div class="pipe-desc">github.com/othavioribeiro</div>
      </div>
      <div class="pipe-step">
        <div class="pipe-icon">▲</div>
        <div class="pipe-name">Vercel Deploy</div>
        <div class="pipe-desc">Auto ou CLI --prod</div>
      </div>
      <div class="pipe-step">
        <div class="pipe-icon">🌐</div>
        <div class="pipe-name">CDN Global</div>
        <div class="pipe-desc">sthefanyramos.com.br</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Infraestrutura de Produção</div>
    <table>
      <tr><th>Serviço</th><th>Função</th><th>Plano</th><th>Custo</th></tr>
      <tr><td><strong>Vercel</strong></td><td>Hospedagem + CDN global</td><td>Hobby (Gratuito)</td><td><span class="tag-ok">R$ 0/mês</span></td></tr>
      <tr><td><strong>GitHub</strong></td><td>Repositório + versionamento</td><td>Free</td><td><span class="tag-ok">R$ 0/mês</span></td></tr>
      <tr><td><strong>Formspree</strong></td><td>Processamento do formulário</td><td>Free (50 envios/mês)</td><td><span class="tag-ok">R$ 0/mês</span></td></tr>
      <tr><td><strong>NSOne (Netlify DNS)</strong></td><td>Gerenciamento de DNS</td><td>Incluído</td><td><span class="tag-ok">R$ 0/mês</span></td></tr>
      <tr><td><strong>UptimeRobot</strong></td><td>Monitoramento de uptime</td><td>Free (5 monitores)</td><td><span class="tag-ok">R$ 0/mês</span></td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Configuração DNS</div>
    <table>
      <tr><th>Tipo</th><th>Host</th><th>Destino</th><th>TTL</th></tr>
      <tr><td>A</td><td>sthefanyramos.com.br</td><td>76.76.21.21 (Vercel)</td><td>300s</td></tr>
      <tr><td>CNAME</td><td>www.sthefanyramos.com.br</td><td>cname.vercel-dns.com</td><td>300s</td></tr>
    </table>
  </div>

  <div class="alert">
    <div class="alert-title">🛡️ Resiliência — Por que o site não vai cair novamente</div>
    <div class="alert-text">
      <strong>1.</strong> Vercel tem plano gratuito sem limite de deploys para sites estáticos (diferente do Netlify que usa créditos).<br>
      <strong>2.</strong> GSAP, Lenis e ScrollTrigger estão self-hosted em <code>/js/vendor/</code> — sem dependência de CDN externa.<br>
      <strong>3.</strong> Todo o código JS está em <code>try/catch</code> — se qualquer biblioteca falhar, o site permanece visível e funcional.<br>
      <strong>4.</strong> Rollback em 1 clique via painel Vercel para qualquer deploy anterior.
    </div>
  </div>

  <div class="page-footer">
    <span>STHEFANY RAMOS — DOCUMENTAÇÃO TÉCNICA</span>
    <span>sthefanyramos.com.br</span>
  </div>
</div>

<!-- ══════════ PÁG 6 — IDENTIDADE VISUAL ══════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-num">6</div>
    <div>
      <span class="page-tag">Branding</span>
      <div class="page-title">Logotipo & Identidade <em>Visual</em></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Versões do Logotipo (9 arquivos PNG gerados)</div>
    <div class="logos-grid">
      <div class="logo-card">
        <div class="logo-preview" style="background:#2C2416;color:#FFFFFF;">Sthefany Ramos</div>
        <div class="logo-card-label">logo-dark.png — Fundo escuro</div>
      </div>
      <div class="logo-card">
        <div class="logo-preview" style="background:#2C2416;color:#E8C5A8;">Sthefany Ramos</div>
        <div class="logo-card-label">logo-gold-escuro.png — Gold em escuro</div>
      </div>
      <div class="logo-card">
        <div class="logo-preview" style="background:#FAF8F4;color:#2C2416;">Sthefany Ramos</div>
        <div class="logo-card-label">logo-light.png — Fundo marfim</div>
      </div>
      <div class="logo-card">
        <div class="logo-preview" style="background:#FFFFFF;color:#C9956C;">Sthefany Ramos</div>
        <div class="logo-card-label">logo-gold-claro.png — Principal</div>
      </div>
      <div class="logo-card">
        <div class="logo-preview" style="background:repeating-linear-gradient(45deg,#f0f0f0 0px,#f0f0f0 8px,#fff 8px,#fff 16px);color:#FFFFFF;text-shadow:0 1px 3px rgba(0,0,0,.4);">Sthefany Ramos</div>
        <div class="logo-card-label">logo-transparente-branco.png</div>
      </div>
      <div class="logo-card">
        <div class="logo-preview" style="background:repeating-linear-gradient(45deg,#f0f0f0 0px,#f0f0f0 8px,#fff 8px,#fff 16px);color:#C9956C;">Sthefany Ramos</div>
        <div class="logo-card-label">logo-transparente-gold.png</div>
      </div>
    </div>
    <p style="font-size:11px;color:var(--muted);margin-top:12px;">
      Todos os arquivos estão em <strong>3× de resolução</strong> (2100×600px para horizontais, 1500×1500px para quadrados).
      Localizados em: <code>logos/png/</code>
    </p>
  </div>

  <div class="section">
    <div class="section-title">Guia de Uso do Logo</div>
    <table>
      <tr><th>Versão</th><th>Usar em</th></tr>
      <tr><td>logo-gold-claro.png</td><td>Materiais impressos, papelaria, assinatura de e-mail, apresentações</td></tr>
      <tr><td>logo-dark.png / logo-gold-escuro.png</td><td>Banners, posts escuros, fundos com foto</td></tr>
      <tr><td>logo-transparente-gold.png</td><td>Sobreposição em fotos, posts de Instagram, stories</td></tr>
      <tr><td>logo-transparente-branco.png</td><td>Sobreposição em fotos escuras e covers</td></tr>
      <tr><td>logo-square-dark/gold.png</td><td>Foto de perfil, avatar WhatsApp Business, YouTube</td></tr>
    </table>
  </div>

  <div class="page-footer">
    <span>STHEFANY RAMOS — DOCUMENTAÇÃO TÉCNICA</span>
    <span>sthefanyramos.com.br</span>
  </div>
</div>

<!-- ══════════ PÁG 7 — HISTÓRICO DE DESENVOLVIMENTO ══════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-num">7</div>
    <div>
      <span class="page-tag">Histórico</span>
      <div class="page-title">Linha do Tempo do <em>Desenvolvimento</em></div>
    </div>
  </div>

  <div class="timeline">
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-label">Fase 1 — Base</div>
      <div class="tl-text"><strong>Estrutura HTML/CSS/JS</strong> completa — 11 seções, paleta Rosé Gold, menu responsivo, formulário Formspree, FAQ accordion, slider de depoimentos.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-label">Fase 2 — Conteúdo</div>
      <div class="tl-text"><strong>Ajustes de conteúdo</strong> — logo "Uma Voz Dessa Geração", "Quem sou eu?", bio completa com família, fotos reais (HEIC→JPG), nova foto ministerio, 1M+ views YouTube.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-label">Fase 3 — Serviços</div>
      <div class="tl-text"><strong>Refinamento de serviços</strong> — duos (voz & violão), opção banda, rede de músicos sem especificar instrumentos, prazo 12 meses, ministrações cheias do Espírito Santo.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-label">Fase 4 — Hero</div>
      <div class="tl-text"><strong>Hero cinematográfico</strong> — substituição do vídeo esticado por slideshow Ken Burns com 3 fotos (casamento, ministério, evento), ciclo de 24s com crossfade suave.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-label">Fase 5 — Luxury Layer</div>
      <div class="tl-text"><strong>Efeitos premium</strong> — Lenis smooth scroll, GSAP + parallax, noise grain, glassmorphism, cursor personalizado, magnetic buttons, marquee, counter animado.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-label">Fase 6 — Simplify</div>
      <div class="tl-text"><strong>Code review + otimização</strong> — 3 scroll listeners unificados, tab logic DRY, setInterval→requestAnimationFrame, parseInt com radix, active-nav O(n×m)→flat.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-label">Fase 7 — Deploy & Resiliência</div>
      <div class="tl-text"><strong>Migração Netlify→Vercel</strong>, self-host GSAP/Lenis, repositório GitHub, DNS atualizado, fallbacks CSS para JS, try/catch em toda camada luxury.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-label">Fase 8 — Branding</div>
      <div class="tl-text"><strong>9 versões do logotipo</strong> geradas via Puppeteer + fontes embedadas — dark, light, gold, transparente, quadrado. Prontos para uso em materiais gráficos.</div>
    </div>
  </div>

  <div class="page-footer">
    <span>STHEFANY RAMOS — DOCUMENTAÇÃO TÉCNICA</span>
    <span>sthefanyramos.com.br</span>
  </div>
</div>

<!-- ══════════ PÁG 8 — PRÓXIMOS PASSOS ══════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-num">8</div>
    <div>
      <span class="page-tag">Roadmap</span>
      <div class="page-title">Próximos <em>Passos</em> Recomendados</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Ações Pendentes</div>
    <table>
      <tr><th>Prioridade</th><th>Ação</th><th>Impacto</th></tr>
      <tr><td>🔴 Alta</td><td>Configurar UptimeRobot (uptimerobot.com) com alerta por e-mail</td><td>Monitoramento 24/7 do site</td></tr>
      <tr><td>🔴 Alta</td><td>Preencher depoimentos reais (noivas e pastores) no site</td><td>Prova social — aumenta conversão</td></tr>
      <tr><td>🟡 Média</td><td>Conectar Vercel ao GitHub para auto-deploy em cada push</td><td>Deploy automático sem CLI</td></tr>
      <tr><td>🟡 Média</td><td>Adicionar links reais do YouTube nas músicas do repertório (se reativar)</td><td>Experiência do visitante</td></tr>
      <tr><td>🟡 Média</td><td>Instalar o app Formspree para ver leads no celular</td><td>Agilidade no atendimento</td></tr>
      <tr><td>🟢 Baixa</td><td>Adicionar mais fotos à galeria multimídia</td><td>Portfólio mais robusto</td></tr>
      <tr><td>🟢 Baixa</td><td>Criar vídeo de loop vertical para o hero (substituir fotos)</td><td>Impacto visual mais forte</td></tr>
      <tr><td>🟢 Baixa</td><td>Adicionar Google Analytics para rastrear visitas</td><td>Métricas de acesso</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Manutenção Contínua</div>
    <div class="cards cards-2">
      <div class="card">
        <div class="card-label">Como atualizar o site</div>
        <div class="card-desc">
          Edite os arquivos <strong>index.html</strong>, <strong>css/style.css</strong> ou <strong>js/main.js</strong>.
          Copie para a pasta <strong>dist/</strong> e rode:<br><br>
          <code style="background:var(--dove);padding:3px 6px;border-radius:4px;font-size:10px;">
          npx vercel --prod --yes
          </code>
        </div>
      </div>
      <div class="card">
        <div class="card-label">Como adicionar fotos</div>
        <div class="card-desc">
          Coloque o arquivo JPG otimizado (máx. 800px, ~200KB) na pasta <strong>images/</strong>.
          Atualize o caminho no <strong>index.html</strong> e rode o deploy.
          Use <em>Paint / Fotos</em> do Windows para redimensionar antes.
        </div>
      </div>
    </div>
  </div>

  <div class="alert">
    <div class="alert-title">📋 Referências Rápidas</div>
    <div class="alert-text">
      <strong>Site ao vivo:</strong> https://sthefanyramos.com.br &nbsp;|&nbsp;
      <strong>Repositório:</strong> github.com/othavioribeiro/sthefany-ramos-site<br>
      <strong>Painel Vercel:</strong> vercel.com/othaviobianco-7781s-projects/sthefany-ramos-site &nbsp;|&nbsp;
      <strong>DNS:</strong> app.netlify.com (NSOne)<br>
      <strong>Formulário:</strong> formspree.io (ID: xpqkekzq) &nbsp;|&nbsp;
      <strong>WhatsApp:</strong> +55 48 99979-2424
    </div>
  </div>

  <div class="page-footer">
    <span>STHEFANY RAMOS — DOCUMENTAÇÃO TÉCNICA</span>
    <span>Gerado em Abril 2026 — Claude Code</span>
  </div>
</div>

</body>
</html>`;

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1000));

  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    displayHeaderFooter: false,
  });

  await browser.close();
  console.log('✅ PDF gerado:', OUT);
}

run().catch(e => { console.error(e); process.exit(1); });
