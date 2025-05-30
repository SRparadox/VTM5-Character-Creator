import "./style.css";
import {
  sects,
  sectClans,
  clans,
  disciplines,
  disciplinePowers,
  clanInfo,
  archetypes
} from "./data.ts";

const app = document.querySelector<HTMLDivElement>("#app")!;

// Attribute and Skill definitions
const attributes = [
  { name: "Strength" }, { name: "Dexterity" }, { name: "Stamina" },
  { name: "Charisma" }, { name: "Manipulation" }, { name: "Composure" },
  { name: "Intelligence" }, { name: "Wits" }, { name: "Resolve" }
];

const skills = [
  { name: "Athletics" }, { name: "Brawl" }, { name: "Craft" }, { name: "Drive" }, { name: "Firearms" },
  { name: "Melee" }, { name: "Larceny" }, { name: "Stealth" }, { name: "Survival" },
  { name: "Animal Ken" }, { name: "Etiquette" }, { name: "Insight" }, { name: "Intimidation" },
  { name: "Leadership" }, { name: "Performance" }, { name: "Persuasion" }, { name: "Streetwise" }, { name: "Subterfuge" },
  { name: "Academics" }, { name: "Awareness" }, { name: "Finance" }, { name: "Investigation" },
  { name: "Medicine" }, { name: "Occult" }, { name: "Politics" }, { name: "Science" }, { name: "Technology" }
];

// State for dots
const attributeDots = Array(attributes.length).fill(1); // Default 1 dot each
const skillDots = Array(skills.length).fill(0); // Default 0 dots each

const appElement = document.getElementById('app');
if (appElement) {
  // Add more vertical margin and padding to ensure all panels are visible and not clipped
  appElement.innerHTML = `
    <div class="container"
      style="
        max-width: 520px;
        margin: 0 auto;
        padding: 48px 0 48px 0;
        display: flex;
        flex-direction: column;
        gap: 2.5em;
        box-sizing: border-box;
        min-height: 500vh;
      ">
      <section class="panel panel-left" style="display: flex; flex-direction: column; gap: 0.8em;">
        <h2>Character Details</h2>
        <label style="display:flex; flex-direction:column; gap:0.2em;">Player Name:<input type="text" id="playerName" /></label>
        <label style="display:flex; flex-direction:column; gap:0.2em;">Character Name:<input type="text" id="characterName" /></label>
        <label style="display:flex; flex-direction:column; gap:0.2em;">Chronicle:<input type="text" id="chronicle" /></label>
        <label style="display:flex; flex-direction:column; gap:0.2em;">Concept:<input type="text" id="concept" /></label>
        <label for="natureSelect" style="display:flex; flex-direction:column; gap:0.2em;">
          Nature:
          <select id="natureSelect">
            <option value="">-- Select Nature --</option>
            ${archetypes.map((a, i) => `<option value="${i}">${a.name}</option>`).join('')}
          </select>
        </label>
        <div id="natureDescription" class="archetype-description" style="margin-bottom:0.5em;"></div>
        <label for="demeanorSelect" style="display:flex; flex-direction:column; gap:0.2em;">
          Demeanor:
          <select id="demeanorSelect">
            <option value="">-- Select Demeanor --</option>
            ${archetypes.map((a, i) => `<option value="${i}">${a.name}</option>`).join('')}
          </select>
        </label>
        <div id="demeanorDescription" class="archetype-description"></div>
      </section>
      <section class="panel panel-attributes">
        <h2>Attributes</h2>
        <div id="attributesTable" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5em;"></div>
      </section>
      <section class="panel panel-skills">
        <h2>Skills</h2>
        <div id="skillsTable" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5em;"></div>
      </section>
      <section class="panel panel-sect">
        <h2>Sect Selection</h2>
        <label for="sectSelect" style="display:block;margin-bottom:0.5em;">Sect:</label>
        <select id="sectSelect" style="width:100%;max-width:320px;">
          ${sects.map((sect, i) => `<option value="${i}">${sect.name}</option>`).join('')}
        </select>
        <div id="sectInfo" style="margin-top:1em;">
          <div class="sect-image" id="sectImage" style="background-image: url('${sects[0].image}');width:100%;height:120px;background-size:contain;background-repeat:no-repeat;background-position:center;margin-bottom:0.5em;"></div>
          <div class="sect-description" id="sectDescription">${sects[0].description}</div>
          <div class="sect-clans" id="sectClans" style="margin-top:0.5em;font-style:italic;color:#e0b0b0;">
            Clans & Bloodlines: ${sectClans[sects[0].name] || "Various"}
          </div>
        </div>
      </section>
      <section class="panel panel-clan">
        <h2>Clan Selection</h2>
        <label for="clanSelect" style="display:block;margin-bottom:0.5em;">Clan:</label>
        <select id="clanSelect" style="width:100%;max-width:320px;">
          ${clans.map((clan, i) => `<option value="${i}">${clan.name}</option>`).join('')}
        </select>
        <div id="clanInfo" style="margin-top:1em;">
          <div class="sect-image" id="clanImage" style="background-image: url('${clans[0].image}');width:100%;height:120px;background-size:contain;background-repeat:no-repeat;background-position:center;margin-bottom:0.5em;"></div>
          <div class="sect-description" id="clanDescription">${clans[0].description}</div>
          <div class="clan-info" id="clanInfoLines" style="margin-top:0.5em;font-size:0.95em;color:#e0e0e0;">
            <div><b>Disciplines:</b> ${clanInfo[clans[0].name]?.disciplines || "Varies"}</div>
            <div><b>Compulsion:</b> ${clanInfo[clans[0].name]?.compulsion || "None"}</div>
            <div><b>Bane:</b> ${clanInfo[clans[0].name]?.bane || "None"}</div>
            <div><b>Variant Bane:</b> ${clanInfo[clans[0].name]?.variantBane || "None"}</div>
          </div>
        </div>
      </section>
      <section class="panel panel-discipline" style="margin-bottom:2em;">
        <h2>Discipline Selection</h2>
        <label for="disciplineSelect" style="display:block;margin-bottom:0.5em;">Disciplines (choose up to 5):</label>
        <div style="display: flex; align-items: flex-start; gap: 1em;">
          <select id="disciplineSelect" size="8" style="width:100%;max-width:220px;">
            ${disciplines.map((d, i) => `<option value="${i}">${d.name}</option>`).join('')}
          </select>
          <button id="addDisciplineBtn" type="button" style="height:2.2em;">Add</button>
        </div>
        <div id="disciplineInfo" style="margin-top:1em;">
          <div class="sect-description" id="disciplineDescription"></div>
          <div style="margin-top:1em;"><b>Collected Disciplines:</b></div>
          <ul id="collectedDisciplines" style="margin:0.5em 0 0 1em;padding:0;"></ul>
        </div>
      </section>
    </div>
  `;

  // Render counters for attributes and skills after the DOM is set up
  function renderCounter(current: number, min: number, max: number, prefix: string, idx: number) {
    // Place - and + on the sides of the number, horizontally
    return `
      <span style="display: inline-flex; align-items: center; gap: 0.2em;">
        <button type="button" class="counter-btn" data-type="${prefix}" data-idx="${idx}" data-action="dec" style="width:1.5em;height:1.5em;padding:0;font-size:1em;line-height:1em;">-</button>
        <span class="counter-value" data-type="${prefix}" data-idx="${idx}" style="display:inline-block;width:2em;text-align:center;">${current}</span>
        <button type="button" class="counter-btn" data-type="${prefix}" data-idx="${idx}" data-action="inc" style="width:1.5em;height:1.5em;padding:0;font-size:1em;line-height:1em;">+</button>
      </span>
    `;
  }

  function updateCountersUI() {
    // Attributes: 3 columns grid
    const attrTable = document.getElementById('attributesTable');
    if (attrTable) {
      attrTable.innerHTML = attributes.map((attr, i) => `
        <div style="display:flex;align-items:center;gap:1em;margin-bottom:0.5em;">
          <span style="width:110px;display:inline-block;">${attr.name}</span>
          <span>${renderCounter(attributeDots[i], 1, 5, "attr", i)}</span>
        </div>
      `).join('');
    }
    // Skills: 3 columns grid
    const skillTable = document.getElementById('skillsTable');
    if (skillTable) {
      skillTable.innerHTML = skills.map((skill, i) => `
        <div style="display:flex;align-items:center;gap:1em;margin-bottom:0.5em;">
          <span style="width:110px;display:inline-block;">${skill.name}</span>
          <span>${renderCounter(skillDots[i], 0, 5, "skill", i)}</span>
        </div>
      `).join('');
    }
    // Add event listeners for counters
    document.querySelectorAll('.counter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const type = target.getAttribute('data-type');
        const idx = parseInt(target.getAttribute('data-idx') || "0", 10);
        const action = target.getAttribute('data-action');
        if (type === "attr") {
          if (action === "inc" && attributeDots[idx] < 5) attributeDots[idx]++;
          if (action === "dec" && attributeDots[idx] > 1) attributeDots[idx]--;
          updateCountersUI();
        } else if (type === "skill") {
          if (action === "inc" && skillDots[idx] < 5) skillDots[idx]++;
          if (action === "dec" && skillDots[idx] > 0) skillDots[idx]--;
          updateCountersUI();
        }
      });
    });
  }

  updateCountersUI();

  // Fix: Use unique IDs for sect and clan elements to avoid querySelector conflicts
  const sectSelect = document.getElementById('sectSelect') as HTMLSelectElement;
  const sectDescription = document.getElementById('sectDescription') as HTMLElement;
  const sectImage = document.getElementById('sectImage') as HTMLElement;
  const sectClansDiv = document.getElementById('sectClans') as HTMLElement;

  sectSelect.addEventListener('change', (e) => {
    const idx = parseInt((e.target as HTMLSelectElement).value, 10);
    sectDescription.textContent = sects[idx].description;
    sectImage.style.backgroundImage = `url('${sects[idx].image}')`;
    sectClansDiv.textContent = `Clans & Bloodlines: ${sectClans[sects[idx].name] || "Various"}`;
  });

  const clanSelect = document.getElementById('clanSelect') as HTMLSelectElement;
  const clanDescription = document.getElementById('clanDescription') as HTMLElement;
  const clanImage = document.getElementById('clanImage') as HTMLElement;
  const clanInfoLines = document.getElementById('clanInfoLines') as HTMLElement;

  clanSelect.addEventListener('change', (e) => {
    const idx = parseInt((e.target as HTMLSelectElement).value, 10);
    clanDescription.textContent = clans[idx].description;
    clanImage.style.backgroundImage = `url('${clans[idx].image}')`;
    const info = clanInfo[clans[idx].name] || {};
    clanInfoLines.innerHTML = `
      <div><b>Disciplines:</b> ${info.disciplines || "Varies"}</div>
      <div><b>Compulsion:</b> ${info.compulsion || "None"}</div>
      <div><b>Bane:</b> ${info.bane || "None"}</div>
      <div><b>Variant Bane:</b> ${info.variantBane || "None"}</div>
    `;
  });

  const disciplineSelect = document.getElementById('disciplineSelect') as HTMLSelectElement;
  const disciplineDescription = document.getElementById('disciplineDescription') as HTMLElement;
  const collectedDisciplines = document.getElementById('collectedDisciplines') as HTMLUListElement;
  const addDisciplineBtn = document.getElementById('addDisciplineBtn') as HTMLButtonElement;

  // Store collected discipline indices and their levels
  type CollectedDiscipline = {
    idx: number;
    level: number;
    powers?: { level: number; name: string }[];
  };

  let collected: CollectedDiscipline[] = [];

  function updateDisciplineDescription() {
    const selectedIdx = disciplineSelect.selectedIndex;
    if (selectedIdx >= 0) {
      disciplineDescription.textContent = disciplines[disciplineSelect.options[selectedIdx].value].description;
    } else {
      disciplineDescription.textContent = "";
    }
  }

  function renderCollectedDisciplines() {
    collectedDisciplines.innerHTML = collected
      .map(
        (entry, i) => {
          const disciplineName = disciplines[entry.idx].name;
          const powers = entry.powers || [];
          const availablePowers = disciplinePowers[disciplineName] || [];
          // Powers dropdown
          const powersDropdown = `
            <select id="powerSelect-${i}" style="max-width:180px;">
              <option value="">-- Select Power --</option>
              ${availablePowers
                .map(
                  (p, pi) =>
                    `<option value="${pi}">Level ${p.level}: ${p.name}</option>`
                )
                .join('')}
            </select>
            <button type="button" id="addPowerBtn-${i}">Add Power</button>
          `;
          // Collected powers list with remove buttons
          const powersList = `
            <ul id="collectedPowers-${i}" style="margin:0.5em 0 0 1em;padding:0;">
              ${powers
                .map(
                  (p: { level: number; name: string }, pi: number) =>
                    `<li>
                      Level ${p.level}: ${p.name}
                      <button type="button" id="removePowerBtn-${i}-${pi}" style="margin-left:0.5em;">Remove</button>
                    </li>`
                )
                .join('')}
            </ul>
          `;
          return `
            <li style="margin-bottom:1em;">
              ${disciplineName}
              (<span id="discipline-level-${i}">${entry.level}</span>)
              <button type="button" id="inc-discipline-${i}">+</button>
              <button type="button" id="dec-discipline-${i}">-</button>
              <button type="button" id="removeDisciplineBtn-${i}" style="margin-left:0.5em;">Remove Discipline</button>
              <div class="mini-panel" style="margin-top:0.5em; border:1px solid #800020; border-radius:6px; padding:0.5em; background:rgba(30,0,30,0.5);">
                <div><b>Powers</b></div>
                ${powersDropdown}
                ${powersList}
              </div>
            </li>
          `;
        }
      )
      .join('');

    // Add event listeners for +, -, remove discipline, and power selection
    collected.forEach((entry, i) => {
      const incBtn = document.getElementById(`inc-discipline-${i}`) as HTMLButtonElement;
      const decBtn = document.getElementById(`dec-discipline-${i}`) as HTMLButtonElement;
      const levelSpan = document.getElementById(`discipline-level-${i}`) as HTMLSpanElement;
      const powerSelect = document.getElementById(`powerSelect-${i}`) as HTMLSelectElement;
      const addPowerBtn = document.getElementById(`addPowerBtn-${i}`) as HTMLButtonElement;
      const powersList = document.getElementById(`collectedPowers-${i}`) as HTMLUListElement;
      const removeDisciplineBtn = document.getElementById(`removeDisciplineBtn-${i}`) as HTMLButtonElement;

      incBtn?.addEventListener('click', () => {
        if (entry.level < 10) {
          entry.level++;
          levelSpan.textContent = entry.level.toString();
        }
      });
      decBtn?.addEventListener('click', () => {
        if (entry.level > 1) {
          entry.level--;
          levelSpan.textContent = entry.level.toString();
        }
      });

      // Remove discipline
      removeDisciplineBtn?.addEventListener('click', () => {
        collected.splice(i, 1);
        renderCollectedDisciplines();
      });

      // Add power to discipline
      addPowerBtn?.addEventListener('click', () => {
        if (!powerSelect || !powerSelect.value) return;
        const disciplineName = disciplines[entry.idx].name;
        const availablePowers = disciplinePowers[disciplineName] || [];
        const powerIdx = parseInt(powerSelect.value, 10);
        if (
          !isNaN(powerIdx) &&
          availablePowers[powerIdx] &&
          !(entry.powers || []).some(
            (p: { level: number; name: string }) =>
              p.name === availablePowers[powerIdx].name &&
              p.level === availablePowers[powerIdx].level
          )
        ) {
          if (!entry.powers) entry.powers = [];
          entry.powers.push(availablePowers[powerIdx]);
          renderCollectedDisciplines();
        }
      });

      // Remove power from discipline
      (entry.powers || []).forEach((p: { level: number; name: string }, pi: number) => {
        const removePowerBtn = document.getElementById(`removePowerBtn-${i}-${pi}`) as HTMLButtonElement;
        removePowerBtn?.addEventListener('click', () => {
          entry.powers.splice(pi, 1);
          renderCollectedDisciplines();
        });
      });
    });
  }

  disciplineSelect.addEventListener('change', updateDisciplineDescription);

  addDisciplineBtn.addEventListener('click', () => {
    const selectedIdx = disciplineSelect.selectedIndex;
    if (
      selectedIdx >= 0 &&
      collected.length < 5
    ) {
      const idx = parseInt(disciplineSelect.options[selectedIdx].value, 10);
      if (!collected.some(e => e.idx === idx)) {
        collected.push({ idx, level: 1, powers: [] });
        renderCollectedDisciplines();
      }
    }
  });

  // Initialize
  disciplineDescription.textContent = "";
  collectedDisciplines.innerHTML = "";

  // Add nature/demeanor description logic
  const natureSelect = document.getElementById('natureSelect') as HTMLSelectElement;
  const natureDescription = document.getElementById('natureDescription') as HTMLElement;
  const demeanorSelect = document.getElementById('demeanorSelect') as HTMLSelectElement;
  const demeanorDescription = document.getElementById('demeanorDescription') as HTMLElement;

  if (natureSelect && natureDescription) {
    natureSelect.addEventListener('change', (e) => {
      const idx = parseInt((e.target as HTMLSelectElement).value, 10);
      if (!isNaN(idx) && archetypes[idx]) {
        natureDescription.textContent = archetypes[idx].description;
      } else {
        natureDescription.textContent = "";
      }
    });
  }
  if (demeanorSelect && demeanorDescription) {
    demeanorSelect.addEventListener('change', (e) => {
      const idx = parseInt((e.target as HTMLSelectElement).value, 10);
      if (!isNaN(idx) && archetypes[idx]) {
        demeanorDescription.textContent = archetypes[idx].description;
      } else {
        demeanorDescription.textContent = "";
      }
    });
  }
}
