import "./style.css";

// Import images from src/sect_images using Vite's import system
import camarilla from './sect_images/Camarilla.png';
import sabbat from './sect_images/Sabbat.png';
import anarch from './sect_images/Anarch.png';
import independent from './sect_images/Independent.png';

// Import clan images
import brujah from './clan_images/Brujah.png';
import tremere from './clan_images/Tremere.png';
import ventrue from './clan_images/Ventrue.png';
import baali from './clan_images/Baali.png';
import BanuHaqim from './clan_images/BanuHaqim.png';
import caitiff from './clan_images/Caitiff.png';
import cappadocian from './clan_images/Cappadocian.png';
import DaughtersofCacophony from './clan_images/DaughtersofCacophony.png';
import gangrel from './clan_images/Gangrel.png';
import gargoyle from './clan_images/Gargoyles.png';
import giovanni from './clan_images/Giovanni.png';
import hacata from './clan_images/Hecata.png';
import kiasyd from './clan_images/Kiasyd.png';
import lamia from './clan_images/Lamia.png';
import lasombra from './clan_images/Lasombra.png';
import lhianna from './clan_images/Lhiannan.png';
import maeghar from './clan_images/Maeghar.png';
import malkavian from './clan_images/Malkavian.png';
import ministry from './clan_images/Ministry.png';
import nosferatu from './clan_images/Nosferatu.png';
import nagaraja from './clan_images/Nagaraja.png';
import ravnos from './clan_images/Ravnos.png';
import salubri from './clan_images/Salubri.png';
import samedi from './clan_images/Samedi.png';
import toreador from './clan_images/Toreador.png';
import truebruja from './clan_images/TrueBrujah.png';
import tzimisce from './clan_images/Tzimisce.png';
// ...add more clans as needed...

const APP_NAME = "Hello";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const sects = [
  {
    name: "Camarilla",
    description: "The Camarilla is a secret society of vampires dedicated to maintaining the Masquerade.",
    image: camarilla,
  },
  {
    name: "Sabbat",
    description: "The Sabbat opposes the Camarilla and embraces their vampiric nature.",
    image: sabbat,
  },
  {
    name: "Anarch",
    description: "The Anarchs reject the authority of the Camarilla and Sabbat.",
    image: anarch,
  },
  {
    name: "Independent",
    description: "Independent vampires operate outside the major sects, often pursuing their own agendas.",
    image: independent,
  },
];

const clans = [
  {
    name: "Brujah",
    description: "Brujah are passionate rebels, iconoclasts, and warriors.",
    image: brujah,
  },
  {
    name: "Tremere",
    description: "Tremere are secretive sorcerers, masters of blood magic.",
    image: tremere,
  },
  {
    name: "Ventrue",
    description: "Ventrue are aristocratic leaders, rulers, and organizers.",
    image: ventrue,
  },
  {
    name: "Baali",
    description: "Baali are demonic vampires, often associated with dark rituals and infernal powers.",
    image: baali,
  },
  {
    name: "Banu Haqim",
    description: "Banu Haqim are fierce warriors and assassins, formerly known as Assamites.",
    image: BanuHaqim,
  },
  {
    name: "Caitiff",
    description: "Caitiff are clanless vampires, often marginalized by other clans.",
    image: caitiff,
  },
  {
    name: "Cappadocian",
    description: "Cappadocians are scholars of death and the afterlife, now part of the Hecata.",
    image: cappadocian,
  },
  {
    name: "Daughters of Cacophony",
    description: "Daughters of Cacophony are musical vampires, often artists and performers.",
    image: DaughtersofCacophony,
  },
  {
    name: "Gangrel",
    description: "Gangrel are feral and bestial vampires, closely tied to nature.",
    image: gangrel,
  },
  {
    name: "Gargoyle",
    description: "Gargoyles are created by Tremere as guardians, often loyal but tragic figures.",
    image: gargoyle,
  },
  {
    name: "Giovanni",
    description: "Giovanni are wealthy bankers and necromancers, dealing with the dead.",
    image: giovanni,
  },
  {
    name: "Hecata",
    description: "Hecata is a family of clans that includes Cappadocians, Giovanni, and others focused on death.",
    image: hacata,
  },
  {
    name: "Kiasyd",
    description: "Kiasyd are a rare clan with ties to fae magic and vampiric bloodlines.",
    image: kiasyd,
  },
  {
    name: "Lamia",
    description: "Lamia are seductive vampires with ties to ancient myths and legends.",
    image: lamia,
  },
  {
    name: "Lasombra",
    description: "Lasombra are shadowy manipulators, often leaders within the Sabbat.",
    image: lasombra,
  },
  {
    name: "Lhiannan",
    description:
    "Lhiannan are a clan of Celtic vampires, often associated with ancient traditions and nature.",
    image: lhianna,
  },
  {    name: "Maeghar",
    description: "Maeghar are a clan of vampires with ties to the ancient and mystical, often seen as guardians of secrets.",
    image: maeghar,
  },
  {    name: "Malkavian",
    description: "Malkavians are known for their madness and insight, often seeing the world in unique ways.",
    image: malkavian,
  },
  {
    name: "Ministry",
    description: "Ministry, formerly known as Followers of Set, are seductive and manipulative vampires with ties to ancient Egyptian mythology.",
    image: ministry,
  },
  {
    name: "Nosferatu",
    description: "Nosferatu are hideous and secretive vampires, often serving as information brokers.",
    image: nosferatu,
  },
  {
    name: "Nagaraja",
    description: "Nagaraja are a clan of vampires who consume flesh and bone, often associated with death and decay.",
    image: nagaraja,
  },
  {
    name: "Ravnos",
    description: "Ravnos are tricksters and illusionists, often seen as wanderers and nomads.",
    image: ravnos,
  },
  {
    name: "Salubri",
    description: "Salubri are healers and warriors, often misunderstood and persecuted by other clans.",
    image: salubri,
  },
  {
    name: "Samedi",
    description: "Samedi are a clan of undead vampires, often associated with voodoo and the undead.",
    image: samedi,
  },
  {
    name: "Toreador",
    description: "Toreador are artistic and passionate vampires, often drawn to beauty and creativity.",
    image: toreador,
  },
  {
    name: "True Brujah",
    description: "True Brujah are a sect of the Brujah clan, known for their mastery of time and their philosophical pursuits.",
    image: truebruja,
  },
  {
    name: "Tzimisce",
    description: "Tzimisce are ancient and powerful vampires, often associated with the Sabbat and known for their mastery of fleshcrafting.",
    image: tzimisce,
  },
  // ...add more clans as needed...
];

// Example disciplines (add more as needed)
const disciplines = [
  {
    name: "Animalism",
    description: "Allows communication and control over animals, and can tap into the beast within.",
  },
  {
    name: "Auspex",
    description: "Heightened senses, telepathy, and the ability to perceive auras.",
  },
  {
    name: "Celerity",
    description: "Supernatural speed and reflexes.",
  },
  {
    name: "Dominate",
    description: "Mind control and the ability to bend others to your will.",
  },
  {
    name: "Fortitude",
    description: "Supernatural resilience and toughness.",
  },
  {
    name: "Obfuscate",
    description: "The power to remain hidden or appear as someone else.",
  },
  // ...add more disciplines as needed...
];

// Example discipline powers (expand as needed)
const disciplinePowers: Record<string, { level: number; name: string }[]> = {
  Animalism: [
    { level: 1, name: "Sense the Beast" },
    { level: 2, name: "Feral Whispers" },
    { level: 3, name: "Animal Succulence" },
    // ...add more...
  ],
  Auspex: [
    { level: 1, name: "Heightened Senses" },
    { level: 1, name: "Sense the Unseen" },
    { level: 2, name: "Premonition" },
    { level: 3, name: "Scry the Soul" },
    // ...add more...
  ],
  Celerity: [
    { level: 1, name: "Cat's Grace" },
    { level: 2, name: "Rapid Reflexes" },
    // ...add more...
  ],
  // ...add more disciplines and their powers...
};

import { defineConfig } from 'vite';

const appElement = document.getElementById('app');
if (appElement) {
  appElement.innerHTML = `
    <div class="container">
      <div class="panel panel-left">
        <h2>Character Details</h2>
        <label>Player Name:<input type="text" id="playerName" /></label>
        <label>Character Name:<input type="text" id="characterName" /></label>
        <label>Chronicle:<input type="text" id="chronicle" /></label>
      </div>
      <div class="panel panel-right" style="min-width: 480px; flex: 1;">
        <h2>Sect Selection</h2>
        <label for="sectSelect">Sect:</label>
        <select id="sectSelect">
          ${sects.map((sect, i) => `<option value="${i}">${sect.name}</option>`).join('')}
        </select>
        <div id="sectInfo">
          <div class="sect-image" id="sectImage" style="background-image: url('${sects[0].image}')"></div>
          <div class="sect-description" id="sectDescription">${sects[0].description}</div>
        </div>
        <div class="panel panel-clan" style="margin-top: 2rem;">
          <h2>Clan Selection</h2>
          <label for="clanSelect">Clan:</label>
          <select id="clanSelect">
            ${clans.map((clan, i) => `<option value="${i}">${clan.name}</option>`).join('')}
          </select>
          <div id="clanInfo">
            <div class="sect-image" id="clanImage" style="background-image: url('${clans[0].image}')"></div>
            <div class="sect-description" id="clanDescription">${clans[0].description}</div>
          </div>
        </div>
      </div>
      <div class="panel panel-discipline" style="margin-left: 2rem;">
        <h2>Discipline Selection</h2>
        <label for="disciplineSelect">Disciplines (choose up to 5):</label>
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
      </div>
    </div>
  `;

  // Fix: Use unique IDs for sect and clan elements to avoid querySelector conflicts
  const sectSelect = document.getElementById('sectSelect') as HTMLSelectElement;
  const sectDescription = document.getElementById('sectDescription') as HTMLElement;
  const sectImage = document.getElementById('sectImage') as HTMLElement;

  sectSelect.addEventListener('change', (e) => {
    const idx = parseInt((e.target as HTMLSelectElement).value, 10);
    sectDescription.textContent = sects[idx].description;
    sectImage.style.backgroundImage = `url('${sects[idx].image}')`;
  });

  const clanSelect = document.getElementById('clanSelect') as HTMLSelectElement;
  const clanDescription = document.getElementById('clanDescription') as HTMLElement;
  const clanImage = document.getElementById('clanImage') as HTMLElement;

  clanSelect.addEventListener('change', (e) => {
    const idx = parseInt((e.target as HTMLSelectElement).value, 10);
    clanDescription.textContent = clans[idx].description;
    clanImage.style.backgroundImage = `url('${clans[idx].image}')`;
  });

  const disciplineSelect = document.getElementById('disciplineSelect') as HTMLSelectElement;
  const disciplineDescription = document.getElementById('disciplineDescription') as HTMLElement;
  const collectedDisciplines = document.getElementById('collectedDisciplines') as HTMLUListElement;
  const addDisciplineBtn = document.getElementById('addDisciplineBtn') as HTMLButtonElement;

  // Store collected discipline indices and their levels
  let collected: { idx: number; level: number }[] = [];

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
}
