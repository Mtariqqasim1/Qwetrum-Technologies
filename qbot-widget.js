/**
 * QBot — Qwetrum Technologies AI Business Agent
 * Secure version — API key is hidden on server (Vercel proxy)
 */

(function () {
  // ─── CONFIG ──────────────────────────────────────────────────────────────────
  const CONFIG = {
    accentColor: "#41ebaa",
    bgColor: "#0A0F1E",
    websiteUrl: "https://www.qwetrumtechnologies.tech",
    contactUrl: "https://www.qwetrumtechnologies.tech/#contact",
  };

  const SYSTEM = `You are QBot — the expert AI business agent for Qwetrum Technologies (https://www.qwetrumtechnologies.tech/), a premier custom software development and digital growth agency based in Pakistan.

COMPANY: Qwetrum Technologies Pvt Ltd — "One team to build, convert, and grow your digital presence." 100+ clients served. Notable clients: Sunny Fashion, Crown Baby Cycle Store, Ferdous Bakers, Yana Naturals, TechVision.

SERVICES:
• Web Development, E-commerce Stores, POS Software, Healthcare/HIPAA Apps, Custom Software, Landing Pages
• SEO, Social Media Marketing, PPC Advertising, Content & Email Marketing
• n8n Automation: Webhooks, AI agent workflows, CRM automation, data pipelines — 1,650+ nodes, 2,700+ templates

TIMELINES: Landing page 3–5d | Website 1–2wk | E-commerce 2–6wk | Custom app 4–10wk | Healthcare 6–14wk | n8n suite 1–3wk

ROLE: Be warm, professional, consultative. Ask about industry, pain points, goals, budget, timeline. Suggest specific services. Keep responses under 120 words. Use short bullets. Encourage free consultation booking. Never give firm pricing.`;

  const QUICK = [
    "💼 Get a Free Consultation",
    "🛒 I need an E-commerce Store",
    "🤖 What is n8n Automation?",
    "💊 Healthcare & HIPAA Apps",
    "📈 SEO & Digital Marketing",
    "🖥️ Custom Software / POS",
  ];

  // ─── STATE ───────────────────────────────────────────────────────────────────
  let open = false;
  let msgs = [];
  let loading = false;
  let userCount = 0;
  let ctaDone = false;
  let streamTimer = null;

  // ─── CSS ─────────────────────────────────────────────────────────────────────
  const css = `
#qbot-tooltip{position:fixed;bottom:92px;right:24px;background:linear-gradient(135deg,#0d3320,#0F1425);border:1px solid rgba(65,235,170,0.35);color:#41ebaa;font-size:12px;font-weight:600;padding:8px 14px;border-radius:12px 12px 4px 12px;white-space:nowrap;z-index:99997;box-shadow:0 4px 20px rgba(65,235,170,0.2);animation:qbTooltipBounce 3s ease-in-out infinite;font-family:'Segoe UI',system-ui,sans-serif;pointer-events:none;display:flex;align-items:center;gap:6px;}
#qbot-tooltip::after{content:'';position:absolute;bottom:-6px;right:18px;width:10px;height:10px;background:linear-gradient(135deg,#0d3320,#0F1425);border-right:1px solid rgba(65,235,170,0.35);border-bottom:1px solid rgba(65,235,170,0.35);transform:rotate(45deg);}
#qbot-tooltip .qbot-tlp-dot{width:7px;height:7px;border-radius:50%;background:#41ebaa;animation:qbBlink 1.1s ease-in-out infinite;}
@keyframes qbTooltipBounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}
@keyframes qbBlink{0%,100%{opacity:1;box-shadow:0 0 6px #41ebaa;}50%{opacity:0.2;box-shadow:none;}}
#qbot-fab{position:fixed;bottom:24px;right:24px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#10a84f,#41ebaa);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:99998;box-shadow:0 4px 24px rgba(65,235,170,0.45);transition:transform 0.25s cubic-bezier(.175,.885,.32,1.275),box-shadow 0.25s;}
#qbot-fab:hover{transform:scale(1.12);box-shadow:0 8px 36px rgba(65,235,170,0.6);}
#qbot-fab::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(65,235,170,0.35);animation:qbPulse 2.5s ease-in-out infinite;}
#qbot-fab svg{transition:transform 0.3s,opacity 0.2s;}
#qbot-panel{position:fixed;bottom:94px;right:24px;width:370px;max-height:calc(100vh - 110px);height:560px;border-radius:18px;background:#0A0F1E;border:1px solid rgba(65,235,170,0.2);display:flex;flex-direction:column;overflow:hidden;z-index:99999;box-shadow:0 12px 56px rgba(0,0,0,0.75),0 0 0 1px rgba(65,235,170,0.08);transform:translateY(16px) scale(0.95);opacity:0;pointer-events:none;transition:transform 0.3s cubic-bezier(.175,.885,.32,1.275),opacity 0.25s ease;font-family:'Segoe UI',system-ui,sans-serif;}
#qbot-panel.open{transform:translateY(0) scale(1);opacity:1;pointer-events:all;}
#qbot-hdr{padding:13px 15px;border-bottom:1px solid rgba(65,235,170,0.15);background:rgba(10,15,30,0.98);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
#qbot-msgs{flex:1;overflow-y:auto;padding:14px 14px 8px;background:#0A0F1E;min-height:0;}
#qbot-msgs::-webkit-scrollbar{width:3px;}
#qbot-msgs::-webkit-scrollbar-thumb{background:rgba(65,235,170,0.25);border-radius:3px;}
#qbot-chips{padding:0 14px 8px;display:flex;flex-wrap:wrap;gap:5px;flex-shrink:0;background:#0A0F1E;}
#qbot-cta{padding:0 14px 8px;flex-shrink:0;display:none;}
#qbot-inp-area{padding:10px 12px 12px;border-top:1px solid rgba(65,235,170,0.12);background:rgba(10,15,30,0.97);flex-shrink:0;display:flex;gap:8px;align-items:flex-end;}
#qbot-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(65,235,170,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(65,235,170,0.022) 1px,transparent 1px);background-size:36px 36px;pointer-events:none;}
#qbot-textarea{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(65,235,170,0.18);border-radius:10px;padding:8px 12px;color:#e2e8f0;font-size:13px;font-family:inherit;resize:none;outline:none;line-height:1.5;min-height:38px;max-height:90px;overflow-y:auto;transition:border-color 0.2s;box-sizing:border-box;}
#qbot-textarea:focus{border-color:rgba(65,235,170,0.5);}
#qbot-textarea::placeholder{color:#3d5a4a;}
#qbot-sendbtn{width:38px;height:38px;border-radius:9px;flex-shrink:0;background:rgba(65,235,170,0.08);border:1px solid rgba(65,235,170,0.25);cursor:not-allowed;color:rgba(65,235,170,0.3);display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
#qbot-footer{padding:5px 14px;border-top:1px solid rgba(65,235,170,0.07);display:flex;gap:6px;flex-wrap:wrap;justify-content:center;flex-shrink:0;background:#0A0F1E;}
.qbot-chip{font-size:11px;color:#41ebaa;background:rgba(65,235,170,0.07);border:1px solid rgba(65,235,170,0.22);border-radius:20px;padding:4px 10px;cursor:pointer;font-family:inherit;transition:background 0.15s,transform 0.15s;}
.qbot-chip:hover{background:rgba(65,235,170,0.15);transform:translateY(-1px);}
.qbot-bubble{display:flex;align-items:flex-end;gap:7px;margin-bottom:10px;animation:qbFadeUp 0.25s ease-out both;}
.qbot-bubble.user{justify-content:flex-end;}
.qbot-av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#0d3320,#10a84f);border:1.5px solid rgba(65,235,170,0.3);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#41ebaa;font-family:monospace;flex-shrink:0;}
.qbot-bub{max-width:80%;padding:9px 13px;font-size:13px;line-height:1.65;word-break:break-word;white-space:pre-wrap;}
.qbot-bub.bot{border-radius:14px 14px 14px 4px;background:rgba(255,255,255,0.04);border:1px solid rgba(65,235,170,0.15);color:#e2e8f0;}
.qbot-bub.user{border-radius:14px 14px 4px 14px;background:linear-gradient(135deg,#10a84f,#41ebaa);color:#fff;}
.qbot-dots span{display:inline-block;width:5px;height:5px;border-radius:50%;background:#41ebaa;margin:0 2px;animation:qbDot 1.2s ease-in-out infinite;}
.qbot-dots span:nth-child(2){animation-delay:0.2s;}
.qbot-dots span:nth-child(3){animation-delay:0.4s;}
@keyframes qbDot{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}
@keyframes qbFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes qbSpin{to{transform:rotate(360deg)}}
@keyframes qbPulse{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:0;transform:scale(1.35)}}
@media(max-width:480px){#qbot-tooltip{right:12px;bottom:88px;}#qbot-panel{width:calc(100vw - 16px);right:8px;bottom:82px;max-height:calc(100vh - 100px);height:auto;}#qbot-fab{bottom:16px;right:12px;}}
`;

  // ─── INJECT CSS ───────────────────────────────────────────────────────────────
  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── HTML ─────────────────────────────────────────────────────────────────────
  const root = document.createElement("div");
  root.innerHTML = `
  <div id="qbot-tooltip">
    <span class="qbot-tlp-dot"></span> How can we help you today?
  </div>

  <button id="qbot-fab" aria-label="Chat with QBot">
    <svg id="qbot-icon-open" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 2v3"/><circle cx="12" cy="2" r="1" fill="#fff" stroke="none"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="16" y1="2" x2="16" y2="5"/><circle cx="8.5" cy="13" r="1.5" fill="#fff" stroke="none"/><circle cx="15.5" cy="13" r="1.5" fill="#fff" stroke="none"/><path d="M9 17h6"/></svg>
    <svg id="qbot-icon-close" style="display:none" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>

  <div id="qbot-panel">
    <div id="qbot-grid"></div>
    <div id="qbot-hdr">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#0d3320,#10a84f);border:1.5px solid rgba(65,235,170,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#41ebaa;font-family:monospace;">Q</div>
        <div>
          <div style="font-size:13px;font-weight:600;color:#f0f9ff;">QBot — Qwetrum Technologies</div>
          <div style="display:flex;align-items:center;gap:5px;margin-top:1px;">
            <div style="width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 5px #4ade80;"></div>
            <span style="font-size:11px;color:#64748b;">Online · AI Business Agent</span>
          </div>
        </div>
      </div>
      <button onclick="toggleQBot()" style="background:none;border:none;cursor:pointer;color:#64748b;padding:4px;display:flex;align-items:center;justify-content:center;border-radius:6px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div id="qbot-msgs"></div>
    <div id="qbot-chips"></div>
    <div id="qbot-cta"></div>
    <div id="qbot-inp-area">
      <textarea id="qbot-textarea" rows="1" placeholder="Ask about services, timelines, automation..."></textarea>
      <button id="qbot-sendbtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
    <div id="qbot-footer">
      <span style="font-size:10px;color:#2d5a3d;">Powered by</span>
      <span style="font-size:10px;color:#41ebaa;font-weight:600;">Qwetrum AI</span>
    </div>
  </div>
  `;
  document.body.appendChild(root);

  // ─── HELPERS ─────────────────────────────────────────────────────────────────
  function scrollBot() {
    const c = document.getElementById("qbot-msgs");
    if (c) c.scrollTop = c.scrollHeight;
  }

  function updateBtn() {
    const ta = document.getElementById("qbot-textarea");
    const btn = document.getElementById("qbot-sendbtn");
    if (!btn) return;
    const hasText = ta && ta.value.trim().length > 0;
    btn.style.background = hasText && !loading ? "linear-gradient(135deg,#10a84f,#41ebaa)" : "rgba(65,235,170,0.08)";
    btn.style.color = hasText && !loading ? "#fff" : "rgba(65,235,170,0.3)";
    btn.style.cursor = hasText && !loading ? "pointer" : "not-allowed";
    btn.style.border = hasText && !loading ? "none" : "1px solid rgba(65,235,170,0.25)";
  }

  function togglePanel() {
    open = !open;
    const panel = document.getElementById("qbot-panel");
    const iconOpen = document.getElementById("qbot-icon-open");
    const iconClose = document.getElementById("qbot-icon-close");
    const tooltip = document.getElementById("qbot-tooltip");
    panel.classList.toggle("open", open);
    iconOpen.style.display = open ? "none" : "block";
    iconClose.style.display = open ? "block" : "none";
    if (tooltip) tooltip.style.display = open ? "none" : "flex";
  }

  window.toggleQBot = togglePanel;

  let msgId = 0;
  function addMsg(role, text, stream) {
    const id = "qm" + (++msgId);
    const container = document.getElementById("qbot-msgs");
    const div = document.createElement("div");
    div.className = "qbot-bubble" + (role === "user" ? " user" : "");
    div.innerHTML = role === "user"
      ? `<div class="qbot-bub user">${text.replace(/\n/g,"<br>")}</div>`
      : `<div class="qbot-av">Q</div><div id="${id}-b" class="qbot-bub bot">${stream ? "" : text.replace(/\n/g,"<br>")}</div>`;
    container.appendChild(div);
    scrollBot();
    return id;
  }

  function addTyping() {
    const c = document.getElementById("qbot-msgs");
    const d = document.createElement("div");
    d.id = "qbot-typing";
    d.className = "qbot-bubble";
    d.innerHTML = `<div class="qbot-av">Q</div><div class="qbot-bub bot"><div class="qbot-dots"><span></span><span></span><span></span></div></div>`;
    c.appendChild(d);
    scrollBot();
  }

  function removeTyping() {
    const el = document.getElementById("qbot-typing");
    if (el) el.remove();
  }

  function streamText(id, text, cb) {
    const bub = document.getElementById(id + "-b");
    if (!bub) { cb && cb(); return; }
    const words = text.split(" ");
    let i = 0;
    clearInterval(streamTimer);
    streamTimer = setInterval(() => {
      if (i >= words.length) { clearInterval(streamTimer); bub.textContent = text; cb && cb(); return; }
      bub.textContent = words.slice(0, i+1).join(" ");
      i++;
      scrollBot();
    }, 26);
  }

  function maybeShowCTA() {
    if (ctaDone || userCount < 2) return;
    ctaDone = true;
    const el = document.getElementById("qbot-cta");
    el.style.display = "block";
    el.innerHTML = `<button onclick="if(typeof window.openContactModal==='function'){window.openContactModal();}else{window.location.hash='contact';}" style="width:100%;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px;background:linear-gradient(135deg,#10a84f,#41ebaa);border-radius:11px;color:#fff;font-size:12px;font-weight:600;font-family:inherit;border:none;cursor:pointer;">📅 Book Free Consultation — Get a Custom Quote</button>`;
  }

  // ─── SECURE API CALL — Vercel Proxy ──────────────────────────────────────────
  async function callGemini(messages) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, system: SYSTEM }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.reply || "Sorry, please try again.";
  }

  // ─── CHAT LOGIC ───────────────────────────────────────────────────────────────
  async function sendChat(text) {
    const ta = document.getElementById("qbot-textarea");
    const msg = text || (ta && ta.value.trim());
    if (!msg || loading) return;
    if (ta) { ta.value = ""; ta.style.height = "auto"; }
    loading = true;
    updateBtn();

    const chips = document.getElementById("qbot-chips");
    if (chips) chips.style.display = "none";

    msgs.push({ role: "user", content: msg });
    userCount++;
    addMsg("user", msg);
    addTyping();

    try {
      const reply = await callGemini(msgs);
      msgs.push({ role: "assistant", content: reply });
      removeTyping();
      const id = addMsg("assistant", "", true);
      streamText(id, reply, maybeShowCTA);
    } catch (e) {
      removeTyping();
      addMsg("assistant", "Connection issue — please try again.");
    }
    loading = false;
    updateBtn();
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────────
  function init() {
    const welcome = "Hi! I'm QBot 👋 — Qwetrum Technologies' AI assistant.\n\nI help you explore our services, scope your project, and connect with the right team.\n\nWhat are you looking to build today?";
    msgs.push({ role: "assistant", content: welcome });
    addMsg("assistant", welcome);

    const chips = document.getElementById("qbot-chips");
    chips.innerHTML = QUICK.map(q =>
      `<button class="qbot-chip" onclick="(function(){document.querySelector('#qbot-chips').style.display='none';})();window._qbotSend('${q.replace(/'/g,"&#39;")}')">${q}</button>`
    ).join("");

    window._qbotSend = sendChat;
    document.getElementById("qbot-fab").addEventListener("click", togglePanel);

    const ta = document.getElementById("qbot-textarea");
    ta.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 90) + "px";
      updateBtn();
    });
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); }
    });

    document.getElementById("qbot-sendbtn").addEventListener("click", sendChat);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
