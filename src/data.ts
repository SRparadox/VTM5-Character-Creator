import * as camarilla from './sect_images/Camarilla.png?url';
import * as sabbat from './sect_images/Sabbat.png?url';
import * as anarch from './sect_images/Anarch.png?url';
import * as independent from './sect_images/Independent.png?url';
import * as brujah from './clan_images/Brujah.png?url';
import * as tremere from './clan_images/Tremere.png?url';
import * as ventrue from './clan_images/Ventrue.png?url';
import * as baali from './clan_images/Baali.png?url';
import * as BanuHaqim from './clan_images/BanuHaqim.png?url';
import * as caitiff from './clan_images/Caitiff.png?url';
import * as cappadocian from './clan_images/Cappadocian.png?url';
import * as DaughtersofCacophony from './clan_images/DaughtersofCacophony.png?url';
import * as gangrel from './clan_images/Gangrel.png?url';
import * as gargoyle from './clan_images/Gargoyles.png?url';
import * as giovanni from './clan_images/Giovanni.png?url';
import * as hacata from './clan_images/Hecata.png?url';
import * as kiasyd from './clan_images/Kiasyd.png?url';
import * as lamia from './clan_images/Lamia.png?url';
import * as lasombra from './clan_images/Lasombra.png?url';
import * as lhianna from './clan_images/Lhiannan.png?url';
import * as maeghar from './clan_images/Maeghar.png?url';
import * as malkavian from './clan_images/Malkavian.png?url';
import * as ministry from './clan_images/Ministry.png?url';
import * as nosferatu from './clan_images/Nosferatu.png?url';
import * as nagaraja from './clan_images/Nagaraja.png?url';
import * as ravnos from './clan_images/Ravnos.png?url';
import * as salubri from './clan_images/Salubri.png?url';
import * as samedi from './clan_images/Samedi.png?url';
import * as toreador from './clan_images/Toreador.png?url';
import * as truebruja from './clan_images/TrueBrujah.png?url';
import * as tzimisce from './clan_images/Tzimisce.png?url';

// Add discipline images (if you want to use them in the future)
// import * as animalismImg from './discipline_images/Animalism.png?url';
// import * as auspexImg from './discipline_images/Auspex.png?url';
// ...etc...

export const sects = [
  { name: "Camarilla", description: "The Camarilla is a secret society of vampires dedicated to maintaining the Masquerade.", image: camarilla.default },
  { name: "Sabbat", description: "The Sabbat opposes the Camarilla and embraces their vampiric nature.", image: sabbat.default },
  { name: "Anarch", description: "The Anarchs reject the authority of the Camarilla and Sabbat.", image: anarch.default },
  { name: "Independent", description: "Independent vampires operate outside the major sects, often pursuing their own agendas.", image: independent.default },
  { name: "Hecata", description: "Hecata is a family of clans that includes Cappadocians, Giovanni, and others focused on death.", image: hacata.default },
];

export const sectClans: Record<string, string> = {
  Camarilla: "Brujah (formerly), Malkavian, Nosferatu, Toreador, Tremere, Ventrue, Gangrel (formerly), Banu Haqim (recently)",
  Sabbat: "Lasombra (formerly), Tzimisce, antitribu of other clans, Serpents of the Light, Harbingers of Skulls, and others",
  Anarch: "Brujah, Caitiff, Gangrel, Malkavian, Nosferatu, Toreador, Tzimisce (recently), Ventrue, and various bloodlines",
  Independent: "Assamite (Banu Haqim), Giovanni, Ravnos, Setite (Ministry), Salubri, and others",
  Hecata: "Giovanni, Cappadocian, Harbingers of Skulls, Samedi, Lamia, Nagaraja, and other Hecata bloodlines"
};

export const clans = [
  { name: "Brujah", description: "Brujah are passionate rebels, iconoclasts, and warriors.", image: brujah.default },
  { name: "Tremere", description: "Tremere are secretive sorcerers, masters of blood magic.", image: tremere.default },
  { name: "Ventrue", description: "Ventrue are aristocratic leaders, rulers, and organizers.", image: ventrue.default },
  { name: "Baali", description: "Baali are demonic vampires, often associated with dark rituals and infernal powers.", image: baali.default },
  { name: "Banu Haqim", description: "Banu Haqim are fierce warriors and assassins, formerly known as Assamites.", image: BanuHaqim.default },
  { name: "Caitiff", description: "Caitiff are clanless vampires, often marginalized by other clans.", image: caitiff.default },
  { name: "Cappadocian/Harbengers of Skulls", description: "Cappadocians are scholars of death and the afterlife, now part of the Hecata.", image: cappadocian.default },
  { name: "Daughters of Cacophony", description: "Daughters of Cacophony are musical vampires, often artists and performers.", image: DaughtersofCacophony.default },
  { name: "Gangrel", description: "Gangrel are feral and bestial vampires, closely tied to nature.", image: gangrel.default },
  { name: "Gargoyle", description: "Gargoyles are created by Tremere as guardians, often loyal but tragic figures.", image: gargoyle.default },
  { name: "Giovanni", description: "Giovanni are wealthy bankers and necromancers, dealing with the dead.", image: giovanni.default },
  { name: "Kiasyd", description: "Kiasyd are a rare clan with ties to fae magic and vampiric bloodlines.", image: kiasyd.default },
  { name: "Lamia", description: "Lamia are seductive vampires with ties to ancient myths and legends.", image: lamia.default },
  { name: "Lasombra", description: "Lasombra are shadowy manipulators, often leaders within the Sabbat.", image: lasombra.default },
  { name: "Lhiannan", description: "Lhiannan are a clan of Celtic vampires, often associated with ancient traditions and nature.", image: lhianna.default },
  { name: "Maeghar", description: "Maeghar are a clan of vampires with ties to the ancient and mystical, often seen as guardians of secrets.", image: maeghar.default },
  { name: "Malkavian", description: "Malkavians are known for their madness and insight, often seeing the world in unique ways.", image: malkavian.default },
  { name: "Ministry", description: "Ministry, formerly known as Followers of Set, are seductive and manipulative vampires with ties to ancient Egyptian mythology.", image: ministry.default },
  { name: "Nosferatu", description: "Nosferatu are hideous and secretive vampires, often serving as information brokers.", image: nosferatu.default },
  { name: "Nagaraja", description: "Nagaraja are a clan of vampires who consume flesh and bone, often associated with death and decay.", image: nagaraja.default },
  { name: "Ravnos", description: "Ravnos are tricksters and illusionists, often seen as wanderers and nomads.", image: ravnos.default },
  { name: "Salubri", description: "Salubri are healers and warriors, often misunderstood and persecuted by other clans.", image: salubri.default },
  { name: "Samedi", description: "Samedi are a clan of undead vampires, often associated with voodoo and the undead.", image: samedi.default },
  { name: "Toreador", description: "Toreador are artistic and passionate vampires, often drawn to beauty and creativity.", image: toreador.default },
  { name: "True Brujah", description: "True Brujah are a sect of the Brujah clan, known for their mastery of time and their philosophical pursuits.", image: truebruja.default },
  { name: "Tzimisce", description: "Tzimisce are ancient and powerful vampires, often associated with the Sabbat and known for their mastery of fleshcrafting.", image: tzimisce.default },
  // ...add more clans as needed...
];

export const disciplines = [
  { name: "Animalism", description: "Allows communication and control over animals, and can tap into the beast within." },
  { name: "Auspex", description: "Heightened senses, telepathy, and the ability to perceive auras." },
  { name: "Celerity", description: "Supernatural speed and reflexes." },
  { name: "Dominate", description: "Mind control and the ability to bend others to your will." },
  { name: "Fortitude", description: "Supernatural resilience and toughness." },
  { name: "Obfuscate", description: "The power to remain hidden or appear as someone else." },
  { name: "Potence", description: "Supernatural strength and physical power." },
  { name: "Presence", description: "Supernatural charisma and the ability to inspire or terrify." },
  { name: "Protean", description: "Shape-shifting and animalistic powers." },
  { name: "Blood Sorcery", description: "Magical manipulation of vitae, including Thaumaturgy and related arts." },
  { name: "Oblivion", description: "Necromantic and shadow-based powers." },
  { name: "Thin-Blood Alchemy", description: "Alchemy unique to thin-blooded vampires." },
  { name: "Vicissitude", description: "Fleshcrafting and body manipulation." },
  { name: "Dementation", description: "Powers of madness and insight." },
  { name: "Melpominee", description: "Supernatural vocal powers, unique to Daughters of Cacophony." },
  { name: "Mytherceria", description: "Fae-related powers, unique to Kiasyd." },
  { name: "Necromancy", description: "Death magic, practiced by Giovanni and Hecata." },
  { name: "Obeah", description: "Healing and spiritual powers, unique to Salubri." },
  { name: "Quietus", description: "Assassin's arts, unique to Banu Haqim." },
  { name: "Serpentis", description: "Serpentine powers, unique to Ministry/Setites." },
  { name: "Temporis", description: "Time manipulation, unique to True Brujah." },
  { name: "Valeren", description: "Warrior and healer powers, unique to Salubri." },
  { name: "Chimerstry", description: "Illusions, unique to Ravnos." },
  // ...existing disciplines, add more if you have more PNGs...
];

// Add empty or sample powers for new disciplines if not already present
export const disciplinePowers: Record<string, { level: number; name: string }[]> = {
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
  Dominate: [],
  Fortitude: [],
  Obfuscate: [],
  Potence: [],
  Presence: [],
  Protean: [],
  "Blood Sorcery": [],
  Oblivion: [],
  "Thin-Blood Alchemy": [],
  Vicissitude: [],
  Dementation: [],
  Melpominee: [],
  Mytherceria: [],
  Necromancy: [],
  Obeah: [],
  Quietus: [],
  Serpentis: [],
  Temporis: [],
  Valeren: [],
  Chimerstry: [],
  // ...add more as needed...
};

export const clanInfo: Record<string, {
  disciplines: string;
  compulsion: string;
  bane: string;
  variantBane?: string;
}> = {
  // ...existing code from main.ts for clanInfo...
  // (copy the entire clanInfo object here)
  Brujah: {
    disciplines: "Celerity, Potence, Presence",
    compulsion: "Rebellion: Must resist authority or act out against control.",
    bane: "Short Temper: Difficulty resisting frenzy.",
    variantBane: "N/A"
  },
  // ...rest of clanInfo...
  Toreador: {
    disciplines: "Auspex, Celerity, Presence",
    compulsion: "Obsession: Must indulge in beauty or art.",
    bane: "Enraptured: Easily distracted by beauty.",
    variantBane: "N/A"
  },
  "True Brujah": {
    disciplines: "Potence, Presence, Temporis",
    compulsion: "Detachment: Must act with cold logic.",
    bane: "Emotionless: Difficulty feeling or expressing emotion.",
    variantBane: "N/A"
  },
  Tzimisce: {
    disciplines: "Animalism, Auspex, Vicissitude",
    compulsion: "Perfection: Must reshape or improve something.",
    bane: "Earthbound: Must sleep in native soil.",
    variantBane: "N/A"
  }
  // ...add more as needed...
};

export const archetypes = [
  { name: "Architect", description: "You build for the future, seeking to create something of lasting value." },
  { name: "Bon Vivant", description: "You seek pleasure and excitement in all things." },
  { name: "Bravo", description: "You are a bully and a braggart, intimidating others to get your way." },
  { name: "Caregiver", description: "You nurture and protect others, often at your own expense." },
  { name: "Child", description: "You are innocent, dependent, and seek protection from others." },
  { name: "Competitor", description: "You must be the best, and you thrive on rivalry." },
  { name: "Conformist", description: "You follow the lead of others and seek to belong." },
  { name: "Conniver", description: "You manipulate others for your own benefit." },
  { name: "Curmudgeon", description: "You are always dissatisfied and find fault in everything." },
  { name: "Deviant", description: "You reject the status quo and revel in being different." },
  { name: "Director", description: "You take charge and organize others to achieve your goals." },
  { name: "Fanatic", description: "You are driven by a cause and will stop at nothing to achieve it." },
  { name: "Gallant", description: "You seek attention and admiration, often through flamboyant behavior." },
  { name: "Judge", description: "You seek fairness and truth, acting as an arbiter in disputes." },
  { name: "Loner", description: "You prefer solitude and self-reliance." },
  { name: "Martyr", description: "You sacrifice yourself for others or for a cause." },
  { name: "Masochist", description: "You seek suffering, pain, or humiliation." },
  { name: "Monster", description: "You embrace your darker nature and revel in being feared." },
  { name: "Rebel", description: "You resist authority and challenge the rules." },
  { name: "Rogue", description: "You are a charming scoundrel, living by your wits." },
  { name: "Survivor", description: "You endure adversity and always find a way to persevere." },
  { name: "Thrill-Seeker", description: "You crave excitement and danger." },
  { name: "Traditionalist", description: "You respect tradition and resist change." },
  { name: "Visionary", description: "You are inspired by dreams and ideas, always looking to the future." },
  // ...add more as needed...
];

export const predatorTypes = [
  {
    name: "Alleycat",
    description: "You hunt by stalking and overpowering victims, often using violence or intimidation."
  },
  {
    name: "Bagger",
    description: "You prefer to feed from blood bags or hospital supplies, avoiding direct predation."
  },
  {
    name: "Blood Leech",
    description: "You prey on other vampires, drinking the blood of your own kind."
  },
  {
    name: "Cleaver",
    description: "You maintain ties to a mortal family and feed from them, risking emotional attachment."
  },
  {
    name: "Consensualist",
    description: "You only feed from willing victims, seeking consent before taking blood."
  },
  {
    name: "Farmer",
    description: "You feed exclusively on animals, avoiding human blood whenever possible."
  },
  {
    name: "Osiris",
    description: "You are a celebrity among mortals, feeding from adoring fans or followers."
  },
  {
    name: "Sandman",
    description: "You feed from sleeping victims, entering homes at night to take blood unnoticed."
  },
  {
    name: "Scene Queen",
    description: "You hunt in clubs, parties, and social gatherings, blending into nightlife."
  },
  {
    name: "Siren",
    description: "You seduce your victims, using charm and allure to feed."
  }
];
