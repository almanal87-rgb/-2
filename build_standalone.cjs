const fs = require('fs');

const images = JSON.parse(fs.readFileSync('images-base64.json', 'utf8'));

const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Snakes and Ladder</title>
  <meta name="description" content="Snakes and Ladder Learning Game - Interactive educational board game." />
  <meta property="og:title" content="Snakes and Ladder" />
  <meta property="og:description" content="Snakes and Ladder Learning Game - Interactive educational board game." />
  <style>
    /* RESET & BASE */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --bg-gradient: radial-gradient(circle at 50% 20%, #0c2b64 0%, #061638 60%, #030a1c 100%);
      --gold: #ffd85b;
      --gold-dark: #d49b14;
      --gold-glow: rgba(255, 216, 91, 0.45);
      --cyan-bright: #32dfff;
      --cyan-deep: #087cf4;
      --royal-blue: #0a439f;
      --navy-dark: #061c52;
      --panel-cream: #fffdf7;
      --panel-cream-border: #e2d7c3;
      --text-dark: #12223f;
      --text-muted: #4e5e7e;
      --color-p1: #ff5d66;
      --color-p2: #1878ee;
      --color-p3: #18a75b;
      --color-p4: #8a4de1;
      --color-p5: #ef8b20;
    }

    body {
      font-family: 'Trebuchet MS', 'Arial Rounded MT Bold', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-gradient);
      color: #ffffff;
      min-height: 100vh;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1.5;
    }

    /* ACCESSIBILITY FOCUS INDICATORS */
    button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
      outline: 3px solid var(--gold);
      outline-offset: 2px;
    }

    /* SR ONLY */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* APP CONTAINER */
    #app {
      width: 100%;
      max-width: 1320px;
      padding: 12px 16px 32px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    /* HEADER */
    header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding: 0 4px;
    }

    .title-img-container {
      display: flex;
      align-items: center;
    }

    .title-img {
      width: min(72vw, 720px);
      height: 120px;
      object-fit: cover;
      object-position: left 40%;
      filter: drop-shadow(0 8px 16px rgba(3, 10, 28, 0.85));
      border-radius: 12px;
      display: block;
      pointer-events: none;
      user-select: none;
    }

    .sound-toggle-btn {
      background: linear-gradient(135deg, #187cf4, #0a439f);
      border: 2px solid var(--cyan-bright);
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 28px;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(8, 124, 244, 0.4), inset 0 1px 2px rgba(255,255,255,0.4);
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s;
      white-space: nowrap;
      min-height: 44px;
    }

    .sound-toggle-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(8, 124, 244, 0.6);
      background: linear-gradient(135deg, #32dfff, #0a439f);
    }

    .sound-toggle-btn:active {
      transform: translateY(1px);
    }

    /* VIEWS */
    .view-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hidden {
      display: none !important;
    }

    /* SETTINGS CARD */
    .settings-panel {
      width: 100%;
      max-width: 780px;
      background: var(--panel-cream);
      border-radius: 20px;
      padding: 28px;
      color: var(--text-dark);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), 0 0 0 3px #40e8ff, 0 0 0 6px #0876ed;
      margin-top: 8px;
    }

    .settings-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .settings-header h1 {
      font-size: clamp(24px, 4vw, 32px);
      color: #0a439f;
      font-weight: 800;
      margin-bottom: 6px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .settings-header p {
      color: var(--text-muted);
      font-size: 15px;
      font-weight: 500;
    }

    .setting-group {
      margin-bottom: 22px;
    }

    .setting-label {
      font-size: 16px;
      font-weight: 700;
      color: #0a357c;
      margin-bottom: 10px;
      display: block;
    }

    /* MODE SELECTION */
    .mode-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 14px;
    }

    .mode-card {
      background: #f0f6ff;
      border: 3px solid #b8d6fc;
      border-radius: 14px;
      padding: 16px;
      text-align: center;
      cursor: pointer;
      font-size: 16px;
      font-weight: 700;
      color: #0a439f;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 72px;
    }

    .mode-card:hover {
      background: #e3efff;
      border-color: #087cf4;
      transform: translateY(-2px);
    }

    .mode-card[aria-pressed="true"] {
      background: #e1efff;
      border-color: #087cf4;
      box-shadow: 0 0 0 3px #ffd85b, 0 6px 16px rgba(8, 124, 244, 0.35);
      color: #062b66;
    }

    /* PLAYER COUNT BUTTONS */
    .count-selector {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 8px;
      flex-wrap: wrap;
    }

    .count-btn {
      flex: 1;
      min-width: 50px;
      height: 44px;
      background: #ffffff;
      border: 2px solid #b8d6fc;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
      color: #0a439f;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .count-btn:hover {
      border-color: #087cf4;
      background: #f0f6ff;
    }

    .count-btn[aria-pressed="true"] {
      background: #087cf4;
      color: #ffffff;
      border-color: #ffd85b;
      box-shadow: 0 0 0 2px #ffd85b;
    }

    /* PLAYER NAMES */
    .player-inputs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-bottom: 12px;
    }

    .player-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f4f7fb;
      padding: 8px 12px;
      border-radius: 10px;
      border: 1px solid #dce4ee;
    }

    .token-dot {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.25);
      flex-shrink: 0;
    }

    .player-input-row input {
      flex: 1;
      padding: 8px 10px;
      border: 1px solid #c2d2e8;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      color: #0a2550;
      background: #ffffff;
      width: 100%;
    }

    .save-names-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-green {
      background: linear-gradient(135deg, #18a75b, #107c41);
      border: 2px solid #55e697;
      color: #ffffff;
      font-weight: 700;
      font-size: 15px;
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(24, 167, 91, 0.35);
      transition: all 0.15s ease;
      min-height: 44px;
    }

    .btn-green:hover {
      background: linear-gradient(135deg, #22c76f, #138d4b);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(24, 167, 91, 0.45);
    }

    .save-status-indicator {
      font-size: 14px;
      font-weight: 700;
      color: #107c41;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .save-status-indicator.unsaved {
      color: #c96500;
    }

    /* QUESTION EDITOR DETAILS */
    details.question-details {
      background: #f8fbff;
      border: 2px solid #b8d6fc;
      border-radius: 12px;
      padding: 12px 16px;
      margin-top: 14px;
      margin-bottom: 22px;
    }

    details.question-details summary {
      font-weight: 700;
      color: #0a439f;
      cursor: pointer;
      font-size: 16px;
      padding: 6px 0;
      user-select: none;
    }

    .q-editor-body {
      margin-top: 14px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .bulk-textareas {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .bulk-col {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .bulk-col label {
      font-size: 13px;
      font-weight: 700;
      color: #0a357c;
    }

    .bulk-col textarea {
      width: 100%;
      height: 140px;
      border: 1px solid #b8d6fc;
      border-radius: 8px;
      padding: 8px;
      font-family: inherit;
      font-size: 13px;
      resize: vertical;
    }

    .single-square-editor {
      background: #ffffff;
      border: 1px solid #d0e0f5;
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .single-editor-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      align-items: center;
    }

    .single-editor-row select, .single-editor-row input {
      padding: 8px 10px;
      border: 1px solid #b8d6fc;
      border-radius: 6px;
      font-size: 14px;
    }

    .single-editor-row select {
      font-weight: 700;
      color: #0a439f;
    }

    .single-editor-row input {
      flex: 1;
      min-width: 140px;
    }

    .single-btn-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-secondary {
      background: #f0f4f9;
      border: 1px solid #b8cbe0;
      color: #0a357c;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      min-height: 40px;
    }

    .btn-secondary:hover {
      background: #e2ecf7;
    }

    .btn-danger {
      background: #ffebee;
      border: 1px solid #ffcdd2;
      color: #c62828;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      min-height: 40px;
    }

    .btn-danger:hover {
      background: #ffcdd2;
    }

    .msg-feedback {
      font-size: 13px;
      font-weight: 600;
      padding: 6px 10px;
      border-radius: 6px;
      display: none;
    }

    .msg-feedback.success {
      display: block;
      background: #e8f5e9;
      color: #2e7d32;
    }

    .msg-feedback.error {
      display: block;
      background: #ffebee;
      color: #c62828;
    }

    /* START GAME BUTTON */
    .btn-start-game {
      width: 100%;
      background: linear-gradient(135deg, #18a75b, #0e7239);
      border: 3px solid #55e697;
      color: #ffffff;
      font-size: clamp(18px, 2.8vw, 22px);
      font-weight: 800;
      padding: 14px 24px;
      border-radius: 14px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(24, 167, 91, 0.45), 0 0 0 2px var(--gold);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      min-height: 52px;
    }

    .btn-start-game:hover {
      background: linear-gradient(135deg, #22c76f, #118544);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(24, 167, 91, 0.6), 0 0 0 3px var(--gold);
    }

    /* ========================================================= */
    /* GAME VIEW LAYOUT */
    /* ========================================================= */
    .game-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }

    /* TOP ACTION BUTTONS BAR */
    .game-actions-bar {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .btn-action-nav {
      background: linear-gradient(135deg, #187cf4, #0a439f);
      border: 2px solid var(--cyan-bright);
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(8, 124, 244, 0.35);
      transition: all 0.15s ease;
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn-action-nav:hover {
      background: linear-gradient(135deg, #32dfff, #0a439f);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(8, 124, 244, 0.5);
    }

    /* GAME GRID: BOARD ON LEFT, CONTROL PANEL ON RIGHT */
    .game-main-stage {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 310px;
      gap: 20px;
      align-items: start;
    }

    /* BOARD WRAPPER & METALLIC FRAME */
    .board-column {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .board-outer-halo {
      position: relative;
      border-radius: 24px;
      padding: 10px;
      background: linear-gradient(135deg, #40e8ff 0%, #0876ed 35%, #582bc2 70%, #02a5eb 100%);
      box-shadow: 0 0 35px rgba(255, 216, 91, 0.4), 0 0 60px rgba(8, 124, 244, 0.45), 0 16px 36px rgba(0, 0, 0, 0.7);
      border: 2px solid rgba(255, 216, 91, 0.6);
    }

    .board-frame {
      position: relative;
      width: 100%;
      aspect-ratio: 5 / 4;
      background: #061c52;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8), 0 0 0 2px #0a439f;
    }

    /* MANDATORY BOARD IMAGE EXACT ALIGNMENT */
    .board-bg-img {
      position: absolute;
      left: 49.5%;
      top: 52.8%;
      width: 120%;
      height: 123%;
      transform: translate(-50%, -50%);
      object-fit: fill;
      pointer-events: none;
      user-select: none;
      z-index: 1;
      display: block;
    }

    /* 5x4 GRID OF SQUARES */
    .board-squares-grid {
      position: absolute;
      inset: 0;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(4, 1fr);
      z-index: 2;
    }

    .board-square-cell {
      position: relative;
      width: 100%;
      height: 100%;
      /* Preserve transparent hit area so baked image is clear */
      background: transparent;
      user-select: none;
    }

    /* QUESTION MARK BUTTONS */
    .square-q-btn {
      position: absolute;
      top: 11%;
      right: 7%;
      width: clamp(24px, 3.4vw, 36px);
      height: clamp(24px, 3.4vw, 36px);
      border-radius: 50%;
      border: 2px solid #ffffff;
      color: #ffffff;
      font-size: clamp(13px, 1.8vw, 19px);
      font-weight: 900;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.45);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      z-index: 4;
      padding: 0;
      touch-action: manipulation;
    }

    /* SQUARE 10 SPECIAL OFFSET TO AVOID COVERING NUMBER 10 */
    .square-q-btn[data-sq="10"] {
      right: 24% !important;
    }

    .square-q-btn:hover {
      transform: scale(1.15);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
    }

    .square-q-btn.col-0 { background: #18a75b; }
    .square-q-btn.col-1 { background: #1878ee; }
    .square-q-btn.col-2 { background: #8a4de1; }
    .square-q-btn.col-3 { background: #ff5d66; }
    .square-q-btn.col-4 { background: #ef8b20; }

    .square-q-btn.has-question {
      background: #18a75b !important;
      box-shadow: 0 0 10px #18a75b, 0 3px 8px rgba(0,0,0,0.5);
      border-color: #ffd85b;
    }

    /* STARTING DOCK */
    .starting-dock-container {
      background: linear-gradient(135deg, #09204e, #041029);
      border: 2px solid #087cf4;
      border-radius: 14px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.5), inset 0 1px 2px rgba(64, 232, 255, 0.2);
    }

    .dock-title-badge {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1px;
      color: var(--cyan-bright);
      text-transform: uppercase;
      white-space: nowrap;
      text-shadow: 0 0 8px rgba(50, 223, 255, 0.6);
    }

    .dock-slots-area {
      position: relative;
      flex: 1;
      height: 48px;
      background: rgba(0, 0, 0, 0.35);
      border-radius: 10px;
      border: 1px dashed rgba(64, 232, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* TOKEN LAYER (FOR ABSOLUTE GEOMETRIC CENTERING & STEP HOPS) */
    .tokens-overlay-container {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 10;
    }

    .player-token {
      position: absolute;
      width: clamp(24px, 4vw, 42px);
      height: clamp(24px, 4vw, 42px);
      border-radius: 50%;
      border: 2.5px solid #ffffff;
      color: #ffffff;
      font-weight: 900;
      font-size: clamp(12px, 2vw, 18px);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.5);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), left 0.25s ease, top 0.25s ease;
      transform: translate(-50%, -50%);
      pointer-events: auto;
      user-select: none;
      z-index: 12;
    }

    .player-token.hop-anim {
      animation: tokenHop 0.25s ease-in-out;
    }

    @keyframes tokenHop {
      0% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -85%) scale(1.22); box-shadow: 0 14px 20px rgba(0,0,0,0.5); }
      100% { transform: translate(-50%, -50%) scale(1); }
    }

    .token-p1 { background: radial-gradient(circle at 35% 35%, #ff8b92, var(--color-p1), #b81c25); }
    .token-p2 { background: radial-gradient(circle at 35% 35%, #63aaff, var(--color-p2), #07469a); }
    .token-p3 { background: radial-gradient(circle at 35% 35%, #4ee08f, var(--color-p3), #096130); }
    .token-p4 { background: radial-gradient(circle at 35% 35%, #b689fc, var(--color-p4), #4c189c); }
    .token-p5 { background: radial-gradient(circle at 35% 35%, #ffb663, var(--color-p5), #9e5305); }

    /* ========================================================= */
    /* RIGHT SIDE CONTROL PANEL */
    /* ========================================================= */
    .control-column {
      display: flex;
      flex-direction: column;
      gap: 14px;
      position: sticky;
      top: 14px;
    }

    .control-panel {
      background: var(--panel-cream);
      border-radius: 20px;
      padding: 18px 16px;
      color: var(--text-dark);
      border: 3px solid #40e8ff;
      box-shadow: 0 0 0 4px #0876ed, 0 12px 30px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      gap: 14px;
      position: relative;
    }

    .turn-status-header {
      text-align: center;
      border-bottom: 2px solid #e5edf7;
      padding-bottom: 10px;
    }

    .turn-label {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #087cf4;
      text-transform: uppercase;
    }

    .current-player-name {
      font-size: 20px;
      font-weight: 900;
      color: #0a357c;
      margin: 2px 0 4px 0;
      word-break: break-word;
    }

    .turn-status-message {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-muted);
      min-height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* AVATAR & DICE SECTION */
    .avatar-dice-row {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 10px;
      padding: 6px 0;
    }

    .avatar-box-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    /* ANIMATED QUESTION MARKS ABOVE AVATAR */
    .avatar-floating-qmarks {
      position: absolute;
      top: -24px;
      display: flex;
      gap: 6px;
      font-size: 16px;
      font-weight: 900;
      color: #087cf4;
      pointer-events: none;
    }

    .floating-qm-1 { animation: floatQm 1.8s infinite ease-in-out 0s; color: #ff5d66; }
    .floating-qm-2 { animation: floatQm 1.8s infinite ease-in-out 0.3s; color: #18a75b; }
    .floating-qm-3 { animation: floatQm 1.8s infinite ease-in-out 0.6s; color: #8a4de1; }

    @keyframes floatQm {
      0%, 100% { transform: translateY(0) scale(1); opacity: 0.85; }
      50% { transform: translateY(-7px) scale(1.2); opacity: 1; text-shadow: 0 0 6px currentColor; }
    }

    .avatar-img-box {
      width: 78px;
      height: 78px;
      border-radius: 16px;
      border: 3px solid #087cf4;
      box-shadow: 0 4px 12px rgba(8, 124, 244, 0.3);
      overflow: hidden;
      background: #061c52;
    }

    .avatar-img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* 3D REALISTIC CSS DICE */
    .dice-stationary-btn {
      width: 96px;
      height: 96px;
      background: transparent;
      border: none;
      cursor: pointer;
      position: relative;
      perspective: 600px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;
    }

    .dice-cube {
      width: 76px;
      height: 76px;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 1s cubic-bezier(0.2, 0.85, 0.4, 1.2);
      transform: rotateX(-12deg) rotateY(16deg);
    }

    .dice-face {
      position: absolute;
      width: 76px;
      height: 76px;
      border-radius: 15px;
      background: linear-gradient(135deg, #32dfff 0%, #087cf4 40%, #0a439f 75%, #061c52 100%);
      border: 2.5px solid var(--gold);
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7), 0 0 8px rgba(255, 216, 91, 0.35);
      display: grid;
      padding: 8px;
      box-sizing: border-box;
      backface-visibility: hidden;
    }

    /* 6 PHYSICAL SIDES (38px translated) */
    .face-1 { transform: rotateY(0deg) translateZ(38px); grid-template: repeat(3, 1fr) / repeat(3, 1fr); }
    .face-2 { transform: rotateY(180deg) translateZ(38px); grid-template: repeat(3, 1fr) / repeat(3, 1fr); }
    .face-3 { transform: rotateY(90deg) translateZ(38px); grid-template: repeat(3, 1fr) / repeat(3, 1fr); }
    .face-4 { transform: rotateY(-90deg) translateZ(38px); grid-template: repeat(3, 1fr) / repeat(3, 1fr); }
    .face-5 { transform: rotateX(90deg) translateZ(38px); grid-template: repeat(3, 1fr) / repeat(3, 1fr); }
    .face-6 { transform: rotateX(-90deg) translateZ(38px); grid-template: repeat(3, 1fr) / repeat(3, 1fr); }

    .pip {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #fff6cc, var(--gold), #c98805);
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.6), 0 0 5px rgba(255, 216, 91, 0.8);
      align-self: center;
      justify-self: center;
    }

    /* PIPS POSITIONS FOR FACES */
    /* 1 */
    .face-1 .pip:nth-child(1) { grid-area: 2 / 2; }
    /* 2 */
    .face-2 .pip:nth-child(1) { grid-area: 1 / 3; }
    .face-2 .pip:nth-child(2) { grid-area: 3 / 1; }
    /* 3 */
    .face-3 .pip:nth-child(1) { grid-area: 1 / 3; }
    .face-3 .pip:nth-child(2) { grid-area: 2 / 2; }
    .face-3 .pip:nth-child(3) { grid-area: 3 / 1; }
    /* 4 */
    .face-4 .pip:nth-child(1) { grid-area: 1 / 1; }
    .face-4 .pip:nth-child(2) { grid-area: 1 / 3; }
    .face-4 .pip:nth-child(3) { grid-area: 3 / 1; }
    .face-4 .pip:nth-child(4) { grid-area: 3 / 3; }
    /* 5 */
    .face-5 .pip:nth-child(1) { grid-area: 1 / 1; }
    .face-5 .pip:nth-child(2) { grid-area: 1 / 3; }
    .face-5 .pip:nth-child(3) { grid-area: 2 / 2; }
    .face-5 .pip:nth-child(4) { grid-area: 3 / 1; }
    .face-5 .pip:nth-child(5) { grid-area: 3 / 3; }
    /* 6 */
    .face-6 .pip:nth-child(1) { grid-area: 1 / 1; }
    .face-6 .pip:nth-child(2) { grid-area: 2 / 1; }
    .face-6 .pip:nth-child(3) { grid-area: 3 / 1; }
    .face-6 .pip:nth-child(4) { grid-area: 1 / 3; }
    .face-6 .pip:nth-child(5) { grid-area: 2 / 3; }
    .face-6 .pip:nth-child(6) { grid-area: 3 / 3; }

    /* GLOWING MOVE BUTTON AFTER HUMAN ROLL */
    .btn-move-spaces {
      background: linear-gradient(135deg, #18a75b, #0c7237);
      border: 2px solid #55e697;
      color: #ffffff;
      font-size: 15px;
      font-weight: 800;
      padding: 10px 14px;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(24, 167, 91, 0.4), 0 0 10px rgba(85, 230, 151, 0.5);
      animation: pulseGreen 1.4s infinite alternate;
      transition: all 0.15s ease;
      text-align: center;
      min-height: 44px;
    }

    @keyframes pulseGreen {
      0% { transform: scale(1); box-shadow: 0 4px 14px rgba(24, 167, 91, 0.4), 0 0 6px rgba(85, 230, 151, 0.4); }
      100% { transform: scale(1.03); box-shadow: 0 6px 18px rgba(24, 167, 91, 0.6), 0 0 16px rgba(85, 230, 151, 0.8); }
    }

    /* PLAYER SCORE LIST */
    .player-status-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .player-row-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f0f4fa;
      border: 2px solid #d5e2f2;
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 700;
      color: #0a357c;
      transition: all 0.2s ease;
    }

    .player-row-item.active-player-row {
      border-color: #087cf4;
      background: #e6f1ff;
      box-shadow: 0 0 0 2px var(--gold), 0 3px 8px rgba(8, 124, 244, 0.25);
    }

    .player-row-info {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
    }

    .player-row-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }

    .player-trophy-badge {
      font-size: 13px;
      font-weight: 800;
      color: #8c5b00;
      background: #fffae8;
      border: 1px solid #ffd85b;
      padding: 2px 6px;
      border-radius: 6px;
      white-space: nowrap;
    }

    /* FOOTER SIGNATURE EXACT SPEC */
    .footer-signature {
      text-align: center;
      margin-top: 6px;
      padding: 6px 0;
    }

    .sig-name {
      font-size: 15px;
      font-weight: 800;
      color: var(--gold);
      text-shadow: 0 0 10px rgba(255, 216, 91, 0.6);
      letter-spacing: 0.5px;
    }

    .sig-title {
      font-size: 13px;
      font-weight: 600;
      color: #e5edf7;
      opacity: 0.9;
    }

    /* ========================================================= */
    /* MODALS & OVERLAYS */
    /* ========================================================= */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(3, 10, 28, 0.85);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .modal-card {
      background: var(--panel-cream);
      border-radius: 20px;
      padding: 24px;
      width: 100%;
      max-width: 480px;
      color: var(--text-dark);
      border: 3px solid #40e8ff;
      box-shadow: 0 0 0 4px #0876ed, 0 16px 40px rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: modalPop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes modalPop {
      0% { transform: scale(0.9); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #eef3f9;
      padding-bottom: 10px;
    }

    .modal-header h2 {
      font-size: 20px;
      font-weight: 800;
      color: #0a439f;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      font-size: 24px;
      font-weight: 900;
      color: #64748b;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      line-height: 1;
    }

    .modal-close-btn:hover {
      color: #0f172a;
      background: #f1f5f9;
    }

    .modal-question-text {
      font-size: 17px;
      font-weight: 700;
      color: #0a2e66;
      line-height: 1.4;
      background: #f0f7ff;
      padding: 14px;
      border-radius: 10px;
      border-left: 4px solid #087cf4;
    }

    .modal-input {
      width: 100%;
      padding: 12px 14px;
      border: 2px solid #b8d6fc;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      color: #0a2550;
      outline: none;
    }

    .modal-input:focus {
      border-color: #087cf4;
      box-shadow: 0 0 0 3px rgba(8, 124, 244, 0.25);
    }

    .modal-feedback {
      font-size: 14px;
      font-weight: 700;
      min-height: 20px;
    }

    .modal-feedback.correct { color: #107c41; }
    .modal-feedback.wrong { color: #c62828; }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    /* FULLSCREEN VICTORY OVERLAY */
    .victory-overlay {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at center, #0a439f 0%, #061c52 60%, #030a1c 100%);
      z-index: 200;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      text-align: center;
    }

    .victory-card {
      background: rgba(255, 255, 255, 0.96);
      border-radius: 28px;
      padding: 36px 28px;
      max-width: 520px;
      width: 100%;
      color: var(--text-dark);
      border: 4px solid var(--gold);
      box-shadow: 0 0 50px rgba(255, 216, 91, 0.6), 0 20px 60px rgba(0,0,0,0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      position: relative;
      z-index: 10;
      animation: victoryCardEntry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes victoryCardEntry {
      0% { transform: scale(0.6) translateY(40px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }

    .trophy-icon-large {
      font-size: clamp(60px, 12vw, 88px);
      filter: drop-shadow(0 6px 12px rgba(212, 155, 20, 0.45));
      animation: trophyBounce 1.2s infinite alternate ease-in-out;
    }

    @keyframes trophyBounce {
      0% { transform: translateY(0) rotate(-4deg); }
      100% { transform: translateY(-10px) rotate(4deg); }
    }

    .victory-title {
      font-size: clamp(32px, 6vw, 44px);
      font-weight: 900;
      color: #0a439f;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .victory-winner-name {
      font-size: clamp(22px, 4.5vw, 28px);
      font-weight: 800;
      color: #107c41;
    }

    .victory-reason {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .btn-play-again {
      background: linear-gradient(135deg, #ffd85b, #e59d00);
      border: 3px solid #ffffff;
      color: #452400;
      font-size: 18px;
      font-weight: 900;
      padding: 14px 32px;
      border-radius: 16px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(229, 157, 0, 0.5);
      transition: all 0.2s ease;
      min-height: 50px;
    }

    .btn-play-again:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 8px 26px rgba(229, 157, 0, 0.7);
    }

    /* MULTICOLORED CONFETTI PARTICLES */
    .confetti-container {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 5;
    }

    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 14px;
      top: -20px;
      opacity: 0.9;
      animation: confettiFall linear infinite;
    }

    @keyframes confettiFall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
    }

    /* SNAKE CRYING OVERLAY */
    .snake-cry-banner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: clamp(50px, 10vw, 80px);
      z-index: 50;
      pointer-events: none;
      animation: cryPop 1.2s ease-out forwards;
      filter: drop-shadow(0 6px 12px rgba(0,0,0,0.6));
    }

    @keyframes cryPop {
      0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
      40% { transform: translate(-50%, -50%) scale(1.25); opacity: 1; }
      80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      100% { transform: translate(-50%, -60%) scale(0.8); opacity: 0; }
    }

    /* TOAST NOTIFICATION */
    .toast-msg {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(6, 28, 82, 0.95);
      border: 2px solid var(--cyan-bright);
      color: #ffffff;
      font-size: 15px;
      font-weight: 700;
      padding: 12px 24px;
      border-radius: 30px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.5);
      z-index: 150;
      animation: toastFade 2.5s forwards;
      pointer-events: none;
      max-width: 90vw;
      text-align: center;
    }

    @keyframes toastFade {
      0% { opacity: 0; transform: translate(-50%, 20px); }
      15% { opacity: 1; transform: translate(-50%, 0); }
      80% { opacity: 1; transform: translate(-50%, 0); }
      100% { opacity: 0; transform: translate(-50%, -15px); }
    }

    /* RESPONSIVE MEDIA QUERIES */
    @media (max-width: 850px) {
      .game-main-stage {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .control-column {
        position: static;
        width: 100%;
        max-width: 540px;
        margin: 0 auto;
      }
    }

    @media (max-width: 480px) {
      #app {
        padding: 8px 10px 24px 10px;
      }
      .title-img {
        width: min(64vw, 250px);
        height: 46px;
      }
      .sound-toggle-btn {
        padding: 6px 12px;
        font-size: 13px;
      }
      .settings-panel {
        padding: 16px 12px;
      }
      .mode-cards {
        grid-template-columns: 1fr;
      }
      .bulk-textareas {
        grid-template-columns: 1fr;
      }
      .board-outer-halo {
        padding: 6px;
        border-radius: 18px;
      }
    }

    /* PREFERS REDUCED MOTION */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <div id="app">
    <!-- ACCESSIBLE LIVE REGION -->
    <div id="aria-announcer" class="sr-only" aria-live="assertive" aria-atomic="true"></div>

    <!-- HEADER -->
    <header role="banner">
      <div class="title-img-container">
        <img
          id="exact-title-img"
          class="title-img"
          src="${images.title}"
          alt="Snakes and Ladder"
        />
      </div>
      <button
        id="sound-toggle-btn"
        class="sound-toggle-btn"
        type="button"
        aria-pressed="true"
        aria-label="Toggle game sound"
      >
        🔊 Sound on
      </button>
    </header>

    <!-- MAIN VIEW CONTAINER -->
    <main style="width: 100%; display: flex; flex-direction: column; align-items: center;">

      <!-- ========================================================= -->
      <!-- VIEW 1: SETTINGS SCREEN -->
      <!-- ========================================================= -->
      <section id="settings-view" class="view-section" aria-labelledby="settings-heading">
        <div class="settings-panel">
          <div class="settings-header">
            <h1 id="settings-heading">Set up your game</h1>
            <p>Choose how to play, save the player names, and add your learning questions.</p>
          </div>

          <!-- PLAY MODE -->
          <div class="setting-group">
            <span class="setting-label">Choose play mode:</span>
            <div class="mode-cards" role="group" aria-label="Game Play Modes">
              <button
                type="button"
                id="mode-card-cpu"
                class="mode-card"
                aria-pressed="true"
              >
                <span>🤖 Versus computer</span>
                <span style="font-size: 12px; font-weight: 500; opacity: 0.85;">1 Human vs 1 CPU</span>
              </button>
              <button
                type="button"
                id="mode-card-local"
                class="mode-card"
                aria-pressed="false"
              >
                <span>👥 Various players</span>
                <span style="font-size: 12px; font-weight: 500; opacity: 0.85;">2 to 5 local players</span>
              </button>
            </div>

            <!-- LOCAL PLAYER COUNT SELECTOR -->
            <div id="local-count-container" class="hidden">
              <span class="setting-label" style="font-size: 14px;">Select number of players:</span>
              <div class="count-selector" role="group" aria-label="Number of players">
                <button type="button" class="count-btn" data-count="2" aria-pressed="true">2</button>
                <button type="button" class="count-btn" data-count="3" aria-pressed="false">3</button>
                <button type="button" class="count-btn" data-count="4" aria-pressed="false">4</button>
                <button type="button" class="count-btn" data-count="5" aria-pressed="false">5</button>
              </div>
            </div>
          </div>

          <!-- PLAYER NAMES -->
          <div class="setting-group">
            <span class="setting-label">Player names (optional, up to 22 characters):</span>
            <div id="player-inputs-grid" class="player-inputs-grid">
              <!-- Dynamically populated -->
            </div>
            <div class="save-names-bar">
              <button type="button" id="save-names-btn" class="btn-green">
                Save player names
              </button>
              <span id="save-names-indicator" class="save-status-indicator"></span>
            </div>
          </div>

          <!-- QUESTION EDITOR -->
          <details class="question-details">
            <summary>Add or edit my questions</summary>
            <div class="q-editor-body">
              <p style="font-size: 13px; color: var(--text-muted);">
                You can add questions and exact answers for squares 1 to 20. When players land on or click a square, they can earn trophies!
              </p>

              <!-- BULK IMPORT -->
              <div class="bulk-textareas">
                <div class="bulk-col">
                  <label for="bulk-questions-input">Questions, one per line (1–20):</label>
                  <textarea id="bulk-questions-input" placeholder="e.g. What is 5 + 7?&#10;Capital of France?"></textarea>
                </div>
                <div class="bulk-col">
                  <label for="bulk-answers-input">Answers, one per line (1–20):</label>
                  <textarea id="bulk-answers-input" placeholder="e.g. 12&#10;Paris"></textarea>
                </div>
              </div>
              <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <button type="button" id="bulk-save-btn" class="btn-secondary">
                  Save bulk questions
                </button>
                <button type="button" id="bulk-clear-btn" class="btn-danger">
                  Clear all questions
                </button>
                <span id="bulk-feedback-msg" class="msg-feedback"></span>
              </div>

              <!-- SINGLE SQUARE EDITOR -->
              <div class="single-square-editor">
                <span class="setting-label" style="font-size: 14px; margin-bottom: 0;">Single-square editor:</span>
                <div class="single-editor-row">
                  <label for="single-sq-select" class="sr-only">Select Square</label>
                  <select id="single-sq-select">
                    <!-- 1 to 20 -->
                  </select>
                  <input type="text" id="single-q-input" placeholder="Enter question..." />
                  <input type="text" id="single-a-input" placeholder="Enter exact answer..." />
                </div>
                <div class="single-btn-group">
                  <button type="button" id="single-save-btn" class="btn-secondary">Save this square</button>
                  <button type="button" id="single-clear-btn" class="btn-danger">Clear this square</button>
                  <span id="single-feedback-msg" class="msg-feedback"></span>
                </div>
              </div>
            </div>
          </details>

          <!-- START GAME BUTTON -->
          <button type="button" id="start-game-btn" class="btn-start-game">
            Start the game ▶
          </button>
        </div>
      </section>

      <!-- ========================================================= -->
      <!-- VIEW 2: GAME BOARD & PLAY SCREEN -->
      <!-- ========================================================= -->
      <section id="game-view" class="view-section hidden" aria-label="Game board and controls">
        <div class="game-container">
          
          <!-- TOP ACTIONS BAR -->
          <div class="game-actions-bar">
            <button type="button" id="back-to-settings-btn" class="btn-action-nav">
              ← Back to settings
            </button>
            <button type="button" id="restart-game-btn" class="btn-action-nav">
              ↻ Restart game
            </button>
          </div>

          <!-- MAIN STAGE (BOARD + CONTROLS) -->
          <div class="game-main-stage">
            
            <!-- LEFT: BOARD COLUMN -->
            <div class="board-column">
              <div class="board-outer-halo">
                <div id="board-frame" class="board-frame" role="region" aria-label="Snakes and Ladder Game Board">
                  
                  <!-- MANDATORY BOARD PICTURE (BASE64) -->
                  <img
                    id="board-bg-img"
                    class="board-bg-img"
                    src="${images.board}"
                    alt="Snakes and Ladder Board Artwork"
                  />

                  <!-- 20 HIT SQUARES (5 COLS x 4 ROWS SERPENTINE) -->
                  <div id="board-squares-grid" class="board-squares-grid">
                    <!-- Square 20..16, 11..15, 10..6, 1..5 -->
                  </div>

                  <!-- TOKEN OVERLAY LAYER -->
                  <div id="tokens-overlay-container" class="tokens-overlay-container">
                    <!-- Player tokens rendered here -->
                  </div>

                </div>
              </div>

              <!-- STARTING DOCK -->
              <div id="starting-dock" class="starting-dock-container" role="region" aria-label="Starting Dock for tokens">
                <span class="dock-title-badge">STARTING DOCK</span>
                <div id="dock-slots-area" class="dock-slots-area">
                  <!-- Starting tokens positioned here -->
                </div>
              </div>
            </div>

            <!-- RIGHT: CONTROL COLUMN -->
            <aside class="control-column" aria-label="Game Controls and Scoreboard">
              <div class="control-panel">
                
                <!-- TURN & STATUS -->
                <div class="turn-status-header">
                  <div class="turn-label">CURRENT TURN</div>
                  <div id="current-player-name" class="current-player-name">Player 1</div>
                  <div id="turn-status-message" class="turn-status-message" aria-live="polite">
                    Click the dice to roll.
                  </div>
                </div>

                <!-- AVATAR & DICE ROW -->
                <div class="avatar-dice-row">
                  
                  <!-- AVATAR WITH 3 ANIMATED QUESTION MARKS -->
                  <div class="avatar-box-wrapper">
                    <div class="avatar-floating-qmarks" aria-hidden="true">
                      <span class="floating-qm-1">?</span>
                      <span class="floating-qm-2">?</span>
                      <span class="floating-qm-3">?</span>
                    </div>
                    <div class="avatar-img-box">
                      <img
                        src="${images.avatar}"
                        alt="Game Mascot Snake Avatar"
                      />
                    </div>
                  </div>

                  <!-- 3D CSS DICE IN STATIONARY BUTTON -->
                  <button
                    type="button"
                    id="dice-btn"
                    class="dice-stationary-btn"
                    aria-label="Roll Dice"
                  >
                    <div id="dice-cube" class="dice-cube">
                      <div class="dice-face face-1"><div class="pip"></div></div>
                      <div class="dice-face face-2"><div class="pip"></div><div class="pip"></div></div>
                      <div class="dice-face face-3"><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>
                      <div class="dice-face face-4"><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>
                      <div class="dice-face face-5"><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>
                      <div class="dice-face face-6"><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>
                    </div>
                  </button>

                </div>

                <!-- MOVE SPACES BUTTON (SHOWN AFTER HUMAN ROLL) -->
                <button type="button" id="move-spaces-btn" class="btn-move-spaces hidden">
                  Move Space
                </button>

                <!-- PLAYER LIST & TROPHY SCORES -->
                <div id="player-status-list" class="player-status-list" role="region" aria-label="Players List and Trophy Scores">
                  <!-- Dynamically rendered -->
                </div>

              </div>

              <!-- FOOTER SIGNATURE EXACT FORMAT -->
              <footer class="footer-signature">
                <div class="sig-name">Dr.Abir Wafa</div>
                <div class="sig-title">Head of EdTech at Edulixa</div>
              </footer>
            </aside>

          </div>

        </div>
      </section>

    </main>

    <!-- ========================================================= -->
    <!-- MODAL: SQUARE QUESTION MODAL -->
    <!-- ========================================================= -->
    <div id="question-modal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="modal-sq-title">
      <div class="modal-card">
        <div class="modal-header">
          <h2 id="modal-sq-title">Square 1 question</h2>
          <button type="button" id="modal-close-btn" class="modal-close-btn" aria-label="Close question modal">×</button>
        </div>
        <div id="modal-question-text" class="modal-question-text">
          Question content...
        </div>
        <label for="modal-answer-input" class="sr-only">Your answer</label>
        <input
          type="text"
          id="modal-answer-input"
          class="modal-input"
          placeholder="Type your answer here..."
          autocomplete="off"
        />
        <div id="modal-feedback-msg" class="modal-feedback"></div>
        <div class="modal-actions">
          <button type="button" id="modal-cancel-btn" class="btn-secondary">Close</button>
          <button type="button" id="modal-submit-btn" class="btn-green">Check my answer</button>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- FULLSCREEN VICTORY OVERLAY -->
    <!-- ========================================================= -->
    <div id="victory-modal" class="victory-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="victory-heading">
      <div class="confetti-container" id="confetti-container"></div>
      <div class="victory-card">
        <div class="trophy-icon-large">🏆</div>
        <h2 id="victory-heading" class="victory-title">Victory!</h2>
        <div id="victory-winner-name" class="victory-winner-name">Player 1</div>
        <p id="victory-reason-text" class="victory-reason">reached square 20!</p>
        <button type="button" id="victory-play-again-btn" class="btn-play-again">
          Play again ↻
        </button>
      </div>
    </div>

  </div>

  <!-- JAVASCRIPT GAME LOGIC -->
  <script>
    (function () {
      'use strict';

      /* ========================================================= */
      /* CONSTANTS & SERPENTINE BOARD SPEC */
      /* ========================================================= */
      // 5 cols x 4 rows
      // Top row (0): 20, 19, 18, 17, 16
      // Row 1:       11, 12, 13, 14, 15
      // Row 2:       10, 9, 8, 7, 6
      // Bottom row 3: 1, 2, 3, 4, 5
      const BOARD_GRID_SQUARES = [
        [20, 19, 18, 17, 16],
        [11, 12, 13, 14, 15],
        [10, 9, 8, 7, 6],
        [1, 2, 3, 4, 5]
      ];

      const LADDERS = {
        2: 9,
        7: 14,
        12: 19
      };

      const SNAKES = {
        11: 10,
        13: 8,
        15: 6
      };

      const PLAYER_COLORS = [
        '#ff5d66', // Coral (P1)
        '#1878ee', // Blue (P2)
        '#18a75b', // Green (P3)
        '#8a4de1', // Purple (P4)
        '#ef8b20'  // Orange (P5)
      ];

      const COLUMN_COLORS = ['col-0', 'col-1', 'col-2', 'col-3', 'col-4'];

      /* ========================================================= */
      /* SOUND SYNTHESIZER (WEB AUDIO API) */
      /* ========================================================= */
      let audioCtx = null;
      function getAudioContext() {
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
          }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        return audioCtx;
      }

      function playTone(freq, type, duration, startTime = 0, gainLevel = 0.15) {
        if (!gameState.soundEnabled) return;
        try {
          const ctx = getAudioContext();
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
          gain.gain.setValueAtTime(gainLevel, ctx.currentTime + startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + startTime);
          osc.stop(ctx.currentTime + startTime + duration);
        } catch (e) {
          // Audio error fail-safe
        }
      }

      const Sounds = {
        save: () => {
          playTone(523.25, 'sine', 0.1, 0, 0.15);
          playTone(659.25, 'sine', 0.15, 0.08, 0.15);
        },
        roll: () => {
          for (let i = 0; i < 6; i++) {
            playTone(180 + Math.random() * 220, 'triangle', 0.05, i * 0.06, 0.12);
          }
        },
        step: () => {
          playTone(440, 'sine', 0.1, 0, 0.18);
        },
        blocked: () => {
          playTone(220, 'sawtooth', 0.2, 0, 0.15);
          playTone(180, 'sawtooth', 0.25, 0.1, 0.15);
        },
        ladder: () => {
          const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
          notes.forEach((freq, idx) => {
            playTone(freq, 'triangle', 0.15, idx * 0.09, 0.2);
          });
        },
        snake: () => {
          if (!gameState.soundEnabled) return;
          try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(450, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.55);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.55);
          } catch (e) {}
        },
        wrongAnswer: () => {
          playTone(280, 'sawtooth', 0.18, 0, 0.15);
          playTone(220, 'sawtooth', 0.25, 0.15, 0.15);
        },
        correctAnswer: () => {
          playTone(587.33, 'sine', 0.12, 0, 0.2);
          playTone(880.00, 'sine', 0.22, 0.1, 0.2);
        },
        trophy: () => {
          const notes = [523.25, 659.25, 783.99, 1046.50];
          notes.forEach((f, i) => playTone(f, 'sine', 0.18, i * 0.07, 0.2));
        },
        victory: () => {
          const notes = [392, 523.25, 659.25, 783.99, 1046.5];
          notes.forEach((f, i) => playTone(f, 'triangle', 0.35, i * 0.15, 0.25));
        }
      };

      /* ========================================================= */
      /* GLOBAL STATE */
      /* ========================================================= */
      const gameState = {
        mode: 'cpu', // 'cpu' or 'local'
        playerCount: 2,
        players: [],
        activePlayerIndex: 0,
        rolledValue: 0,
        isBusy: false,
        soundEnabled: true,
        questions: Array.from({ length: 20 }, () => ({ q: '', a: '' })),
        activeModalSquare: null,
        isGameOver: false,
        diceAngleX: -12,
        diceAngleY: 16
      };

      /* ========================================================= */
      /* DOM ELEMENTS */
      /* ========================================================= */
      const el = {
        announcer: document.getElementById('aria-announcer'),
        soundToggleBtn: document.getElementById('sound-toggle-btn'),
        settingsView: document.getElementById('settings-view'),
        gameView: document.getElementById('game-view'),
        modeCardCpu: document.getElementById('mode-card-cpu'),
        modeCardLocal: document.getElementById('mode-card-local'),
        localCountContainer: document.getElementById('local-count-container'),
        playerInputsGrid: document.getElementById('player-inputs-grid'),
        saveNamesBtn: document.getElementById('save-names-btn'),
        saveNamesIndicator: document.getElementById('save-names-indicator'),
        startGameBtn: document.getElementById('start-game-btn'),
        bulkQuestionsInput: document.getElementById('bulk-questions-input'),
        bulkAnswersInput: document.getElementById('bulk-answers-input'),
        bulkSaveBtn: document.getElementById('bulk-save-btn'),
        bulkClearBtn: document.getElementById('bulk-clear-btn'),
        bulkFeedbackMsg: document.getElementById('bulk-feedback-msg'),
        singleSqSelect: document.getElementById('single-sq-select'),
        singleQInput: document.getElementById('single-q-input'),
        singleAInput: document.getElementById('single-a-input'),
        singleSaveBtn: document.getElementById('single-save-btn'),
        singleClearBtn: document.getElementById('single-clear-btn'),
        singleFeedbackMsg: document.getElementById('single-feedback-msg'),
        backToSettingsBtn: document.getElementById('back-to-settings-btn'),
        restartGameBtn: document.getElementById('restart-game-btn'),
        boardFrame: document.getElementById('board-frame'),
        boardSquaresGrid: document.getElementById('board-squares-grid'),
        tokensOverlay: document.getElementById('tokens-overlay-container'),
        startingDock: document.getElementById('starting-dock'),
        dockSlotsArea: document.getElementById('dock-slots-area'),
        currentPlayerName: document.getElementById('current-player-name'),
        turnStatusMessage: document.getElementById('turn-status-message'),
        diceBtn: document.getElementById('dice-btn'),
        diceCube: document.getElementById('dice-cube'),
        moveSpacesBtn: document.getElementById('move-spaces-btn'),
        playerStatusList: document.getElementById('player-status-list'),
        questionModal: document.getElementById('question-modal'),
        modalSqTitle: document.getElementById('modal-sq-title'),
        modalQuestionText: document.getElementById('modal-question-text'),
        modalAnswerInput: document.getElementById('modal-answer-input'),
        modalFeedbackMsg: document.getElementById('modal-feedback-msg'),
        modalCloseBtn: document.getElementById('modal-close-btn'),
        modalCancelBtn: document.getElementById('modal-cancel-btn'),
        modalSubmitBtn: document.getElementById('modal-submit-btn'),
        victoryModal: document.getElementById('victory-modal'),
        victoryWinnerName: document.getElementById('victory-winner-name'),
        victoryReasonText: document.getElementById('victory-reason-text'),
        victoryPlayAgainBtn: document.getElementById('victory-play-again-btn'),
        confettiContainer: document.getElementById('confetti-container')
      };

      /* ========================================================= */
      /* HELPER UTILITIES */
      /* ========================================================= */
      function announce(text) {
        if (el.announcer) {
          el.announcer.textContent = '';
          setTimeout(() => {
            el.announcer.textContent = text;
          }, 40);
        }
      }

      function escapeHTML(str) {
        if (!str) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }

      function normalizeAnswer(str) {
        if (!str) return '';
        return str.trim().replace(/\\s+/g, ' ').toLowerCase();
      }

      function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-msg';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 2600);
      }

      /* ========================================================= */
      /* LOCALSTORAGE PERSISTENCE */
      /* ========================================================= */
      function loadSavedData() {
        try {
          const rawNames = localStorage.getItem('snakeTrailNames');
          if (rawNames) {
            const parsed = JSON.parse(rawNames);
            if (Array.isArray(parsed)) {
              window.savedPlayerNames = parsed;
            }
          }
        } catch (e) {
          window.savedPlayerNames = [];
        }

        try {
          const rawQuestions = localStorage.getItem('snakeTrailQuestions');
          if (rawQuestions) {
            const parsed = JSON.parse(rawQuestions);
            if (Array.isArray(parsed)) {
              for (let i = 0; i < 20; i++) {
                if (parsed[i] && typeof parsed[i] === 'object') {
                  gameState.questions[i] = {
                    q: parsed[i].q || '',
                    a: parsed[i].a || ''
                  };
                }
              }
            }
          }
        } catch (e) {}
      }

      function saveQuestionsToStorage() {
        try {
          localStorage.setItem('snakeTrailQuestions', JSON.stringify(gameState.questions));
        } catch (e) {}
      }

      /* ========================================================= */
      /* INITIAL SETUP & SETTINGS VIEW LOGIC */
      /* ========================================================= */
      function initSettingsUI() {
        // Populate single square dropdown 1..20
        el.singleSqSelect.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = 'Square ' + i;
          el.singleSqSelect.appendChild(opt);
        }

        // Sync single square input fields on change
        el.singleSqSelect.addEventListener('change', () => {
          const sq = parseInt(el.singleSqSelect.value, 10);
          const rec = gameState.questions[sq - 1] || { q: '', a: '' };
          el.singleQInput.value = rec.q || '';
          el.singleAInput.value = rec.a || '';
          el.singleFeedbackMsg.className = 'msg-feedback';
          el.singleFeedbackMsg.textContent = '';
        });

        // Initialize with square 1
        const rec1 = gameState.questions[0] || { q: '', a: '' };
        el.singleQInput.value = rec1.q || '';
        el.singleAInput.value = rec1.a || '';

        // Mode cards
        el.modeCardCpu.addEventListener('click', () => {
          setPlayMode('cpu');
        });
        el.modeCardLocal.addEventListener('click', () => {
          setPlayMode('local');
        });

        // Count buttons
        document.querySelectorAll('.count-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const count = parseInt(btn.dataset.count, 10);
            setPlayerCount(count);
          });
        });

        renderPlayerInputs();

        // Populate bulk textarea with existing questions if any
        syncBulkTextareasFromState();
      }

      function setPlayMode(mode) {
        gameState.mode = mode;
        if (mode === 'cpu') {
          el.modeCardCpu.setAttribute('aria-pressed', 'true');
          el.modeCardLocal.setAttribute('aria-pressed', 'false');
          el.localCountContainer.classList.add('hidden');
          gameState.playerCount = 2;
        } else {
          el.modeCardCpu.setAttribute('aria-pressed', 'false');
          el.modeCardLocal.setAttribute('aria-pressed', 'true');
          el.localCountContainer.classList.remove('hidden');
        }
        renderPlayerInputs();
      }

      function setPlayerCount(count) {
        gameState.playerCount = count;
        document.querySelectorAll('.count-btn').forEach(b => {
          const active = parseInt(b.dataset.count, 10) === count;
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        renderPlayerInputs();
      }

      function renderPlayerInputs() {
        el.playerInputsGrid.innerHTML = '';
        const saved = window.savedPlayerNames || [];
        const count = gameState.mode === 'cpu' ? 2 : gameState.playerCount;

        for (let i = 0; i < count; i++) {
          const row = document.createElement('div');
          row.className = 'player-input-row';

          const dot = document.createElement('span');
          dot.className = 'token-dot';
          dot.style.background = PLAYER_COLORS[i];

          const input = document.createElement('input');
          input.type = 'text';
          input.maxLength = 22;
          input.id = 'pname-input-' + i;

          if (gameState.mode === 'cpu' && i === 1) {
            input.value = 'CPU';
            input.disabled = true;
            input.setAttribute('aria-label', 'CPU Player');
          } else {
            const defaultPlaceholder = 'P' + (i + 1);
            input.placeholder = defaultPlaceholder;
            input.value = saved[i] || '';
            input.setAttribute('aria-label', 'Player ' + (i + 1) + ' name');
            input.addEventListener('input', () => {
              el.saveNamesIndicator.textContent = 'Unsaved changes';
              el.saveNamesIndicator.className = 'save-status-indicator unsaved';
            });
          }

          row.appendChild(dot);
          row.appendChild(input);
          el.playerInputsGrid.appendChild(row);
        }

        if (saved && saved.length > 0) {
          el.saveNamesIndicator.textContent = '✓ ' + saved.length + ' names saved';
          el.saveNamesIndicator.className = 'save-status-indicator';
        } else {
          el.saveNamesIndicator.textContent = '';
        }
      }

      function savePlayerNames() {
        const count = gameState.mode === 'cpu' ? 2 : gameState.playerCount;
        const names = [];
        for (let i = 0; i < count; i++) {
          const inp = document.getElementById('pname-input-' + i);
          if (inp) {
            const val = inp.value.trim().slice(0, 22);
            names.push(val);
          }
        }
        window.savedPlayerNames = names;
        try {
          localStorage.setItem('snakeTrailNames', JSON.stringify(names));
        } catch (e) {}
        el.saveNamesIndicator.textContent = '✓ ' + names.length + ' names saved';
        el.saveNamesIndicator.className = 'save-status-indicator';
        Sounds.save();
        announce('Player names saved successfully');
      }

      el.saveNamesBtn.addEventListener('click', savePlayerNames);

      /* ========================================================= */
      /* QUESTION EDITING LOGIC */
      /* ========================================================= */
      function syncBulkTextareasFromState() {
        const qLines = [];
        const aLines = [];
        let hasAny = false;
        gameState.questions.forEach(rec => {
          if (rec.q || rec.a) hasAny = true;
          qLines.push(rec.q || '');
          aLines.push(rec.a || '');
        });
        if (hasAny) {
          el.bulkQuestionsInput.value = qLines.join('\\n').trim();
          el.bulkAnswersInput.value = aLines.join('\\n').trim();
        }
      }

      el.bulkSaveBtn.addEventListener('click', () => {
        const qRaw = el.bulkQuestionsInput.value.split('\\n').map(s => s.trim()).filter(Boolean);
        const aRaw = el.bulkAnswersInput.value.split('\\n').map(s => s.trim()).filter(Boolean);

        if (qRaw.length === 0 || aRaw.length === 0) {
          showBulkFeedback('Please enter at least one question and answer.', 'error');
          return;
        }

        if (qRaw.length !== aRaw.length) {
          showBulkFeedback('Line counts do not match (' + qRaw.length + ' questions vs ' + aRaw.length + ' answers).', 'error');
          return;
        }

        const count = Math.min(20, qRaw.length);
        for (let i = 0; i < 20; i++) {
          if (i < count) {
            gameState.questions[i] = { q: qRaw[i], a: aRaw[i] };
          } else {
            gameState.questions[i] = { q: '', a: '' };
          }
        }
        saveQuestionsToStorage();
        showBulkFeedback('✓ Saved ' + count + ' question' + (count > 1 ? 's' : '') + ' successfully!', 'success');
        Sounds.save();
        // Update single editor view
        const currentSq = parseInt(el.singleSqSelect.value, 10);
        el.singleQInput.value = gameState.questions[currentSq - 1].q || '';
        el.singleAInput.value = gameState.questions[currentSq - 1].a || '';
      });

      el.bulkClearBtn.addEventListener('click', () => {
        gameState.questions = Array.from({ length: 20 }, () => ({ q: '', a: '' }));
        el.bulkQuestionsInput.value = '';
        el.bulkAnswersInput.value = '';
        el.singleQInput.value = '';
        el.singleAInput.value = '';
        saveQuestionsToStorage();
        showBulkFeedback('All questions cleared.', 'success');
      });

      function showBulkFeedback(msg, type) {
        el.bulkFeedbackMsg.textContent = msg;
        el.bulkFeedbackMsg.className = 'msg-feedback ' + type;
        announce(msg);
      }

      el.singleSaveBtn.addEventListener('click', () => {
        const sq = parseInt(el.singleSqSelect.value, 10);
        const q = el.singleQInput.value.trim();
        const a = el.singleAInput.value.trim();
        if (!q || !a) {
          showSingleFeedback('Both question and answer are required.', 'error');
          return;
        }
        gameState.questions[sq - 1] = { q, a };
        saveQuestionsToStorage();
        syncBulkTextareasFromState();
        showSingleFeedback('✓ Square ' + sq + ' saved!', 'success');
        Sounds.save();
      });

      el.singleClearBtn.addEventListener('click', () => {
        const sq = parseInt(el.singleSqSelect.value, 10);
        gameState.questions[sq - 1] = { q: '', a: '' };
        el.singleQInput.value = '';
        el.singleAInput.value = '';
        saveQuestionsToStorage();
        syncBulkTextareasFromState();
        showSingleFeedback('Square ' + sq + ' cleared.', 'success');
      });

      function showSingleFeedback(msg, type) {
        el.singleFeedbackMsg.textContent = msg;
        el.singleFeedbackMsg.className = 'msg-feedback ' + type;
        announce(msg);
      }

      /* ========================================================= */
      /* BUILD 5x4 BOARD GRID & BUTTONS */
      /* ========================================================= */
      function renderBoardGrid() {
        el.boardSquaresGrid.innerHTML = '';
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 5; col++) {
            const sqNumber = BOARD_GRID_SQUARES[row][col];
            const cell = document.createElement('div');
            cell.className = 'board-square-cell';
            cell.id = 'square-cell-' + sqNumber;
            cell.dataset.sq = sqNumber;

            // Real Question Button
            const qBtn = document.createElement('button');
            qBtn.type = 'button';
            qBtn.className = 'square-q-btn ' + COLUMN_COLORS[col];
            qBtn.dataset.sq = sqNumber;
            qBtn.setAttribute('aria-label', 'Open question for square ' + sqNumber);
            qBtn.textContent = '?';

            // If question is configured, make icon green with glow
            const rec = gameState.questions[sqNumber - 1];
            if (rec && rec.q && rec.a) {
              qBtn.classList.add('has-question');
            }

            qBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              handleQuestionClick(sqNumber);
            });

            cell.appendChild(qBtn);
            el.boardSquaresGrid.appendChild(cell);
          }
        }
      }

      /* ========================================================= */
      /* START / RESTART / BACK LOGIC */
      /* ========================================================= */
      function startNewGame() {
        const count = gameState.mode === 'cpu' ? 2 : gameState.playerCount;
        const saved = window.savedPlayerNames || [];
        gameState.players = [];

        for (let i = 0; i < count; i++) {
          let name = '';
          if (gameState.mode === 'cpu' && i === 1) {
            name = 'CPU';
          } else {
            const inp = document.getElementById('pname-input-' + i);
            name = (inp && inp.value.trim().slice(0, 22)) || saved[i] || ('P' + (i + 1));
          }

          gameState.players.push({
            id: i + 1,
            name: name,
            isCpu: (gameState.mode === 'cpu' && i === 1),
            position: 0, // Starts in dock
            trophies: 0,
            earnedSquares: new Set(),
            color: PLAYER_COLORS[i]
          });
        }

        gameState.activePlayerIndex = 0;
        gameState.isBusy = false;
        gameState.isGameOver = false;
        gameState.rolledValue = 0;

        el.settingsView.classList.add('hidden');
        el.gameView.classList.remove('hidden');
        el.victoryModal.classList.add('hidden');
        el.moveSpacesBtn.classList.add('hidden');

        renderBoardGrid();
        renderPlayerList();
        createPlayerTokens();
        updateTurnDisplay();
        repositionAllTokens();

        Sounds.save();
        announce('Game started! ' + gameState.players[0].name + ' turn.');
      }

      function restartGame() {
        if (gameState.isBusy) return;
        gameState.players.forEach(p => {
          p.position = 0;
          p.trophies = 0;
          p.earnedSquares.clear();
        });
        gameState.activePlayerIndex = 0;
        gameState.isBusy = false;
        gameState.isGameOver = false;
        gameState.rolledValue = 0;

        el.victoryModal.classList.add('hidden');
        el.moveSpacesBtn.classList.add('hidden');
        renderPlayerList();
        updateTurnDisplay();
        repositionAllTokens();
        announce('Game restarted. All tokens at starting dock.');
      }

      function backToSettings() {
        if (gameState.isBusy) return;
        el.gameView.classList.add('hidden');
        el.settingsView.classList.remove('hidden');
        el.victoryModal.classList.add('hidden');
        renderPlayerInputs();
      }

      el.startGameBtn.addEventListener('click', startNewGame);
      el.restartGameBtn.addEventListener('click', restartGame);
      el.backToSettingsBtn.addEventListener('click', backToSettings);
      el.victoryPlayAgainBtn.addEventListener('click', () => {
        el.victoryModal.classList.add('hidden');
        restartGame();
      });

      /* ========================================================= */
      /* PLAYER TOKENS & CLUSTERING GEOMETRY */
      /* ========================================================= */
      function createPlayerTokens() {
        el.tokensOverlay.innerHTML = '';
        gameState.players.forEach((p, idx) => {
          const token = document.createElement('div');
          token.className = 'player-token token-p' + (idx + 1);
          token.id = 'player-token-' + p.id;
          token.textContent = p.id;
          token.setAttribute('aria-label', p.name + ' token');
          el.tokensOverlay.appendChild(token);
        });
      }

      function repositionAllTokens() {
        const boardRect = el.boardFrame.getBoundingClientRect();
        const dockRect = el.dockSlotsArea.getBoundingClientRect();

        // Group players by current position
        const positionGroups = {};
        gameState.players.forEach(p => {
          if (!positionGroups[p.position]) positionGroups[p.position] = [];
          positionGroups[p.position].push(p);
        });

        // Compute relative token coordinates inside el.boardFrame
        Object.keys(positionGroups).forEach(posStr => {
          const pos = parseInt(posStr, 10);
          const playersHere = positionGroups[pos];
          let centerLeft = 0;
          let centerTop = 0;

          if (pos === 0) {
            // In starting dock
            centerLeft = (dockRect.left + dockRect.width / 2) - boardRect.left;
            centerTop = (dockRect.top + dockRect.height / 2) - boardRect.top;
          } else {
            // On a board square
            const sqCell = document.getElementById('square-cell-' + pos);
            if (sqCell) {
              const sqRect = sqCell.getBoundingClientRect();
              centerLeft = (sqRect.left + sqRect.width / 2) - boardRect.left;
              centerTop = (sqRect.top + sqRect.height / 2) - boardRect.top;
            }
          }

          const k = playersHere.length;
          const tokenSize = Math.max(24, Math.min(boardRect.width * 0.045, 42));
          const offsetDist = tokenSize * 0.38;

          playersHere.forEach((p, index) => {
            const tokenEl = document.getElementById('player-token-' + p.id);
            if (!tokenEl) return;

            let dx = 0;
            let dy = 0;

            if (k === 1) {
              // Lone token: EXACT 0px offset on both axes!
              dx = 0;
              dy = 0;
            } else if (k === 2) {
              // 2 players: left & right of center
              dx = (index === 0 ? -offsetDist : offsetDist);
              dy = 0;
            } else if (k === 3) {
              // 3 players: two above, one below
              if (index === 0) { dx = -offsetDist * 0.9; dy = -offsetDist * 0.8; }
              else if (index === 1) { dx = offsetDist * 0.9; dy = -offsetDist * 0.8; }
              else { dx = 0; dy = offsetDist * 0.9; }
            } else if (k === 4) {
              // 4 players: 2x2 cluster
              dx = (index % 2 === 0 ? -offsetDist * 0.85 : offsetDist * 0.85);
              dy = (index < 2 ? -offsetDist * 0.85 : offsetDist * 0.85);
            } else if (k === 5) {
              // 5 players: 4 corners + 1 in middle
              if (index === 0) { dx = -offsetDist; dy = -offsetDist; }
              else if (index === 1) { dx = offsetDist; dy = -offsetDist; }
              else if (index === 2) { dx = -offsetDist; dy = offsetDist; }
              else if (index === 3) { dx = offsetDist; dy = offsetDist; }
              else { dx = 0; dy = 0; }
            }

            tokenEl.style.left = (centerLeft + dx) + 'px';
            tokenEl.style.top = (centerTop + dy) + 'px';
          });
        });
      }

      window.addEventListener('resize', repositionAllTokens);

      /* ========================================================= */
      /* TURN & SCOREBOARD UI */
      /* ========================================================= */
      function updateTurnDisplay() {
        if (gameState.isGameOver) return;
        const activePlayer = gameState.players[gameState.activePlayerIndex];
        if (!activePlayer) return;

        el.currentPlayerName.textContent = activePlayer.name;
        el.currentPlayerName.style.color = activePlayer.color;

        if (activePlayer.isCpu) {
          el.turnStatusMessage.textContent = 'CPU is thinking...';
          // Trigger CPU roll automatically after brief pause
          if (!gameState.isBusy) {
            setTimeout(cpuPlayTurn, 750);
          }
        } else {
          el.turnStatusMessage.textContent = 'Click the dice to roll.';
        }

        renderPlayerList();
      }

      function renderPlayerList() {
        el.playerStatusList.innerHTML = '';
        gameState.players.forEach((p, idx) => {
          const row = document.createElement('div');
          row.className = 'player-row-item' + (idx === gameState.activePlayerIndex ? ' active-player-row' : '');

          const info = document.createElement('div');
          info.className = 'player-row-info';

          const dot = document.createElement('span');
          dot.className = 'token-dot';
          dot.style.background = p.color;

          const name = document.createElement('span');
          name.className = 'player-row-name';
          name.textContent = p.name;

          info.appendChild(dot);
          info.appendChild(name);

          const badge = document.createElement('span');
          badge.className = 'player-trophy-badge';
          badge.textContent = '🏆 ' + p.trophies + '/5';

          row.appendChild(info);
          row.appendChild(badge);
          el.playerStatusList.appendChild(row);
        });
      }

      /* ========================================================= */
      /* 3D REALISTIC DICE ROLLING */
      /* ========================================================= */
      // Resting orientation: rotateX(-12deg) rotateY(16deg)
      // Face alignments:
      // 1 (Front):   X: 0,   Y: 0
      // 2 (Back):    X: 0,   Y: 180
      // 3 (Right):   X: 0,   Y: -90
      // 4 (Left):    X: 0,   Y: 90
      // 5 (Top):     X: -90, Y: 0
      // 6 (Bottom):  X: 90,  Y: 0

      const FACE_ROTATIONS = {
        1: { x: 0,   y: 0 },
        2: { x: 0,   y: 180 },
        3: { x: 0,   y: -90 },
        4: { x: 0,   y: 90 },
        5: { x: -90, y: 0 },
        6: { x: 90,  y: 0 }
      };

      function rollDice(callback) {
        if (gameState.isBusy || gameState.isGameOver) return;
        gameState.isBusy = true;

        const rollVal = Math.floor(Math.random() * 6) + 1;
        gameState.rolledValue = rollVal;

        Sounds.roll();

        // 3 full spins on X and Y plus target face + resting tilt (-12, 16)
        const target = FACE_ROTATIONS[rollVal];
        const extraSpins = 3;
        gameState.diceAngleX = (extraSpins * 360) + target.x - 12;
        gameState.diceAngleY = (extraSpins * 360) + target.y + 16;

        el.diceCube.style.transform = 'rotateX(' + gameState.diceAngleX + 'deg) rotateY(' + gameState.diceAngleY + 'deg)';

        el.turnStatusMessage.textContent = 'Rolling...';

        setTimeout(() => {
          gameState.diceAngleX = (gameState.diceAngleX % 360);
          gameState.diceAngleY = (gameState.diceAngleY % 360);
          if (callback) callback(rollVal);
        }, 1000);
      }

      el.diceBtn.addEventListener('click', () => {
        const active = gameState.players[gameState.activePlayerIndex];
        if (!active || active.isCpu || gameState.isBusy || gameState.isGameOver) return;

        rollDice((rolled) => {
          const moveText = 'Move ' + rolled + (rolled === 1 ? ' space' : ' spaces');
          el.turnStatusMessage.textContent = 'Rolled a ' + rolled + '!';
          el.moveSpacesBtn.textContent = moveText + ' ▶';
          el.moveSpacesBtn.classList.remove('hidden');
          gameState.isBusy = false;
        });
      });

      el.moveSpacesBtn.addEventListener('click', () => {
        if (gameState.isBusy || gameState.isGameOver) return;
        el.moveSpacesBtn.classList.add('hidden');
        executePlayerMove(gameState.rolledValue);
      });

      function cpuPlayTurn() {
        if (gameState.isGameOver) return;
        rollDice((rolled) => {
          el.turnStatusMessage.textContent = 'CPU rolled a ' + rolled + '!';
          setTimeout(() => {
            executePlayerMove(rolled);
          }, 700);
        });
      }

      /* ========================================================= */
      /* STEP BY STEP MOVEMENT, SNAKES, AND LADDERS */
      /* ========================================================= */
      async function executePlayerMove(steps) {
        gameState.isBusy = true;
        const player = gameState.players[gameState.activePlayerIndex];
        const currentPos = player.position;
        const targetPos = currentPos + steps;

        // Exact finish check: overshooting 20 does not move
        if (targetPos > 20) {
          Sounds.blocked();
          el.turnStatusMessage.textContent = player.name + ' needs an exact roll. The token stays put.';
          announce(player.name + ' needs an exact roll. The token stays put.');
          await delay(1300);
          advanceToNextPlayer();
          return;
        }

        // Move 1 square at a time
        for (let s = 1; s <= steps; s++) {
          player.position = currentPos + s;
          Sounds.step();
          const tokenEl = document.getElementById('player-token-' + player.id);
          if (tokenEl) {
            tokenEl.classList.remove('hop-anim');
            void tokenEl.offsetWidth; // Trigger reflow
            tokenEl.classList.add('hop-anim');
          }
          repositionAllTokens();
          await delay(280);
        }

        // Check if reached 20 exactly
        if (player.position === 20) {
          declareVictory(player, 'reached square 20!');
          return;
        }

        // Check Ladders
        if (LADDERS[player.position]) {
          const dest = LADDERS[player.position];
          el.turnStatusMessage.textContent = 'Ladder! ' + player.name + ' climbs to square ' + dest + '.';
          announce('Ladder! ' + player.name + ' climbs to square ' + dest + '.');
          Sounds.ladder();
          await delay(600);
          player.position = dest;
          repositionAllTokens();
          await delay(700);
        }
        // Check Snakes
        else if (SNAKES[player.position]) {
          const dest = SNAKES[player.position];
          el.turnStatusMessage.textContent = 'Oh no! A snake bites ' + player.name + ' and slides the token down to square ' + dest + '.';
          announce('Oh no! A snake bites ' + player.name + ' and slides the token down to square ' + dest + '.');
          Sounds.snake();
          showSnakeCryBanner();
          await delay(700);
          player.position = dest;
          repositionAllTokens();
          await delay(800);
        }

        // Check if destination ladder led to 20
        if (player.position === 20) {
          declareVictory(player, 'reached square 20!');
          return;
        }

        advanceToNextPlayer();
      }

      function showSnakeCryBanner() {
        const cry = document.createElement('div');
        cry.className = 'snake-cry-banner';
        cry.textContent = '😭';
        document.body.appendChild(cry);
        setTimeout(() => {
          if (cry.parentNode) cry.parentNode.removeChild(cry);
        }, 1300);
      }

      function advanceToNextPlayer() {
        gameState.isBusy = false;
        gameState.rolledValue = 0;
        gameState.activePlayerIndex = (gameState.activePlayerIndex + 1) % gameState.players.length;
        updateTurnDisplay();
      }

      function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      /* ========================================================= */
      /* QUESTIONS & TROPHIES LOGIC */
      /* ========================================================= */
      function handleQuestionClick(sqNumber) {
        if (gameState.isBusy || gameState.isGameOver) return;
        const activePlayer = gameState.players[gameState.activePlayerIndex];
        if (activePlayer && activePlayer.isCpu) return; // CPU turns don't manually answer

        const rec = gameState.questions[sqNumber - 1];
        if (!rec || !rec.q || !rec.a) {
          showToast('No question is saved for square ' + sqNumber + ' yet. Add it in settings.');
          return;
        }

        gameState.activeModalSquare = sqNumber;
        el.modalSqTitle.textContent = 'Square ' + sqNumber + ' question';
        el.modalQuestionText.textContent = rec.q;
        el.modalAnswerInput.value = '';
        el.modalFeedbackMsg.textContent = '';
        el.modalFeedbackMsg.className = 'modal-feedback';
        el.questionModal.classList.remove('hidden');
        setTimeout(() => el.modalAnswerInput.focus(), 100);
      }

      function closeQuestionModal() {
        el.questionModal.classList.add('hidden');
        gameState.activeModalSquare = null;
      }

      function checkQuestionAnswer() {
        const sq = gameState.activeModalSquare;
        if (!sq) return;
        const rec = gameState.questions[sq - 1];
        if (!rec) return;

        const typed = normalizeAnswer(el.modalAnswerInput.value);
        const expected = normalizeAnswer(rec.a);
        const activePlayer = gameState.players[gameState.activePlayerIndex];

        if (typed === expected) {
          if (!activePlayer.earnedSquares.has(sq)) {
            activePlayer.earnedSquares.add(sq);
            activePlayer.trophies += 1;
            renderPlayerList();
            Sounds.correctAnswer();
            Sounds.trophy();
            el.modalFeedbackMsg.textContent = 'Correct! Trophy earned! ✨🏆';
            el.modalFeedbackMsg.className = 'modal-feedback correct';
            announce('Correct! Trophy earned for square ' + sq);

            // 5 Trophies Victory Check
            if (activePlayer.trophies >= 5) {
              setTimeout(() => {
                closeQuestionModal();
                activePlayer.position = 20;
                repositionAllTokens();
                declareVictory(activePlayer, 'collected five trophies!');
              }, 800);
              return;
            }
          } else {
            Sounds.correctAnswer();
            el.modalFeedbackMsg.textContent = 'Correct! You already earned the trophy for this square.';
            el.modalFeedbackMsg.className = 'modal-feedback correct';
          }
        } else {
          Sounds.wrongAnswer();
          el.modalFeedbackMsg.textContent = 'Not quite—try again. Check spelling and spacing.';
          el.modalFeedbackMsg.className = 'modal-feedback wrong';
          announce('Not quite, try again.');
        }
      }

      el.modalSubmitBtn.addEventListener('click', checkQuestionAnswer);
      el.modalCloseBtn.addEventListener('click', closeQuestionModal);
      el.modalCancelBtn.addEventListener('click', closeQuestionModal);
      el.modalAnswerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkQuestionAnswer();
        } else if (e.key === 'Escape') {
          closeQuestionModal();
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !el.questionModal.classList.contains('hidden')) {
          closeQuestionModal();
        }
      });

      /* ========================================================= */
      /* VICTORY SCREEN & CONFETTI */
      /* ========================================================= */
      function declareVictory(player, reason) {
        gameState.isGameOver = true;
        gameState.isBusy = false;
        el.moveSpacesBtn.classList.add('hidden');
        el.victoryWinnerName.textContent = player.name;
        el.victoryWinnerName.style.color = player.color;
        el.victoryReasonText.textContent = reason;
        el.victoryModal.classList.remove('hidden');

        Sounds.victory();
        createConfetti();
        announce('Victory! ' + player.name + ' ' + reason);
      }

      function createConfetti() {
        el.confettiContainer.innerHTML = '';
        const colors = ['#ff5d66', '#1878ee', '#18a75b', '#8a4de1', '#ef8b20', '#ffd85b', '#ffffff', '#32dfff'];
        for (let i = 0; i < 90; i++) {
          const piece = document.createElement('div');
          piece.className = 'confetti-piece';
          piece.style.left = (Math.random() * 100) + '%';
          piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          piece.style.animationDuration = (2 + Math.random() * 3) + 's';
          piece.style.animationDelay = (Math.random() * 2) + 's';
          piece.style.width = (8 + Math.random() * 8) + 'px';
          piece.style.height = (10 + Math.random() * 12) + 'px';
          piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
          el.confettiContainer.appendChild(piece);
        }
      }

      /* ========================================================= */
      /* SOUND TOGGLE */
      /* ========================================================= */
      el.soundToggleBtn.addEventListener('click', () => {
        gameState.soundEnabled = !gameState.soundEnabled;
        el.soundToggleBtn.setAttribute('aria-pressed', gameState.soundEnabled ? 'true' : 'false');
        el.soundToggleBtn.textContent = gameState.soundEnabled ? '🔊 Sound on' : '🔇 Sound off';
        if (gameState.soundEnabled) {
          getAudioContext();
          Sounds.save();
        }
      });

      /* ========================================================= */
      /* BOOTSTRAP */
      /* ========================================================= */
      loadSavedData();
      initSettingsUI();

    })();
  </script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlContent);
console.log('Successfully written standalone index.html! File size:', fs.statSync('index.html').size, 'bytes');
