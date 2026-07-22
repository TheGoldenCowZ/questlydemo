/* Questly demo — pure client-side */

const QUESTS = [
  {
    id: "museum",
    title: "Visit the Zagreb City Museum",
    type: "Museum",
    emoji: "🏛",
    desc: "Explore Zagreb's story — snap a photo at the entrance to complete the quest.",
    reward: 25,
    dist: "0.8 km",
    time: "~45 min",
    blurb: "Culture · Opatička 20",
  },
  {
    id: "park",
    title: "Explore Maksimir Park",
    type: "Park",
    emoji: "🌳",
    desc: "Walk a loop through Zagreb's favourite green lung. Photo at the main lake counts.",
    reward: 15,
    dist: "2.1 km",
    time: "~30 min",
    blurb: "Outdoors · Maksimir",
  },
  {
    id: "sport",
    title: "Try a local sport club",
    type: "Sport",
    emoji: "⚽",
    desc: "Drop into a youth training session or open court. Snap a photo at the club entrance.",
    reward: 30,
    dist: "1.4 km",
    time: "~60 min",
    blurb: "Move · Trnje",
  },
  {
    id: "square",
    title: "Discover Ban Jelačić Square",
    type: "City",
    emoji: "🗺️",
    desc: "Find the statue, learn one fun fact, and prove you were there with a photo.",
    reward: 20,
    dist: "0.5 km",
    time: "~20 min",
    blurb: "Landmark · Donji Grad",
  },
];

const REWARDS = [
  {
    id: "museum-ticket",
    title: "Museum ticket discount",
    partner: "Zagreb City Museum · 20% off",
    cost: 40,
  },
  {
    id: "sport-gear",
    title: "Sport gear voucher",
    partner: "Local sports shop · €10 off",
    cost: 60,
  },
  {
    id: "club-trial",
    title: "Club trial session",
    partner: "Partner sport clubs · free intro",
    cost: 80,
  },
  {
    id: "ice-cream",
    title: "Ice cream treat",
    partner: "Neighbourhood café · free scoop",
    cost: 25,
  },
];

const state = {
  tokens: 40,
  completed: new Set(),
  redeemed: new Set(),
  currentQuestId: null,
  screenHistory: [],
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function go(screen, { push = true } = {}) {
  const current = $(".screen.active");
  if (current && push) {
    state.screenHistory.push(current.dataset.screen);
  }

  $$(".screen").forEach((s) => s.classList.remove("active"));
  const next = $(`#screen-${screen}`);
  if (!next) return;
  next.classList.add("active");

  // Sync tab states
  $$(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.go === screen);
  });

  if (screen === "home") renderQuests();
  if (screen === "wallet") renderWallet();
  if (screen === "quest") renderQuestDetail();
}

function updateTokenUI() {
  const n = String(state.tokens);
  const count = $("#token-count");
  const wallet = $("#wallet-tokens");
  if (count) count.textContent = n;
  if (wallet) wallet.textContent = n;
}

function renderQuests() {
  const list = $("#quest-list");
  list.innerHTML = QUESTS.map((q) => {
    const done = state.completed.has(q.id);
    return `
      <button class="quest-card${done ? " done" : ""}" data-quest="${q.id}" ${done ? "disabled" : ""}>
        <span class="quest-icon">${q.emoji}</span>
        <div>
          <h3>${done ? "✓ " : ""}${q.title}</h3>
          <p>${q.blurb}</p>
        </div>
        <span class="quest-reward-badge">${done ? "Done" : "+" + q.reward}</span>
      </button>
    `;
  }).join("");

  list.querySelectorAll("[data-quest]").forEach((btn) => {
    btn.addEventListener("click", () => openQuest(btn.dataset.quest));
  });
}

function openQuest(id) {
  state.currentQuestId = id;
  go("quest");
}

function renderQuestDetail() {
  const q = QUESTS.find((x) => x.id === state.currentQuestId);
  if (!q) return;

  $("#quest-emoji").textContent = q.emoji;
  $("#quest-type").textContent = q.type;
  $("#quest-title").textContent = q.title;
  $("#quest-desc").textContent = q.desc;
  $("#quest-reward").textContent = "+" + q.reward;
  $("#quest-dist").textContent = q.dist;
  $("#quest-time").textContent = q.time;

  const btn = $("#btn-start-quest");
  if (state.completed.has(q.id)) {
    btn.textContent = "Already completed";
    btn.disabled = true;
  } else {
    btn.textContent = "I'm here — snap photo";
    btn.disabled = false;
  }
}

function renderWallet() {
  updateTokenUI();
  const list = $("#reward-list");
  list.innerHTML = REWARDS.map((r) => {
    const redeemed = state.redeemed.has(r.id);
    const canAfford = state.tokens >= r.cost;
    return `
      <button class="reward-card${redeemed ? " redeemed" : ""}" data-reward="${r.id}"
        ${redeemed || !canAfford ? "disabled" : ""}>
        <div>
          <h3>${r.title}</h3>
          <p>${r.partner}</p>
        </div>
        <span class="reward-cost">${redeemed ? "Redeemed" : r.cost + " tok"}</span>
      </button>
    `;
  }).join("");

  list.querySelectorAll("[data-reward]").forEach((btn) => {
    btn.addEventListener("click", () => redeem(btn.dataset.reward));
  });
}

function redeem(id) {
  const r = REWARDS.find((x) => x.id === id);
  if (!r || state.redeemed.has(id) || state.tokens < r.cost) return;
  state.tokens -= r.cost;
  state.redeemed.add(id);
  updateTokenUI();
  renderWallet();
  showToast(`Redeemed: ${r.title}`);
}

function startCamera() {
  const view = $("#camera-view");
  const hint = $("#camera-hint");
  const shutter = $("#btn-shutter");
  view.classList.remove("captured");
  hint.hidden = false;
  hint.textContent = "Point at the location";
  shutter.disabled = false;
  go("camera");
}

function takePhoto() {
  const q = QUESTS.find((x) => x.id === state.currentQuestId);
  if (!q || state.completed.has(q.id)) return;

  const view = $("#camera-view");
  const hint = $("#camera-hint");
  const shutter = $("#btn-shutter");

  shutter.disabled = true;
  hint.textContent = "Verifying with AI…";

  setTimeout(() => {
    view.classList.add("captured");
    hint.textContent = "Verified ✓";

    setTimeout(() => {
      state.completed.add(q.id);
      state.tokens += q.reward;
      updateTokenUI();

      $("#success-title").textContent = "Nice work!";
      $("#success-sub").textContent = `AI verified your visit to ${q.title.replace(/^Visit |^Explore |^Try |^Discover /, "")}.`;
      $("#success-tokens").textContent = "+" + q.reward;
      go("success");
    }, 700);
  }, 900);
}

function bindNav() {
  document.addEventListener("click", (e) => {
    const goBtn = e.target.closest("[data-go]");
    if (!goBtn) return;
    e.preventDefault();
    go(goBtn.dataset.go);
  });

  $("#btn-start-quest").addEventListener("click", startCamera);
  $("#btn-shutter").addEventListener("click", takePhoto);
}

function init() {
  updateTokenUI();
  renderQuests();
  renderWallet();
  bindNav();
}

init();
