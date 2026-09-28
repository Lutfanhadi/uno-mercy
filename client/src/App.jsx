import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { playCardSound, drawCardSound, unoSound, mercySound, hoverSound, toggleBgm } from './sound';
import './App.css';
import {
  BookOpen, SquareStack, Target, Skull, CheckCircle, Hash, Ban, ArrowRight, Repeat,
  RefreshCw, RefreshCcw, Users, Plus, ArrowDownToLine, Zap, AlertTriangle, Palette, Lightbulb, Scale,
  Search, Dices, Frown, BarChart2, Trophy, Swords, Home, Link, User, Bot, Crown,
  Hourglass, Rocket, Flame, XCircle, Circle, Trash2, Volume2, VolumeX, Hand, Settings, LogOut, Flag
} from 'lucide-react';
import Swal from 'sweetalert2';



const socket = io("https://ahead-culprit-treble.ngrok-free.dev", {
  extraHeaders: {
    "ngrok-skip-browser-warning": "true",
  },
});

// ============================================================
// SVG ICONS
// ============================================================
const SkipIcon = ({ isCorner = false, isCenter = false }) => {
  const rot = isCenter ? 0 : -40;
  const strokeW = isCorner ? 5.5 : 4.5;
  const badgeFill = isCenter ? 'var(--card-bg, #792b33)' : '#8895a4';
  const shadowFilter = isCorner
    ? 'drop-shadow(1px 1.5px 0px rgba(15,24,34,0.95))'
    : 'drop-shadow(3px 4px 0px rgba(15,24,34,0.95))';

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
      <g filter={shadowFilter}>
        <g transform={`rotate(${rot} 50 50)`}>
          {/* Badge with transparent D-shaped cutouts */}
          <path
            d="M 50,10 A 40,40 0 1,0 50,90 A 40,40 0 1,0 50,10 Z M 23.9,43 L 76.1,43 A 27,27 0 0,0 23.9,43 Z M 23.9,57 L 76.1,57 A 27,27 0 0,1 23.9,57 Z"
            fill={badgeFill}
            fillRule="evenodd"
          />
          {/* Crisp dark outer outline */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="#0f1822" strokeWidth={strokeW} />
          {/* Crisp dark top cutout outline */}
          <path d="M 23.9,43 L 76.1,43 A 27,27 0 0,0 23.9,43 Z" fill="none" stroke="#0f1822" strokeWidth={strokeW} strokeLinejoin="round" />
          {/* Crisp dark bottom cutout outline */}
          <path d="M 23.9,57 L 76.1,57 A 27,27 0 0,1 23.9,57 Z" fill="none" stroke="#0f1822" strokeWidth={strokeW} strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
};

const SkipEveryoneIcon = ({ isCenter = false }) => {
  const f = 'white';
  const strokeW = isCenter ? "3" : "4";
  const dropShadow = isCenter ? "drop-shadow(3px 4px 0px rgba(0,0,0,0.4))" : "drop-shadow(1.5px 1.5px 0px rgba(0,0,0,0.7))";

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <g filter={dropShadow}>
        <g transform="translate(50, 50) rotate(30) scale(0.95)">
          <path d="M 5.6,31.5 
                   A 32,32 0 1,1 32,0 
                   L 44,0 
                   L 25,30 
                   L 6,0 
                   L 18,0 
                   A 18,18 0 1,0 3.1,17.7 Z" 
                fill={f} stroke="#0f1822" strokeWidth={strokeW} strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
};

const ReverseIcon = ({ isCenter = false }) => {
  const f = 'white';
  const strokeW = isCenter ? "3" : "4";
  const dropShadow = isCenter ? "drop-shadow(3px 4px 0px rgba(0,0,0,0.4))" : "drop-shadow(1.5px 2px 0px rgba(0,0,0,0.5))";

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <g filter={dropShadow}>
        <g transform="translate(50, 50) rotate(-40) scale(0.9, 1.05)">
          {/* Arrow 1 */}
          <path d="M -30,-22 
                   L 0,-44 
                   L 0,-32 
                   A 32,32 0 0,1 0,32 
                   L 0,14 
                   A 14,14 0 0,0 0,-14 
                   L 0,-2 Z" 
                fill={f} stroke="#0f1822" strokeWidth={strokeW} strokeLinejoin="round" />
          
          {/* Arrow 2 */}
          <path d="M -30,-22 
                   L 0,-44 
                   L 0,-32 
                   A 32,32 0 0,1 0,32 
                   L 0,14 
                   A 14,14 0 0,0 0,-14 
                   L 0,-2 Z" 
                fill={f} stroke="#0f1822" strokeWidth={strokeW} strokeLinejoin="round" 
                transform="rotate(180)" />
        </g>
      </g>
    </svg>
  );
};

const ReverseCornerIcon = ({ isCenter = false }) => {
  // If it is in the center, we tilt it more to match the diagonal oval
  const rotation = isCenter ? 45 : 35; 
  const scale = isCenter ? 1.1 : 0.95;
  const filter = isCenter ? "drop-shadow(2.5px 3px 0px rgba(0,0,0,0.5))" : "drop-shadow(1.5px 1.5px 0px rgba(0,0,0,0.7))";
  
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <g filter={filter}>
        <g transform={`translate(50, 50) rotate(${rotation}) scale(${scale})`}>
          <path d="M -12,-36 L -32,-6 L -20,-6 L -20,36 L -6,36 L -6,-6 L 8,-6 Z" fill="white" stroke="#0f1822" strokeWidth="4" strokeLinejoin="round" />
          <path d="M -12,-36 L -32,-6 L -20,-6 L -20,36 L -6,36 L -6,-6 L 8,-6 Z" fill="white" stroke="#0f1822" strokeWidth="4" strokeLinejoin="round" transform="rotate(180)" />
        </g>
      </g>
    </svg>
  );
};

const DrawCardsIcon = ({ count }) => {
  const getTransforms = (c) => {
    if (c === 2) return [{x:35, y:20, r:-10, f:'white'}, {x:45, y:35, r:10, f:'white'}];
    if (c === 4) return [{x:20,y:20,r:-15, f:'white'}, {x:35,y:25,r:-5, f:'white'}, {x:50,y:30,r:5, f:'white'}, {x:65,y:35,r:15, f:'white'}];
    if (c === 6) return [
      {x:20,y:20,r:-15, f:'#e53935'}, {x:40,y:15,r:-5, f:'#1e88e5'}, {x:60,y:20,r:15, f:'#fdd835'},
      {x:25,y:45,r:-10, f:'#43a047'}, {x:45,y:40,r:5, f:'#e53935'}, {x:65,y:45,r:20, f:'#1e88e5'}
    ];
    if (c === 10) return [
      {x:15,y:15,r:-20, f:'#fdd835'}, {x:35,y:10,r:-10, f:'#1e88e5'}, {x:55,y:15,r:0, f:'#43a047'}, {x:75,y:25,r:15, f:'#e53935'},
      {x:10,y:40,r:-15, f:'#43a047'}, {x:30,y:35,r:-5, f:'#e53935'}, {x:50,y:35,r:5, f:'white'}, {x:70,y:45,r:20, f:'#1e88e5'},
      {x:25,y:60,r:-10, f:'#1e88e5'}, {x:45,y:55,r:10, f:'#fdd835'}
    ];
    return [];
  };
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {getTransforms(count).map((t, i) => (
        <rect key={i} x={0} y={0} width="24" height="36" rx="3" fill={t.f} stroke="black" strokeWidth="3" transform={`translate(${t.x}, ${t.y}) rotate(${t.r})`} />
      ))}
    </svg>
  );
};

const DiscardAllCornerIcon = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <g filter="drop-shadow(1.5px 1.5px 0px rgba(0,0,0,0.7))">
      {/* Fanned cards shifted left slightly */}
      <g transform="translate(42, 50)">
        <rect x="-16" y="-20" width="16" height="24" rx="2" fill="white" stroke="#0f1822" strokeWidth="3"
              transform="rotate(-25)" />
        <rect x="-11" y="-21" width="16" height="24" rx="2" fill="white" stroke="#0f1822" strokeWidth="3"
              transform="rotate(-8)" />
        <rect x="-6" y="-21" width="16" height="24" rx="2" fill="white" stroke="#0f1822" strokeWidth="3"
              transform="rotate(8)" />
        <rect x="-1" y="-20" width="16" height="24" rx="2" fill="white" stroke="#0f1822" strokeWidth="3"
              transform="rotate(25)" />
      </g>
      {/* Arrow coming out of the front card curving right */}
      <path d="M 50,42 Q 65,30 82,40" fill="none" stroke="#0f1822" strokeWidth="6.5" strokeLinecap="round" />
      <polygon points="85,42 75,34 75,48" fill="#0f1822" stroke="#0f1822" strokeWidth="1" strokeLinejoin="round" />
    </g>
  </svg>
);

const DiscardAllIcon = ({ isCenter = false }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <g filter="drop-shadow(2px 3px 1px rgba(0,0,0,0.5))">
      {/* Fanned cards at top-right */}
      <g transform="translate(62, 32)">
        <rect x="-16" y="-20" width="16" height="26" rx="2" fill="white" stroke="#0f1822" strokeWidth="2"
              transform="rotate(-30)" />
        <rect x="-10" y="-22" width="16" height="26" rx="2" fill="white" stroke="#0f1822" strokeWidth="2"
              transform="rotate(-15)" />
        <rect x="-4" y="-23" width="16" height="26" rx="2" fill="white" stroke="#0f1822" strokeWidth="2"
              transform="rotate(0)" />
        <rect x="2" y="-22" width="16" height="26" rx="2" fill="white" stroke="#0f1822" strokeWidth="2"
              transform="rotate(15)" />
        <rect x="8" y="-20" width="16" height="26" rx="2" fill="white" stroke="#0f1822" strokeWidth="2"
              transform="rotate(30)" />
      </g>
      
      {/* Swooping solid dark arrow from cards down to pile */}
      <path d="M 64,45 Q 58,58 45,64" fill="none" stroke="#0f1822" strokeWidth="5.5" strokeLinecap="round" />
      {/* Arrowhead pointing exactly to the top of the pile */}
      <polygon points="41,66 50,60 47,69" fill="#0f1822" stroke="#0f1822" strokeWidth="1" strokeLinejoin="round" />
      
      {/* Card stack/pile at bottom-left */}
      <g transform="translate(34, 78)">
        <rect x="-12" y="-8" width="20" height="26" rx="2" fill="white" stroke="#0f1822" strokeWidth="2"
              transform="rotate(-5) translate(0, 0)" />
        <rect x="-11" y="-10" width="20" height="26" rx="2" fill="white" stroke="#0f1822" strokeWidth="2"
              transform="rotate(-2) translate(1, -1)" />
        <rect x="-10" y="-12" width="20" height="26" rx="2" fill="white" stroke="#0f1822" strokeWidth="2"
              transform="rotate(1) translate(2, -2)" />
      </g>
    </g>
  </svg>
);

const RouletteIcon = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <g stroke="black" strokeWidth="3">
      <rect x="15" y="15" width="35" height="35" rx="6" fill="#e53935" />
      <rect x="50" y="15" width="35" height="35" rx="6" fill="#1e88e5" />
      <rect x="15" y="50" width="35" height="35" rx="6" fill="#43a047" />
      <rect x="50" y="50" width="35" height="35" rx="6" fill="#fdd835" />
    </g>
  </svg>
);

const ReverseDrawFourIcon = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <g filter="drop-shadow(1px 2px 1px black)">
      <path d="M 15 50 C 15 15, 85 15, 85 50" fill="none" stroke="white" strokeWidth="10" />
      <polygon points="85,35 105,55 65,55" fill="white" />
      <path d="M 85 50 C 85 85, 15 85, 15 50" fill="none" stroke="white" strokeWidth="10" />
      <polygon points="15,65 -5,45 35,45" fill="white" />
    </g>
    <g transform="translate(15, 15) scale(0.7)">
      <rect x="20" y="20" width="24" height="36" rx="3" fill="white" stroke="black" strokeWidth="3" transform="rotate(-15 20 20)" />
      <rect x="35" y="25" width="24" height="36" rx="3" fill="white" stroke="black" strokeWidth="3" transform="rotate(-5 35 25)" />
      <rect x="50" y="30" width="24" height="36" rx="3" fill="white" stroke="black" strokeWidth="3" transform="rotate(5 50 30)" />
      <rect x="65" y="35" width="24" height="36" rx="3" fill="white" stroke="black" strokeWidth="3" transform="rotate(15 65 35)" />
    </g>
  </svg>
);

const SwapIcon = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <g filter="drop-shadow(1px 1px 0px #0f1822)">
      <path d="M 20 40 L 80 40 M 80 40 L 65 25 M 80 40 L 65 55" fill="none" stroke="#8895a4" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 80 60 L 20 60 M 20 60 L 35 45 M 20 60 L 35 75" fill="none" stroke="#8895a4" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

const PassIcon = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <g filter="drop-shadow(1px 1px 0px #0f1822)">
      <path d="M 25 75 A 35 35 0 1 1 75 75" fill="none" stroke="#8895a4" strokeWidth="12" strokeLinecap="round" />
      <polygon points="75,85 55,60 95,60" fill="#8895a4" />
    </g>
  </svg>
);

// Helpers to map value to component
const renderCorner = (val) => {
  switch (val) {
    case 'SKIP': return <div style={{width:'18px', height:'18px'}}><SkipIcon isCorner={true} /></div>;
    case 'REVERSE': return <div style={{width:'22px', height:'22px'}}><ReverseCornerIcon /></div>;
    case 'DISCARD_ALL': return <div style={{width:'32px', height:'32px'}}><DiscardAllCornerIcon /></div>;
    case 'WILD_COLOR_ROULETTE': return <RouletteIcon />;
    case 'WILD_REVERSE_DRAW_FOUR': return <div style={{display:'flex', alignItems:'center', gap:'2px'}}><div style={{width:'14px', height:'14px'}}><ReverseIcon/></div>+4</div>;
    case 'WILD_DRAW_FOUR': return '+4';
    case 'WILD_DRAW_SIX': return '+6';
    case 'WILD_DRAW_TEN': return '+10';
    case 'DRAW_TWO': return '+2';
    case 'SKIP_EVERYONE': return <div style={{width:'22px', height:'22px'}}><SkipEveryoneIcon /></div>;
    case '0': return <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}><span>0</span><div style={{width:'12px', height:'12px', marginTop:'2px'}}><PassIcon/></div></div>;
    case '7': return <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}><span>7</span><div style={{width:'12px', height:'12px', marginTop:'2px'}}><SwapIcon/></div></div>;
    default: return val;
  }
};

const renderCenter = (val) => {
  switch (val) {
    case 'SKIP': return <div style={{width:'76%', height:'76%', display:'flex', alignItems:'center', justifyContent:'center'}}><SkipIcon isCenter={true} /></div>;
    case 'REVERSE': return <div style={{width:'65%', height:'65%'}}><ReverseCornerIcon isCenter={true} /></div>;
    case 'DRAW_TWO': return <div style={{width:'70%', height:'70%'}}><DrawCardsIcon count={2} /></div>;
    case 'WILD_DRAW_FOUR': return <div style={{width:'80%', height:'80%', transform: 'rotate(30deg)'}}><DrawCardsIcon count={4} /></div>;
    case 'WILD_DRAW_SIX': return <div style={{width:'80%', height:'80%', transform: 'rotate(30deg)'}}><DrawCardsIcon count={6} /></div>;
    case 'WILD_DRAW_TEN': return <div style={{width:'80%', height:'80%', transform: 'rotate(30deg)'}}><DrawCardsIcon count={10} /></div>;
    case 'WILD_COLOR_ROULETTE': return <div style={{width:'60%', height:'60%', transform: 'rotate(30deg)'}}><RouletteIcon /></div>;
    case 'WILD_REVERSE_DRAW_FOUR': return <div style={{width:'60%', height:'60%', transform: 'rotate(30deg)'}}><ReverseDrawFourIcon /></div>;
    case 'DISCARD_ALL': return <div style={{width:'85%', height:'85%'}}><DiscardAllIcon isCenter={true} /></div>;
    case 'SKIP_EVERYONE': return <div style={{width:'65%', height:'65%'}}><SkipEveryoneIcon isCenter={true} /></div>;
    default: return <span className="card-oval-val">{val}</span>;
  }
};

const COLOR_MAP = {
  RED: '#E53935',
  YELLOW: '#b58c20',
  GREEN: '#285e3c',
  BLUE: '#0063B2',
  ANY: '#161d26'
};
const DARK_COLOR_MAP = {
  RED: '#b71c1c',
  YELLOW: '#54410d',
  GREEN: '#102e1b',
  BLUE: '#003366',
  ANY: '#0a0d12'
};

// ============================================================
// UNO Card Component
// ============================================================
function UnoCard({ card, onClick, disabled, isHidden, isHighlight, isMini }) {
  if (isHidden) {
    return (
      <div className={`uno-card card-back ${isMini ? 'mini' : ''}`} onClick={onClick} onMouseEnter={hoverSound}>
        <div className="card-back-inner">
          <span className="card-back-logo">UNO</span>
          <span className="card-back-sub">NO MERCY</span>
        </div>
      </div>
    );
  }

  // WILD_COLOR_ROULETTE stays 'ANY' (black), all other wilds now have a real color
  const isWild = card.color === 'ANY';
  const isSkip = card.value === 'SKIP' || card.value === 'SKIP_EVERYONE';
  const bg = COLOR_MAP[card.color] || '#333';
  const dark = DARK_COLOR_MAP[card.color] || '#000';

  return (
    <div
      className={`uno-card ${disabled ? 'card-disabled' : 'card-playable'} ${isHighlight ? 'card-highlight' : ''} ${isMini ? 'mini' : ''}`}
      style={{ '--card-bg': bg, '--card-dark': dark }}
      onClick={() => !disabled && onClick && onClick(card.id)}
      onMouseEnter={hoverSound}
    >
      <div className="card-outer-border">
        <div className="card-inner-bg">
          <div className="card-corner card-tl">{renderCorner(card.value)}</div>
          <div className="card-corner card-br">{renderCorner(card.value)}</div>
          
          {isWild ? (
            <div className="card-wild-center">
              <div className="wild-quad">
                <div className="wq wq-red"/>
                <div className="wq wq-yellow"/>
                <div className="wq wq-blue"/>
                <div className="wq wq-green"/>
              </div>
              <div style={{position:'absolute', zIndex:4, width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                {renderCenter(card.value)}
              </div>
            </div>
          ) : (
            <div className={`card-oval ${isSkip ? 'card-oval-skip' : ''}`}>
              {renderCenter(card.value)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RULES MODAL — Full Tutorial Carousel
// ============================================================
const TUTORIAL_SLIDES = [
  {
    title: <><BookOpen size={20} style={{marginRight: 6}} /> Cara Bermain UNO No Mercy</>,
    card: null,
    isIntro: true,
    desc: 'UNO No Mercy adalah game kartu turn-based. Tujuan utama adalah menjadi pemain pertama yang menghabiskan semua kartu di tangan.',
    details: [
      { icon: <SquareStack size={18} />, label: '7 kartu awal', text: 'Setiap pemain mendapat 7 kartu di awal permainan.' },
      { icon: <Target size={18} />, label: 'Cara main', text: 'Mainkan kartu yang cocok warna, angka, atau jenisnya dengan kartu di tumpukan.' },
      { icon: <Skull size={18} />, label: 'Mercy Rule', text: 'Jika kartu kamu mencapai batas Mercy, kamu dieliminasi!' },
    ],
  },
  {
    title: '🔢 Kartu Angka (0–9)',
    card: { id: 'd-num', type: 'NUMBER', color: 'RED', value: '7' },
    desc: 'Kartu angka adalah kartu dasar UNO. Tidak ada efek khusus — cukup mainkan dan giliran berpindah ke pemain berikutnya.',
    details: [
      { icon: <CheckCircle size={18} />, label: 'Cara main', text: 'Mainkan jika warna atau angkanya sama dengan kartu di tumpukan.' },
      { icon: <Hash size={18} />, label: 'Angka 0', text: 'Semua pemain aktif mengoper kartu ke pemain berikutnya (searah arah giliran).' },
      { icon: <Hash size={18} />, label: 'Angka 7', text: 'Tukar kartu tangan dengan pemain lain pilihan kamu.' },
    ],
  },
  {
    title: <><Ban size={18} style={{marginRight: 6}} /> Kartu Skip (Lewati)</>,
    card: { id: 'd-skip', type: 'ACTION', color: 'RED', value: 'SKIP' },
    desc: 'Kartu Skip membuat pemain berikutnya kehilangan giliran dan langsung melewatinya.',
    details: [
      { icon: <ArrowRight size={18} />, label: 'Efek', text: 'P1 main Skip → P2 dilewati → P3 bermain.' },
      { icon: <Repeat size={18} />, label: '2 Pemain', text: 'Pemain yang main Skip mendapat giliran lagi.' },
    ],
  },
  {
    title: <><RefreshCw size={18} style={{marginRight: 6}} /> Kartu Reverse (Balik Arah)</>,
    card: { id: 'd-rev', type: 'ACTION', color: 'BLUE', value: 'REVERSE' },
    desc: 'Membalik arah permainan. Jika sebelumnya searah jarum jam, setelah Reverse menjadi berlawanan arah jarum jam.',
    details: [
      { icon: <Users size={18} />, label: '3+ Pemain', text: 'Giliran berikutnya mengikuti arah yang baru.' },
      { icon: <Repeat size={18} />, label: '2 Pemain', text: 'Berfungsi seperti Skip — pemain yang main Reverse mendapat giliran lagi.' },
    ],
  },
  {
    title: <><Plus size={18} style={{marginRight: 6}} /> Kartu Draw Two (+2)</>,
    card: { id: 'd-d2', type: 'ACTION', color: 'GREEN', value: 'DRAW_TWO' },
    desc: 'Pemain berikutnya wajib mengambil 2 kartu dan kehilangan giliran mereka.',
    details: [
      { icon: <ArrowDownToLine size={18} />, label: 'Efek', text: 'P1 main +2 → P2 ambil 2 kartu → P2 dilewati → P3 bermain.' },
      { icon: <Ban size={18} />, label: 'No Stacking', text: 'P2 tidak bisa melawan dengan +2 miliknya. Wajib ambil 2 kartu.' },
    ],
  },
  {
    title: <><Ban size={18} style={{marginRight: 6}} /> Skip Everyone (Lewati Semua)</>,
    card: { id: 'd-se', type: 'ACTION', color: 'YELLOW', value: 'SKIP_EVERYONE' },
    desc: 'Kartu spesial No Mercy! Semua pemain lain dilewati, dan kamu mendapat giliran lagi.',
    details: [
      { icon: <Zap size={18} />, label: 'Efek', text: 'Semua pemain lain kehilangan giliran sekaligus. Kamu main lagi!' },
      { icon: <AlertTriangle size={18} />, label: 'Perhatian', text: 'Sangat powerful — gunakan dengan tepat!' },
    ],
  },
  {
    title: <><Trash2 size={18} style={{marginRight: 6}} /> Discard All (Buang Semua Warna)</>,
    card: { id: 'd-da', type: 'ACTION', color: 'RED', value: 'DISCARD_ALL' },
    desc: 'Buang semua kartu di tanganmu yang memiliki warna sama dengan kartu ini ke tumpukan discard.',
    details: [
      { icon: <Palette size={18} />, label: 'Efek', text: 'Semua kartu merah di tangan dibuang jika mainkan Discard All merah.' },
      { icon: <Lightbulb size={18} />, label: 'Strategi', text: 'Sangat berguna untuk mengurangi kartu sekaligus banyak!' },
    ],
  },
  {
    title: <><Palette size={18} style={{marginRight: 6}} /> Wild Draw Four (+4)</>,
    card: { id: 'd-w4', type: 'WILD', color: 'ANY', value: 'WILD_DRAW_FOUR' },
    desc: 'Kartu Wild! Pilih warna baru, dan pemain berikutnya wajib mengambil 4 kartu serta kehilangan giliran.',
    details: [
      { icon: <Scale size={18} />, label: 'Syarat', text: 'Hanya boleh dimainkan jika TIDAK punya kartu yang cocok warna aktif.' },
      { icon: <Search size={18} />, label: 'Challenge', text: 'Pemain berikutnya bisa Challenge jika curiga kamu punya kartu warna aktif.' },
    ],
  },
  {
    title: <><Palette size={18} style={{marginRight: 6}} /> Wild Draw Six (+6)</>,
    card: { id: 'd-w6', type: 'WILD', color: 'ANY', value: 'WILD_DRAW_SIX' },
    desc: 'Versi lebih sadis dari Wild Draw Four! Pemain berikutnya mengambil 6 kartu dan kehilangan giliran.',
    details: [
      { icon: <Palette size={18} />, label: 'Efek', text: 'Pilih warna baru → Pemain berikutnya ambil 6 kartu.' },
      { icon: <Skull size={18} />, label: 'No Mercy', text: 'Kombinasi +6 bisa langsung memicu Mercy Elimination!' },
    ],
  },
  {
    title: <><Palette size={18} style={{marginRight: 6}} /> Wild Draw Ten (+10)</>,
    card: { id: 'd-w10', type: 'WILD', color: 'ANY', value: 'WILD_DRAW_TEN' },
    desc: 'Kartu paling mematikan! Pemain berikutnya wajib mengambil 10 kartu sekaligus.',
    details: [
      { icon: <Zap size={18} />, label: 'Efek', text: 'Pilih warna baru → Pemain berikutnya ambil 10 kartu!' },
      { icon: <Skull size={18} />, label: 'Mercy', text: 'Hampir pasti memicu Mercy Elimination pada pemain yang terkena!' },
    ],
  },
  {
    title: <><Dices size={18} style={{marginRight: 6}} /> Wild Color Roulette</>,
    card: { id: 'd-wr', type: 'WILD', color: 'ANY', value: 'WILD_COLOR_ROULETTE' },
    desc: 'Pemain yang terkena Roulette harus MEMILIH warna, lalu menarik kartu satu per satu sampai menemukan warna tersebut.',
    details: [
      { icon: <Dices size={18} />, label: 'Efek', text: 'Pemain yang terkena memilih warna sendiri, lalu tarik kartu sampai dapat warna yang dipilih.' },
      { icon: <Frown size={18} />, label: 'Risiko', text: 'Bisa menarik sangat banyak kartu — berbahaya!' },
    ],
  },
  {
    title: <><RefreshCw size={18} style={{marginRight: 6}} /> Wild Reverse + Draw Four</>,
    card: { id: 'd-wrd4', type: 'WILD', color: 'ANY', value: 'WILD_REVERSE_DRAW_FOUR' },
    desc: 'Kombinasi Reverse dan Draw Four! Balik arah permainan, lalu pemain yang kini berikutnya harus ambil 4 kartu.',
    details: [
      { icon: <RefreshCw size={18} />, label: 'Efek 1', text: 'Arah permainan dibalik terlebih dahulu.' },
      { icon: <ArrowDownToLine size={18} />, label: 'Efek 2', text: 'Pemain yang kini berada di urutan berikutnya (setelah reverse) wajib ambil 4 kartu.' },
    ],
  },
  {
    title: <><Skull size={18} style={{marginRight: 6}} /> Mercy Rule</>,
    card: null,
    isMercy: true,
    desc: 'Jika jumlah kartu di tanganmu mencapai batas Mercy, kamu langsung DIELIMINASI dari permainan!',
    details: [
      { icon: <AlertTriangle size={18} />, label: 'Batas Default', text: 'Mercy Limit default adalah 25 kartu (bisa diatur 15/20/25/30).' },
      { icon: <BarChart2 size={18} />, label: 'Warning', text: '4 kartu sebelum limit, mercy bar berubah merah sebagai peringatan.' },
      { icon: <Trophy size={18} />, label: 'Menang', text: 'Pemain terakhir yang aktif atau yang menghabiskan semua kartu adalah pemenang!' },
    ],
  },
];

function RulesModal({ onClose }) {
  const [slide, setSlide] = useState(0);
  const total = TUTORIAL_SLIDES.length;
  const s = TUTORIAL_SLIDES[slide];

  const prev = () => setSlide(i => (i - 1 + total) % total);
  const next = () => setSlide(i => (i + 1) % total);

  return (
    <div className="rules-overlay" onClick={onClose}>
      <div className="rules-modal" onClick={e => e.stopPropagation()}>
        <button className="rules-close-btn" onClick={onClose}><XCircle size={20}/></button>
        <h2 className="rules-modal-title"><BookOpen size={20} style={{marginRight: 8, display: "inline-block", verticalAlign: "middle"}}/> CARA BERMAIN</h2>

        <div className="rules-progress-bar">
          {TUTORIAL_SLIDES.map((_, i) => (
            <button key={i} className={`rules-progress-dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>

        <div className="rules-slide">
          {s.isIntro ? (
            <div className="rules-intro-grid">
              <div className="rules-intro-logo">
                <span className="rules-uno-big">UNO</span>
                <span className="rules-nomercytext">NO MERCY</span>
              </div>
              <p className="rules-card-desc">{s.desc}</p>
              <div className="rules-detail-box">
                {s.details.map((d, i) => (
                  <div key={i} className="rules-detail-row">
                    <span className="rules-detail-icon">{d.icon}</span>
                    <div><strong>{d.label}:</strong><br />{d.text}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : s.isMercy ? (
            <div className="rules-card-section">
              <div className="rules-mercy-icon"><Skull size={20} /></div>
              <div className="rules-card-info">
                <h3 className="rules-card-name rules-mercy-name">{s.title}</h3>
                <p className="rules-card-desc">{s.desc}</p>
                <div className="rules-detail-box">
                  {s.details.map((d, i) => (
                    <div key={i} className="rules-detail-row">
                      <span className="rules-detail-icon">{d.icon}</span>
                      <div><strong>{d.label}:</strong><br />{d.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rules-card-section">
              <div className="rules-card-preview">
                {s.card && <UnoCard card={s.card} disabled />}
              </div>
              <div className="rules-card-info">
                <h3 className="rules-card-name">{s.title}</h3>
                <p className="rules-card-desc">{s.desc}</p>
                <div className="rules-detail-box">
                  {s.details.map((d, i) => (
                    <div key={i} className="rules-detail-row">
                      <span className="rules-detail-icon">{d.icon}</span>
                      <div><strong>{d.label}:</strong><br />{d.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rules-nav-row">
          <button className="rules-nav-btn" onClick={prev}>‹ Sebelumnya</button>
          <span className="rules-nav-counter">{slide + 1} / {total}</span>
          {slide < total - 1
            ? <button className="rules-nav-btn rules-nav-next" onClick={next}>Selanjutnya ›</button>
            : <button className="rules-nav-btn rules-nav-next" onClick={onClose}>Selesai ✓</button>
          }
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Main App
// ============================================================
function App() {
  const [view, setView] = useState('menu');
  const [nickname, setNickname] = useState('');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [room, setRoom] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [mercyLimit, setMercyLimit] = useState(25);
  const [wildColorPending, setWildColorPending] = useState(null); // cardId waiting for color pick
  const [winner, setWinner] = useState('');
  const [bgmActive, setBgmActive] = useState(false);
  const [notification, setNotification] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [spectating, setSpectating] = useState(false);
  const [spectatingPlayerId, setSpectatingPlayerId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [surrendered, setSurrendered] = useState(false);
  
  // Animation states
  const [flyingCards, setFlyingCards] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const pendingRoomRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const lastActionIdRef = useRef(null);
  const notifTimer = useRef(null);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  const showNotif = (msg) => {
    setNotification(msg);
    clearTimeout(notifTimer.current);
    notifTimer.current = setTimeout(() => setNotification(''), 3000);
  };

  const triggerAnimations = (action, r) => {
    setIsAnimating(true);

    // ── Fallback percentage positions (used if DOM element not found) ──
    const fallbackPos = (pId) => {
      const myIndex = r.players.findIndex(p => p.id === socket.id);
      const targetIndex = r.players.findIndex(p => p.id === pId);
      if (targetIndex === -1) return { top: '50%', left: '50%' };
      if (myIndex !== -1 && targetIndex === myIndex) return { top: '87%', left: '50%' };
      let relative = targetIndex - (myIndex !== -1 ? myIndex : 0);
      if (relative < 0) relative += r.players.length;
      if (r.players.length === 2) {
        if (relative === 1) return { top: '12%', left: '50%' };
      } else if (r.players.length === 3) {
        if (relative === 1) return { top: '10%', left: '25%' };
        if (relative === 2) return { top: '10%', left: '75%' };
      } else {
        if (relative === 1) return { top: '50%', left: '8%' };
        if (relative === 2) return { top: '10%', left: '50%' };
        if (relative === 3) return { top: '50%', left: '92%' };
      }
      return { top: '10%', left: '50%' };
    };

    // ── First: set the "empty hand" visual state and render flying cards at center ──
    const TEMPO = 220;
    const FLIGHT = 900;

    let visualRoom = JSON.parse(JSON.stringify(r));
    let initialCards = [];
    let delayCounter = 0;

    if (action.type === 'DEAL_ALL') {
      visualRoom.players.forEach(p => { p.hand = []; });
      r.players.forEach(p => {
        for (let i = 0; i < action.count; i++) {
          initialCards.push({ id: `${p.id}-${i}-${Math.random()}`, playerId: p.id, delay: delayCounter });
          delayCounter += TEMPO;
        }
      });
    } else if (action.type === 'DRAW') {
      const targetP = visualRoom.players.find(p => p.id === action.target);
      if (targetP) {
        targetP.hand = targetP.hand.slice(0, Math.max(0, targetP.hand.length - action.count));
      }
      for (let i = 0; i < action.count; i++) {
        initialCards.push({ id: `${action.target}-${i}-${Math.random()}`, playerId: action.target, delay: delayCounter });
        delayCounter += TEMPO;
      }
    }

    setRoom(visualRoom);

    // ── Wait for DOM to paint, then read actual element positions ──
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const resolvedCards = initialCards.map(c => {
          let targetEl;
          if (c.playerId === socket.id) {
            targetEl = document.getElementById('my-player-panel');
          } else {
            targetEl = document.getElementById(`opp-panel-${c.playerId}`);
          }

          let pos;
          if (targetEl) {
            const rect = targetEl.getBoundingClientRect();
            pos = { top: rect.top + rect.height / 2, left: rect.left + rect.width / 2, isPixel: true };
          } else {
            pos = { ...fallbackPos(c.playerId), isPixel: false };
          }

          return { ...c, targetX: pos.left, targetY: pos.top, isPixel: pos.isPixel, active: false };
        });

        setFlyingCards(resolvedCards);

        // Slight delay so React renders card at center before activating transition
        setTimeout(() => {
          setFlyingCards(prev => prev.map(c => ({ ...c, active: true })));
          drawCardSound();
        }, 60);

        const totalDuration = delayCounter + FLIGHT;
        setTimeout(() => {
          setFlyingCards([]);
          setIsAnimating(false);
          if (pendingRoomRef.current) {
            setRoom(pendingRoomRef.current);
            pendingRoomRef.current = null;
          }
        }, totalDuration);
      });
    });
  };

  useEffect(() => {
    socket.on('room_updated', setRoom);
    
    const handleNewState = (r, isStart = false) => {
      if (isStart) setView('playing');
      
      if (r.lastAction && r.lastAction.id !== lastActionIdRef.current) {
        lastActionIdRef.current = r.lastAction.id;
        pendingRoomRef.current = r;
        triggerAnimations(r.lastAction, r);
      } else {
        if (isAnimatingRef.current) {
          pendingRoomRef.current = r;
        } else {
          setRoom(r);
        }
      }
    };

    socket.on('game_started', (r) => handleNewState(r, true));
    socket.on('game_state', (r) => handleNewState(r, false));
    
    socket.on('game_finished', ({ winner: w }) => { setWinner(w); setView('finished'); unoSound(); });
    socket.on('player_eliminated', ({ nickname: n }) => { mercySound(); showNotif(<span>💀 MERCY! {n} dieliminasi!</span>); });
    socket.on('player_surrendered', ({ nickname: n }) => { showNotif(<span><Flag size={16} style={{marginRight: 4, display: "inline-block", verticalAlign: "middle"}}/> {n} menyerah!</span>); });
    socket.on('uno_called', ({ nickname: n }) => { unoSound(); showNotif(<span><Flame size={16} style={{marginRight: 4, display: "inline-block", verticalAlign: "middle"}}/> {n} berteriak UNO!</span>); });
    socket.on('uno_penalty', ({ nickname: n }) => { showNotif(<span><XCircle size={16} style={{marginRight: 4, display: "inline-block", verticalAlign: "middle"}}/> {n} lupa UNO — hukuman +2 kartu!</span>); });
    socket.on('notification', ({ msg }) => showNotif(msg));
    
    return () => {
      ['room_updated','game_started','game_state','game_finished','player_eliminated','player_surrendered','uno_called','uno_penalty','notification'].forEach(e => socket.off(e));
    };
  }, []);

  const handleBgmToggle = () => setBgmActive(toggleBgm());

  const handleCreateRoom = (isSinglePlayer = false) => {
    if (!nickname.trim()) return showNotif('Masukkan nama pemain!');
    socket.emit('create_room', { nickname, maxPlayers, mercyLimit, isSinglePlayer }, (res) => {
      if (res.success) { setRoom(res.room); setView('lobby'); } else showNotif(res.message);
    });
  };

  const handleJoinRoom = () => {
    if (!nickname.trim() || !inputRoomCode.trim()) return showNotif('Isi nama dan kode ruangan!');
    socket.emit('join_room', { roomCode: inputRoomCode, nickname }, (res) => {
      if (res.success) { setRoom(res.room); setView('lobby'); } else showNotif(res.message);
    });
  };

  if (view === 'playing' && room) {
    const me = room.players.find(p => p.id === socket.id);
    const topCard = room.discardPile[room.discardPile.length - 1];
    const isMyTurn = room.players[room.currentTurnIndex]?.id === socket.id;
    const canPlayDrawn = isMyTurn && me?.drawnCardThisTurn;
    const hasPendingDraw = (room.pendingDraw || 0) > 0;

    // Awaiting 7-Swap target selection (I must pick)
    const isAwaitingSwap = room.status === 'awaiting_swap_target' && room.swapInitiator === socket.id;
    // Awaiting Roulette color selection (I am the target)
    const isAwaitingRoulette = room.status === 'awaiting_roulette_color' && room.rouletteTarget === socket.id;

    if ((me?.eliminated || surrendered) && !spectating) {
      const isSurrender = surrendered;
      return (
        <div className="full-overlay eliminated-screen">
          {isSurrender ? (
            <>
              <Flag size={40} style={{color: '#ff9800', marginBottom: 8}}/>
              <h1 className="mercy-scream" style={{color: '#ff9800'}}>MENYERAH</h1>
              <p>Kamu memilih untuk menyerah dari permainan.</p>
            </>
          ) : (
            <>
              <h1 className="mercy-scream"><Skull size={24} style={{marginRight: 8}}/> NO MERCY</h1>
              <p>Anda telah dieliminasi dengan {me.hand.length} kartu.</p>
            </>
          )}
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button className="nm-btn nm-btn-primary" onClick={() => { setSurrendered(false); setSpectating(true); }}>Tonton Permainan</button>
            <button className="nm-btn nm-btn-outline" onClick={() => window.location.reload()}>Keluar ke Menu</button>
          </div>
        </div>
      );
    }

    return (
      <div className="game-board" onClick={() => showSettings && setShowSettings(false)} style={{ pointerEvents: isAnimating ? 'none' : 'auto' }}>
        <button className="bgm-btn" style={{ pointerEvents: 'auto' }} onClick={handleBgmToggle}>{bgmActive ? <Volume2 size={24}/> : <VolumeX size={24}/>}</button>

        {/* SETTINGS BUTTON or EXIT BUTTON (top right) */}
        {me?.eliminated || surrendered ? (
          <button className="settings-btn" style={{background: 'rgba(220,38,38,0.7)', borderColor: 'rgba(220,38,38,0.5)'}} onClick={() => window.location.reload()} title="Keluar ke Menu">
            <LogOut size={20}/>
          </button>
        ) : (
          <>
            <button className="settings-btn" onClick={(e) => { e.stopPropagation(); setShowSettings(s => !s); }} title="Pengaturan">
              <Settings size={20}/>
            </button>
            {showSettings && (
              <div className="settings-dropdown" onClick={e => e.stopPropagation()}>
                <button className="surrender-btn" onClick={async () => {
                  setShowSettings(false);
                  const result = await Swal.fire({
                    title: '<span style="color:#ff9800">🚩 Menyerah?</span>',
                    html: `
                      <div style="color:#cdd6f4; font-size:0.95rem; line-height:1.6">
                        Kamu akan <strong style="color:#ff5252">keluar dari permainan</strong> dan tidak bisa bermain lagi.<br/><br/>
                        <span style="color:#a6adc8">Kamu masih bisa <strong style="color:#89b4fa">menonton permainan</strong> hingga selesai.</span>
                      </div>
                    `,
                    icon: 'warning',
                    background: '#1e2030',
                    color: '#cdd6f4',
                    showCancelButton: true,
                    confirmButtonText: '🚩 Ya, Saya Menyerah',
                    cancelButtonText: 'Batal',
                    confirmButtonColor: '#e53935',
                    cancelButtonColor: '#45475a',
                    reverseButtons: true,
                    customClass: {
                      popup: 'swal-uno-popup',
                      title: 'swal-uno-title',
                    },
                    showClass: { popup: 'swal2-show' },
                    hideClass: { popup: 'swal2-hide' },
                  });
                  if (result.isConfirmed) {
                    socket.emit('surrender', { roomCode: room.roomCode });
                    setSurrendered(true);
                    Swal.fire({
                      title: '<span style="color:#ff9800">🚩 Menyerah</span>',
                      html: '<div style="color:#a6adc8">Kamu telah menyerah. Tetap semangat!</div>',
                      icon: 'info',
                      background: '#1e2030',
                      color: '#cdd6f4',
                      timer: 2000,
                      timerProgressBar: true,
                      showConfirmButton: false,
                      customClass: { popup: 'swal-uno-popup' },
                    });
                  }
                }}>
                  <Flag size={16}/> Menyerah
                </button>
              </div>
            )}
          </>
        )}
        
        {/* FLYING CARDS ANIMATION */}
        {flyingCards.map(fc => {
          const endTop  = fc.isPixel ? `${fc.targetY}px` : fc.targetY;
          const endLeft = fc.isPixel ? `${fc.targetX}px` : fc.targetX;
          return (
            <div
              key={fc.id}
              style={{
                position: 'fixed',
                top:  fc.active ? endTop  : '50%',
                left: fc.active ? endLeft : '50%',
                width: '72px',
                height: '108px',
                borderRadius: '10px',
                // Exact card-back background
                background: 'linear-gradient(135deg, #792b33 0%, #101620 100%)',
                border: '4px solid #8895a4',
                boxShadow: fc.active
                  ? '0 0 0 1.5px #0f1822, 0 4px 12px rgba(0,0,0,0.55)'
                  : '0 0 0 1.5px #0f1822, 0 12px 32px rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: fc.active
                  ? 'translate(-50%, -50%) rotate(12deg)'
                  : 'translate(-50%, -50%) rotate(-3deg)',
                opacity: fc.active ? 0 : 1,
                transition: 'all 0.9s cubic-bezier(0.22, 0.68, 0, 1.2)',
                transitionDelay: `${fc.delay}ms`,
                zIndex: 9999,
                pointerEvents: 'none',
              }}
            >
              {/* Inner dashed frame — same as .card-back-inner */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                border: '2px dashed rgba(255,255,255,0.25)',
                borderRadius: '6px',
                padding: '6px 10px',
              }}>
                {/* UNO yellow text with red shadow */}
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 900,
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  color: '#fdd835',
                  textShadow: '2px 2px 0 #e53935',
                  lineHeight: 1,
                }}>UNO</span>
                {/* NO MERCY subtitle */}
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '0.28rem',
                  fontWeight: 900,
                  letterSpacing: '1px',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                }}>NO MERCY</span>
              </div>
            </div>
          );
        })}

        
        {notification && <div className="toast-notif">{notification}</div>}
        {hasPendingDraw && (
          <div className="pending-draw-banner"><AlertTriangle size={20} style={{marginRight: 6, display: "inline-block", verticalAlign: "middle"}}/> Stack aktif! Total +{room.pendingDraw} — Stack atau terima!</div>
        )}

        {/* SPECTATOR BANNER */}
        {spectating && me?.eliminated && (
          <div className="spectator-banner">
            <Skull size={16} style={{marginRight: 8, flexShrink: 0}}/>
            <span>Mode Spectator — Klik nama pemain untuk melihat kartunya</span>
            <button className="spectator-exit-btn" onClick={() => window.location.reload()}>Keluar</button>
          </div>
        )}

        {/* SWAP TARGET MODAL */}
        {isAwaitingSwap && (
          <div className="action-modal-overlay">
            <div className="action-modal">
              <h3 className="action-modal-title"><RefreshCw size={18} style={{marginRight: 4}}/> Pilih Target Swap</h3>
              <p className="action-modal-desc">Pilih pemain untuk menukar kartu dengan kamu</p>
              <div className="swap-target-list">
                {room.players
                  .filter(p => p.id !== socket.id && !p.eliminated)
                  .map(p => (
                    <button
                      key={p.id}
                      className="swap-target-btn"
                      onClick={() => {
                        playCardSound();
                        socket.emit('swap_cards', { roomCode: room.roomCode, targetId: p.id });
                      }}
                      onMouseEnter={hoverSound}
                    >
                      <span className="swap-target-icon">{p.isBot ? <Bot size={18} /> : <User size={18} />}</span>
                      <span className="swap-target-name">{p.nickname}</span>
                      <span className="swap-target-count">{p.hand.length} kartu</span>
                    </button>
                  ))
                }
              </div>
              <button
                className="wild-color-cancel"
                style={{ marginTop: '16px' }}
                onClick={() => {
                  hoverSound();
                  socket.emit('cancel_swap', { roomCode: room.roomCode });
                }}
                onMouseEnter={hoverSound}
              >
                <XCircle size={16} style={{marginRight: 6}} /> Batal
              </button>
            </div>
          </div>
        )}

        {/* ROULETTE COLOR MODAL */}
        {isAwaitingRoulette && (
          <div className="action-modal-overlay">
            <div className="action-modal">
              <h3 className="action-modal-title"><Dices size={24} style={{marginRight: 8, display: "inline-block", verticalAlign: "middle"}}/> Wild Color Roulette!</h3>
              <p className="action-modal-desc">Pilih warna — kamu akan mengambil kartu sampai mendapatkan warna ini!</p>
              <div className="roulette-color-grid">
                {['RED','YELLOW','GREEN','BLUE'].map(c => (
                  <button
                    key={c}
                    className={`roulette-color-btn roulette-${c.toLowerCase()}`}
                    onClick={() => {
                      playCardSound();
                      socket.emit('roulette_color', { roomCode: room.roomCode, color: c });
                    }}
                    onMouseEnter={hoverSound}
                  >
                    {c === 'RED' && <Circle fill="#e53935" stroke="white" size={20}/>}
                    {c === 'YELLOW' && <Circle fill="#fdd835" stroke="#1a1000" size={20}/>}
                    {c === 'GREEN' && <Circle fill="#43a047" stroke="white" size={20}/>}
                    {c === 'BLUE' && <Circle fill="#1e88e5" stroke="white" size={20}/>}
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WILD COLOR PICKER MODAL */}
        {wildColorPending && (
          <div className="action-modal-overlay">
            <div className="action-modal wild-color-modal">
              <div className="wild-color-modal-icon"><SquareStack size={40} /></div>
              <h3 className="action-modal-title">Pilih Warna</h3>
              <p className="action-modal-desc">Tentukan warna aktif untuk pemain berikutnya</p>
              <div className="wild-color-grid">
                {[
                  { c: 'RED',    emoji: <Circle fill="#ff4444" stroke="none" size={24}/>, label: 'Merah'  },
                  { c: 'YELLOW', emoji: <Circle fill="#fdd835" stroke="none" size={24}/>, label: 'Kuning' },
                  { c: 'GREEN',  emoji: <Circle fill="#43a047" stroke="none" size={24}/>, label: 'Hijau'  },
                  { c: 'BLUE',   emoji: <Circle fill="#1e88e5" stroke="none" size={24}/>, label: 'Biru'   },
                ].map(({ c, emoji, label }) => (
                  <button
                    key={c}
                    className={`wild-color-btn wild-color-${c.toLowerCase()}`}
                    onClick={() => {
                      playCardSound();
                      socket.emit('play_card', { roomCode: room.roomCode, cardId: wildColorPending, chosenColor: c });
                      setWildColorPending(null);
                    }}
                    onMouseEnter={hoverSound}
                  >
                    <span className="wild-color-emoji">{emoji}</span>
                    <span className="wild-color-label">{label}</span>
                  </button>
                ))}
              </div>
              <button
                className="wild-color-cancel"
                onClick={() => setWildColorPending(null)}
                onMouseEnter={hoverSound}
              >
                <XCircle size={16} style={{marginRight: 6}} /> Batal
              </button>
            </div>
          </div>
        )}

        {/* OPPONENTS */}
        <div className="opponents-bar">
          {room.players.filter(p => p.id !== socket.id).map(p => {
            const isTurn = room.players[room.currentTurnIndex]?.id === p.id;
            const mercyPct = Math.min(100, (p.hand.length / room.mercyLimit) * 100);
            const isWarning = p.hand.length >= room.mercyLimit - 4;
            return (
              <div
                key={p.id}
                id={`opp-panel-${p.id}`}
                className={`opp-card ${isTurn ? 'opp-active' : ''} ${p.eliminated ? 'opp-dead' : ''} ${spectating && !p.eliminated ? 'opp-spectate' : ''}`}
                onClick={() => {
                  if (spectating && !p.eliminated) {
                    setSpectatingPlayerId(p.id);
                  } else if (p.hand.length === 1 && !p.unoCalled && !p.eliminated) {
                    socket.emit('challenge_uno', { roomCode: room.roomCode, targetId: p.id });
                  }
                }}
                style={spectating && !p.eliminated ? { cursor: 'pointer', border: '2px solid rgba(255,255,255,0.3)' } : {}}
              >
                <div className="opp-name-row">
                  <span className="opp-name-txt">{p.isBot ? <Bot size={18} /> : <User size={18} />} {p.nickname}</span>
                  {p.eliminated && <span><Skull size={20} /></span>}
                </div>
                <div className="opp-card-row">
                  {Array.from({ length: Math.min(p.hand.length, 7) }).map((_, i) => (
                    <div key={i} className="opp-mini-card" style={{ marginLeft: i > 0 ? '-12px' : 0 }}/>
                  ))}
                  {p.hand.length > 7 && <span className="opp-card-count">+{p.hand.length - 7}</span>}
                </div>
                <div className="mercy-bar-wrap">
                  <div className={`mercy-bar-fill ${isWarning ? 'mercy-danger' : ''}`} style={{ width: `${mercyPct}%` }}/>
                </div>
                <div className="opp-status-row">
                  <span>{p.hand.length} kartu</span>
                  {p.unoCalled && <span className="uno-badge"><Flame size={16} style={{marginRight: 4, display: "inline-block", verticalAlign: "middle"}}/> UNO!</span>}
                  {!spectating && p.hand.length === 1 && !p.unoCalled && !p.eliminated && <span className="challenge-badge">TAP: Challenge!</span>}
                  {spectating && !p.eliminated && <span className="spectate-hint"><Search size={12} style={{marginRight: 3}}/> Lihat kartu</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* TABLE */}
        <div className="game-table">
          <div className="table-zone">
            <div className="pile-area">
              <UnoCard isHidden card={null} onClick={isMyTurn && room.status === 'playing' ? () => { drawCardSound(); socket.emit('draw_card', { roomCode: room.roomCode }); } : null} />
              <span className="pile-label">AMBIL</span>
            </div>
            <div className="table-center-info">
              <div className={`color-ring color-ring-${(room.currentColor || 'red').toLowerCase()}`}/>
              <span className="color-label">{room.currentColor}</span>
              <div className={`direction-arrow ${room.direction === 1 ? 'dir-cw' : 'dir-ccw'}`}>
                {room.direction === 1 ? (
                  <RefreshCw size={44} color="white" />
                ) : (
                  <RefreshCcw size={44} color="white" />
                )}
                <span className="dir-label">{room.direction === 1 ? '◀ Kiri' : 'Kanan ▶'}</span>
              </div>
            </div>
            <div className="pile-area">
              {topCard && <UnoCard card={topCard} disabled />}
              <span className="pile-label">TUMPUKAN</span>
            </div>
          </div>
        </div>

        {/* MY HAND */}
        <div id="my-player-panel" className={`player-area ${isMyTurn ? 'my-turn' : ''}`}>
          <div className="player-top-row">
            <div className="my-stats">
              <span className="my-name-badge"><User size={16} style={{marginRight: 4, display: "inline-block", verticalAlign: "middle"}}/> {me?.nickname}</span>
              <span className="my-card-count">{me?.hand.length} kartu</span>
            </div>

            <div className="action-buttons">
              {me?.hand.length === 1 && !me?.unoCalled && (
                <button className="nm-btn nm-btn-uno" onClick={() => { unoSound(); socket.emit('call_uno', { roomCode: room.roomCode }); }} onMouseEnter={hoverSound}>
                  <Flame size={16} style={{marginRight: 4, display: "inline-block", verticalAlign: "middle"}}/> UNO!
                </button>
              )}
              {canPlayDrawn && room.status === 'playing' && (
                <button className="nm-btn nm-btn-pass" onClick={() => { playCardSound(); socket.emit('pass_turn', { roomCode: room.roomCode }); }} onMouseEnter={hoverSound}>
                  LEWATI
                </button>
              )}
            </div>
          </div>
          <div className="hand-container">
            {me?.hand.map((card) => {
              const isStackable = (c) => {
                if (!hasPendingDraw) return true;
                const drawCards = ['DRAW_TWO', 'WILD_DRAW_FOUR', 'WILD_DRAW_SIX', 'WILD_DRAW_TEN', 'WILD_REVERSE_DRAW_FOUR'];
                const amounts = { DRAW_TWO: 2, WILD_DRAW_FOUR: 4, WILD_DRAW_SIX: 6, WILD_DRAW_TEN: 10, WILD_REVERSE_DRAW_FOUR: 4 };
                if (!drawCards.includes(c.value)) return false;
                return (amounts[c.value] || 0) >= (amounts[topCard?.value] || 0);
              };
              // Eliminated spectators cannot play
              const isClickable = !me?.eliminated && isMyTurn && room.status === 'playing' && (!canPlayDrawn || card.id === me.drawnCardThisTurn) && isStackable(card);
              const isHighlight = canPlayDrawn && card.id === me.drawnCardThisTurn;
              // Wild cards that need color selection (exclude WILD_COLOR_ROULETTE)
              const needsColorPick = card.color === 'ANY' && card.value !== 'WILD_COLOR_ROULETTE';
              return (
                <UnoCard
                  key={card.id}
                  card={card}
                  onClick={isClickable ? (id) => {
                    playCardSound();
                    if (needsColorPick) {
                      // Show color picker modal, don't send to server yet
                      setWildColorPending(id);
                    } else {
                      socket.emit('play_card', { roomCode: room.roomCode, cardId: id, chosenColor: 'RED' });
                    }
                  } : null}
                  disabled={!isClickable}
                  isHighlight={isHighlight}
                />
              );
            })}
          </div>
        </div>

        {/* SPECTATOR MODAL */}
        {spectatingPlayerId && (
          <div className="action-modal-overlay" onClick={() => setSpectatingPlayerId(null)}>
            <div className="action-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '90%', width: 'auto', background: '#1c2128' }}>
              <button className="rules-close-btn" onClick={() => setSpectatingPlayerId(null)}><XCircle size={20}/></button>
              <h3 className="action-modal-title" style={{textAlign: 'left'}}><Search size={24} style={{marginRight: 8, display: "inline-block", verticalAlign: "middle"}}/> Kartu {room.players.find(p => p.id === spectatingPlayerId)?.nickname}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px', justifyContent: 'center', maxHeight: '60vh', overflowY: 'auto' }}>
                {room.players.find(p => p.id === spectatingPlayerId)?.hand.map((c, i) => (
                  <div key={i} style={{transform: 'scale(0.8)', margin: '-15px'}}>
                    <UnoCard card={c} disabled />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="menu-screen">
      <button className="bgm-btn" onClick={handleBgmToggle}>{bgmActive ? <Volume2 size={24}/> : <VolumeX size={24}/>}</button>
      {notification && <div className="toast-notif">{notification}</div>}

      <div className="brand">
        <h1 className="brand-uno">UNO</h1>
        <h2 className="brand-mercy">SHOW 'EM NO MERCY</h2>
      </div>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}

      {view === 'menu' && (
        <div className="nm-panel">
          <input className="nm-input" type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Nama Pemain..." maxLength={15}/>
          <div className="btn-stack">
            <button className="nm-btn nm-btn-red" onClick={() => { playCardSound(); handleCreateRoom(true); }} onMouseEnter={hoverSound}><Swords size={20} style={{marginRight: 8, display: "inline-block", verticalAlign: "middle"}}/> LAWAN BOT</button>
            <button className="nm-btn nm-btn-dark" onClick={() => { playCardSound(); setView('create'); }} onMouseEnter={hoverSound}><Home size={20} style={{marginRight: 8, display: "inline-block", verticalAlign: "middle"}}/> BUAT RUANGAN</button>
            <button className="nm-btn nm-btn-outline" onClick={() => { playCardSound(); setView('join'); }} onMouseEnter={hoverSound}><Link size={20} style={{marginRight: 8, display: "inline-block", verticalAlign: "middle"}}/> GABUNG RUANGAN</button>
            <button className="nm-btn nm-btn-rules" onClick={() => { playCardSound(); setShowRules(true); }} onMouseEnter={hoverSound}><BookOpen size={20} style={{marginRight: 8, display: "inline-block", verticalAlign: "middle"}}/> CARA BERMAIN</button>
          </div>
        </div>
      )}

      {view === 'create' && (
        <div className="nm-panel">
          <h2 className="panel-title">BUAT RUANGAN</h2>
          <label className="nm-label">Jumlah Pemain</label>
          <select className="nm-select" value={maxPlayers} onChange={e => setMaxPlayers(+e.target.value)}>
            {[2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Pemain</option>)}
          </select>
          <label className="nm-label">Batas Mercy (Kartu)</label>
          <select className="nm-select" value={mercyLimit} onChange={e => setMercyLimit(+e.target.value)}>
            {[15,20,25,30].map(n => <option key={n} value={n}>{n} Kartu</option>)}
          </select>
          <div className="btn-stack">
            <button className="nm-btn nm-btn-dark" onClick={() => { playCardSound(); handleCreateRoom(false); }} onMouseEnter={hoverSound}>BUAT</button>
            <button className="nm-btn nm-btn-outline" onClick={() => { playCardSound(); setView('menu'); }} onMouseEnter={hoverSound}>KEMBALI</button>
          </div>
        </div>
      )}

      {view === 'join' && (
        <div className="nm-panel">
          <h2 className="panel-title">GABUNG RUANGAN</h2>
          <input className="nm-input" type="text" value={inputRoomCode} onChange={e => setInputRoomCode(e.target.value.toUpperCase())} placeholder="KODE RUANGAN" maxLength={6}/>
          <div className="btn-stack">
            <button className="nm-btn nm-btn-dark" onClick={() => { playCardSound(); handleJoinRoom(); }} onMouseEnter={hoverSound}>GABUNG</button>
            <button className="nm-btn nm-btn-outline" onClick={() => { playCardSound(); setView('menu'); }} onMouseEnter={hoverSound}>KEMBALI</button>
          </div>
        </div>
      )}

      {view === 'lobby' && room && (
        <div className="nm-panel lobby-panel">
          <div className="lobby-header">
            <h2 className="panel-title">LOBI</h2>
            <div className="room-code-badge">{room.roomCode}</div>
          </div>
          <div className="player-list">
            {room.players.map(p => (
              <div key={p.id} className="player-entry">
                <span>{p.isHost ? <Crown size={18} /> : <User size={18} />} {p.nickname} {p.isBot ? <Bot size={18} /> : ''}</span>
                <span className={p.isReady ? 'status-ready' : 'status-wait'}>{p.isReady ? <><CheckCircle size={18} style={{marginRight: 4}}/> SIAP</> : <><Hourglass size={18} style={{marginRight: 4}}/> MENUNGGU</>}</span>
              </div>
            ))}
          </div>
          <div className="btn-stack">
            {room.hostId === socket.id && (
              <button className="nm-btn nm-btn-red" disabled={!room.players.every(p => p.isReady) || room.players.length < 2} onClick={() => { playCardSound(); socket.emit('start_game', { roomCode: room.roomCode }); }} onMouseEnter={hoverSound}>
                🚀 MULAI PERMAINAN
              </button>
            )}
            {room.players.find(p => p.id === socket.id)?.isHost === false && (
              <button className="nm-btn nm-btn-outline" onClick={() => { playCardSound(); socket.emit('toggle_ready', { roomCode: room.roomCode }); }} onMouseEnter={hoverSound}>
                SIAP
              </button>
            )}
          </div>
        </div>
      )}

      {view === 'finished' && (
        <div className="nm-panel text-center">
          <h2 className="panel-title">PERMAINAN SELESAI</h2>
          <h1 className="winner-shout"><Trophy size={28} style={{marginRight: 8}}/> {winner}</h1>
          <p style={{color:'#aaa', marginBottom: '20px'}}>memenangkan pertandingan!</p>
          <button className="nm-btn nm-btn-dark" onClick={() => { playCardSound(); window.location.reload(); }} onMouseEnter={hoverSound}>MENU UTAMA</button>
        </div>
      )}
    </div>
  );
}

export default App;
