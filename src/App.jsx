import React, { useEffect, useRef, useState } from 'react';
import './App.css';

// Exact Color Scheme
const colors = {
  almostBlack: '#020403',      // Main background
  darkForest: '#07100B',       // Atmospheric backgrounds
  deepGreen: '#0A100B',        // Containers and subtle lighting
  mutedMoss: '#68765B',        // Green accents
  fogGray: '#92988A',          // Body text
  distressedGray: '#626B60',   // Secondary text
  darkBloodRed: '#8B2925'      // Warning details and highlights
};

const navTabs = [
  { id: 'design', label: '01 · Game Design' },
  { id: 'technical', label: '02 · Technical & Styling' },
  { id: 'trailer', label: '03 · Gameplay Trailer' },
  { id: 'record', label: '04 · Team & Record' },
  { id: 'palette', label: 'Theme Palette' }
];

const actsData = [
  {
    act: "Act 1",
    title: "The House Scene",
    desc: "The protagonist wakes up tired and hungry, checks the fridge, cooks bacon and eggs, and watches TV until a breaking news report announces a fatal hit-and-run at Jojo's Gas Station—where they work. Shaken, they lock up and go to sleep."
  },
  {
    act: "Act 2",
    title: "Gas Station - Shift 1",
    desc: "Billy hands over the messy shift. The player cleans the floor with a mop, interacts with Steve (buying Coke), avoids restocking due to laziness, talks to Melia (who gives a chilling warning about the previous missing clerk), and encounters Junk (the eccentric vagrant) behind the stockroom."
  },
  {
    act: "Act 3",
    title: "The Thunderstorm (House)",
    desc: "Waking up to a fierce thunderstorm, someone knocks on the door. Refusing to let the stranger in, the player goes to wash up as a brownout strikes. After calling the manager, they are offered 2x bonus salary to brave the storm. A window shatters, revealing an Aswang outside (which turns out to be an injured pigeon hitting the glass)."
  },
  {
    act: "Act 4",
    title: "Gas Station - Shift 2 & Descent",
    desc: "Returning to the station, the player stocks shelves, assists Steve and John (who goes to the restroom), and encounters Melia speaking demonic language. Discovering John murdered in a pool of blood, the player calls 911, follows bloody footprints into the stockroom, gets locked inside, and faces a terrifying Aswang jumpscare that possesses them."
  },
  {
    act: "Act 5",
    title: "Awakening & The Twist",
    desc: "The player wakes up in bed thinking it was a nightmare. Walking into the living room, the lights flicker for a final jumpscare—revealing the devastating truth."
  }
];

const charactersData = [
  { name: "Protagonist (Player)", role: "Night-Shift Clerk", desc: "Exhausted and pragmatic; unaware they are already dead, serving as the lens for this purgatorial loop." },
  { name: "Billy", role: "Day/Evening Clerk", desc: "Careless coworker who leaves the store messy and abandons his post during the storm." },
  { name: "Steve", role: "Regular Customer", desc: "Friendly local who buys soda and chips, grounding the player in a false sense of normalcy." },
  { name: "Melia", role: "Mysterious Customer", desc: "Foreshadows the disappearance of the previous clerk before speaking in demonic tongues." },
  { name: "Junk", role: "Vagrant", desc: "Eccentric local found behind the dumpster asking about wet socks." },
  { name: "John", role: "Customer / Victim", desc: "Asks to use the restroom in Act 4; his brutal murder triggers the supernatural climax." },
  { name: "The Aswang", role: "Supernatural Entity", desc: "Mythological monster stalking the station during lightning storms and possessing the player." }
];

const teamData = [
  { name: "Emmanuel Levinne Tecson", role: "Game Development and Programming", desc: "Contributed to the development of the game's mechanics and interactions. Helped implement player movement and gameplay features. Assisted in integrating game elements and functionality." },
  { name: "Adrianne Sindian", role: "Game Design and Environment Development", desc: "Helped design the gas station environment and surrounding areas. Contributed to the arrangement of objects and interactive elements. Assisted in creating the game's overall atmosphere." },
  { name: "Aliyah Othelia Piel", role: "Story Development and Creative Direction", desc: "Contributed to the game's storyline, scenes, and character concepts. Helped develop the horror elements and unexpected events. Assisted in maintaining the game's suspenseful atmosphere." },
  { name: "Aiza Palin", role: "Website Development and UI Design", desc: "Developed the game's promotional website using React, Vite, and TypeScript. Designed the website's layout, color scheme, and visual presentation. Organized the game information, gallery, and team section." },
  { name: "Glessly Aguilar", role: "Game Assets and Visual Design", desc: "Helped prepare and organize visual assets used in the game. Contributed to the game's environment details and visual elements. Assisted in maintaining the horror theme and visual consistency." },
  { name: "Ryan Jacob Solomon", role: "Game Testing and Gameplay Support", desc: "Assisted in testing the game's mechanics and interactions. Helped identify bugs, errors, and areas that needed improvement. Contributed feedback to improve the gameplay experience." }
];

const paletteSwatches = [
  { name: 'Almost Black', hex: colors.almostBlack, desc: 'Main background' },
  { name: 'Dark Forest', hex: colors.darkForest, desc: 'Atmospheric backgrounds' },
  { name: 'Deep Green', hex: colors.deepGreen, desc: 'Containers and subtle lighting' },
  { name: 'Muted Moss', hex: colors.mutedMoss, desc: 'Green accents' },
  { name: 'Fog Gray', hex: colors.fogGray, desc: 'Body text' },
  { name: 'Distressed Gray', hex: colors.distressedGray, desc: 'Secondary text' },
  { name: 'Dark Blood Red', hex: colors.darkBloodRed, desc: 'Warning details and highlights' }
];

const actFilters = ['all', 'act 1', 'act 2', 'act 3', 'act 4', 'act 5'];

export default function App() {
  const [activeTab, setActiveTab] = useState('design');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAct, setSelectedAct] = useState('all');
  const [plotTwistRevealed, setPlotTwistRevealed] = useState(false);
  const [activeMap, setActiveMap] = useState('home');
  const [copiedColor, setCopiedColor] = useState(null);

  const navRef = useRef(null);
  const tabButtonRefs = useRef({});
  const copyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (navRef.current) {
      const navTop = navRef.current.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY > navTop) {
        window.scrollTo({ top: navTop, behavior: 'smooth' });
      }
    }
  };

  const handleTabKeyDown = (event, currentIndex) => {
    let nextIndex = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % navTabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + navTabs.length) % navTabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = navTabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const nextTab = navTabs[nextIndex];
      handleTabChange(nextTab.id);
      tabButtonRefs.current[nextTab.id]?.focus();
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredActs = selectedAct === 'all'
    ? actsData
    : actsData.filter((a) => a.act.toLowerCase() === selectedAct);

  const filteredCharacters = charactersData.filter((c) =>
    c.name.toLowerCase().includes(normalizedSearch) ||
    c.role.toLowerCase().includes(normalizedSearch) ||
    c.desc.toLowerCase().includes(normalizedSearch)
  );

  const copyColorCode = (hex) => {
    const triggerCopiedFeedback = () => {
      setCopiedColor(hex);
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => setCopiedColor(null), 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hex).then(triggerCopiedFeedback).catch(() => {
        const tempInput = document.createElement('textarea');
        tempInput.value = hex;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        triggerCopiedFeedback();
      });
    } else {
      triggerCopiedFeedback();
    }
  };

  return (
    <div className="app-shell inter-font">
      {/* Top Header */}
      <header className="site-header">
        <div className="header-inner">
          <span className="header-badge mono-font">
            IT306 – Game Development Final Project (Documentation &amp; Trailer)
          </span>
          <h1 className="site-title cinzel-font">
            Nightshift: Jojo&apos;s Gas Station
          </h1>
          <p className="site-subtitle inter-font">
            A psychological horror and job simulation game exploring the blurred lines between reality, guilt, and the afterlife.
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav ref={navRef} className="site-nav mono-font" aria-label="Documentation sections">
        <div className="nav-inner" role="tablist">
          {navTabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabButtonRefs.current[tab.id] = el;
                }}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                className={`nav-tab${isActive ? ' is-active' : ''}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Container */}
      <main className="main-content">
        {/* TAB 1: GAME DESIGN */}
        {activeTab === 'design' && (
          <div
            id="panel-design"
            role="tabpanel"
            aria-labelledby="tab-design"
            className="tab-panel"
          >
            <section className="doc-section">
              <h2 className="section-heading cinzel-font">
                Concept, Genre &amp; Target Players
              </h2>
              <div className="spec-grid">
                <p className="spec-card">
                  <strong>Genre:</strong> First-Person Psychological Horror / Job Simulation / Narrative Mystery
                </p>
                <p className="spec-card">
                  <strong>Core Concept:</strong> Inspired by indie atmospheric horror and Filipino folklore (Aswang), players perform mundane retail tasks that slowly devolve into supernatural dread.
                </p>
                <p className="spec-card">
                  <strong>Target Audience:</strong> Horror enthusiasts, narrative-driven walking simulator fans, and players aged 16+.
                </p>
              </div>
            </section>

            {/* Storyline & Acts Filter */}
            <section className="doc-section">
              <div className="section-header-bar">
                <h2 className="section-heading cinzel-font">Full Storyline &amp; Acts</h2>
                <div className="filter-group mono-font" role="group" aria-label="Filter storyline acts">
                  {actFilters.map((actKey) => {
                    const isSelected = selectedAct === actKey;
                    return (
                      <button
                        key={actKey}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedAct(actKey)}
                        className={`filter-btn${isSelected ? ' is-active' : ''}`}
                      >
                        {actKey}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="acts-list">
                {filteredActs.map((item) => (
                  <article key={item.act} className="act-card">
                    <span className="act-eyebrow mono-font">{item.act}</span>
                    <h3 className="act-title cinzel-font">{item.title}</h3>
                    <p className="act-desc">{item.desc}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Plot Twist Section */}
            <section className="doc-section spoiler-section">
              <h2 className="spoiler-title cinzel-font">The Narrative Plot Twist</h2>
              {!plotTwistRevealed ? (
                <div>
                  <p className="spoiler-intro">
                    The game features a major psychological revelation at the climax that reframes the entire narrative.
                  </p>
                  <button
                    type="button"
                    className="spoiler-btn mono-font"
                    onClick={() => setPlotTwistRevealed(true)}
                  >
                    Reveal Plot Twist Spoiler
                  </button>
                </div>
              ) : (
                <div className="spoiler-reveal">
                  <p className="spoiler-reveal-label mono-font">THE FINAL REVEAL:</p>
                  <p className="spoiler-reveal-text">
                    The victim killed in the hit-and-run on the Act 1 Breaking News broadcast{' '}
                    <strong>was the protagonist all along</strong>. Having died before the game even began, every shift, customer interaction, and supernatural encounter was a purgatorial hallucination trapped inside the protagonist&apos;s fading afterlife.
                  </p>
                </div>
              )}
            </section>

            {/* Character Profiles with Search */}
            <section className="doc-section">
              <div className="section-header-bar">
                <h2 className="section-heading cinzel-font">Character Profiles</h2>
                <div className="search-wrapper">
                  <input
                    className="search-input mono-font"
                    type="text"
                    aria-label="Search characters"
                    placeholder="Search characters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="search-clear"
                      aria-label="Clear search"
                      onClick={() => setSearchTerm('')}
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
              <div className="card-grid">
                {filteredCharacters.map((char) => (
                  <article key={char.name} className="dossier-card">
                    <h3 className="dossier-card-name cinzel-font">{char.name}</h3>
                    <span className="dossier-card-role mono-font">{char.role}</span>
                    <p className="dossier-card-desc">{char.desc}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Interactive Level Maps */}
            <section className="doc-section">
              <h2 className="section-heading cinzel-font">
                Level Design &amp; Environments
              </h2>
              <div className="map-tabs mono-font" role="tablist" aria-label="Environment maps">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeMap === 'home'}
                  onClick={() => setActiveMap('home')}
                  className={`map-tab-btn${activeMap === 'home' ? ' is-active' : ''}`}
                >
                  Map 01: Residence
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeMap === 'station'}
                  onClick={() => setActiveMap('station')}
                  className={`map-tab-btn${activeMap === 'station' ? ' is-active' : ''}`}
                >
                  Map 02: Jojo&apos;s Gas Station
                </button>
              </div>
              <div className="map-panel" role="tabpanel" key={activeMap}>
                {activeMap === 'home' ? (
                  <div>
                    <h3 className="map-panel-title cinzel-font">The Protagonist&apos;s House (Acts 1, 3, 5)</h3>
                    <p className="map-panel-desc">
                      Features kitchen (fridge/stove), living room (TV &amp; front window where the pigeon and Aswang appear), bathroom (mirror &amp; sink for the brownout sequence), and bedroom.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="map-panel-title cinzel-font">Jojo&apos;s Gas Station (Acts 2 &amp; 4)</h3>
                    <p className="map-panel-desc">
                      Features main convenience retail floor, checkout counter, public restroom (where John is found), back stockroom (mop, trash, inventory boxes), and rear alley dumpster.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: TECHNICAL & TYPOGRAPHY STYLING */}
        {activeTab === 'technical' && (
          <div
            id="panel-technical"
            role="tabpanel"
            aria-labelledby="tab-technical"
            className="tab-panel"
          >
            <section className="doc-section">
              <h2 className="section-heading cinzel-font">
                Engine, Version &amp; Typography Standards
              </h2>
              <ul className="tech-list">
                <li className="tech-item">
                  <strong>Game Engine:</strong> Unity 2022.3 LTS
                </li>
                <li className="tech-item">
                  <strong>Scripting Language:</strong> C#
                </li>
                <li className="tech-item">
                  <strong>Website Stack:</strong> React, Vite, and TypeScript
                </li>
                <li className="tech-item">
                  <strong>Cinzel Font:</strong> Used for headings, logo, and titles to create a mysterious, classic horror feel.
                </li>
                <li className="tech-item">
                  <strong>Share Tech Mono:</strong> Used for navigation, descriptions, labels, buttons, and VHS/terminal elements for a retro-tech aesthetic.
                </li>
                <li className="tech-item">
                  <strong>Inter Font:</strong> Used as the base font for general text and readability.
                </li>
              </ul>
            </section>

            <section className="doc-section">
              <h2 className="section-heading cinzel-font">
                Project &amp; Script Structure
              </h2>
              <pre className="code-tree mono-font">
{`Nightshift-Jojos-Gas-Station/
├── Assets/
│   ├── Audio/          # Rain, thunder, POS beeps, demonic whispers
│   ├── Materials/      # Glass shatter, blood decals, wet shaders
│   ├── Models/         # Gas station props, GoChips, Snickers, mop
│   ├── Scenes/         # MainMenu, Act1_House, Act2_Gas, Act3_Storm, Act4_Night2, Act5_Ending
│   └── Scripts/
│       ├── Player/     # FirstPersonController.cs, InteractionRaycaster.cs
│       ├── Systems/    # DialogueManager.cs, CheckoutScanner.cs, TaskTracker.cs
│       └── Events/     # JumpscareTrigger.cs, ActTransitionManager.cs`}
              </pre>
            </section>

            <section className="doc-section">
              <h2 className="section-heading cinzel-font">
                Build &amp; Repository Info
              </h2>
              <div className="kv-card">
                <p className="kv-row">
                  <strong>Course Code:</strong>
                  <span>IT306 – Game Development</span>
                </p>
                <p className="kv-row">
                  <strong>GitHub Repository:</strong>
                  <span>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="doc-link"
                    >
                      github.com/le-em/nightshift-jojos-gas-station
                    </a>
                  </span>
                </p>
                <p className="kv-row">
                  <strong>Known Limitations:</strong>
                  <span>Minor physics jitter when dropping stock boxes onto the cashier counter; subtitle timing requires fine-tuning during rapid dialogue triggers.</span>
                </p>
              </div>
            </section>
          </div>
        )}

        {/* TAB 3: GAMEPLAY TRAILER */}
        {activeTab === 'trailer' && (
          <div
            id="panel-trailer"
            role="tabpanel"
            aria-labelledby="tab-trailer"
            className="tab-panel"
          >
            <section className="doc-section">
              <h2 className="section-heading cinzel-font">
                Official Gameplay Trailer
              </h2>
              <div className="trailer-card">
                <p className="trailer-intro">
                  Watch the official promotional and gameplay walkthrough trailer for{' '}
                  <strong>Nightshift: Jojo&apos;s Gas Station</strong>:
                </p>

                <div className="video-frame">
                  <video
                    className="video-player"
                    controls
                    playsInline
                    preload="metadata"
                    aria-label="Nightshift: Jojo's Gas Station Gameplay Trailer"
                  >
                    <source src={`${import.meta.env.BASE_URL}1119(1).mp4`} type="video/mp4" />
                  </video>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: TEAM & RECORD */}
        {activeTab === 'record' && (
          <div
            id="panel-record"
            role="tabpanel"
            aria-labelledby="tab-record"
            className="tab-panel"
          >
            <section className="doc-section">
              <h2 className="section-heading cinzel-font">
                Team Members &amp; Contributions (IT306)
              </h2>
              <div className="card-grid">
                {teamData.map((member) => (
                  <article key={member.name} className="dossier-card dossier-card--team">
                    <h3 className="dossier-card-name cinzel-font">{member.name}</h3>
                    <span className="dossier-card-role mono-font">{member.role}</span>
                    <p className="dossier-card-desc">{member.desc}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="doc-section">
              <h2 className="section-heading cinzel-font">
                Version History / Changelog
              </h2>
              <div className="changelog-card">
                <div className="changelog-list">
                  <p className="changelog-item changelog-item--latest">
                    <strong>v1.0.0 (Final Release):</strong> Integrated Acts 1–5, complete audio mixing, plot-twist ending sequence, and UI polish.
                  </p>
                  <p className="changelog-item">
                    <strong>v0.3.0:</strong> Added brownout mechanics, candle lighting, thunderstorm audio, and jumpscare triggers.
                  </p>
                  <p className="changelog-item">
                    <strong>v0.2.0:</strong> Implemented POS scanning, mopping/trash mechanics, and NPC dialogue trees.
                  </p>
                  <p className="changelog-item">
                    <strong>v0.1.0:</strong> Initial prototype, first-person movement, and basic environment blockouts.
                  </p>
                </div>
              </div>
            </section>

            <section className="doc-section">
              <h2 className="section-heading cinzel-font">
                Playtest Feedback &amp; Lessons Learned
              </h2>
              <div className="feedback-grid">
                <p className="feedback-item feedback-item--issue">
                  <strong>Playtest Issue:</strong> Testers struggled to find the candle during the Act 3 brownout.
                </p>
                <p className="feedback-item">
                  <strong>Fix Implemented:</strong> Added subtle moonlight bounce near the hallway and visual prompt guidance.
                </p>
                <p className="feedback-item">
                  <strong>Takeaway:</strong> Pacing mundane retail work builds genuine vulnerability, making sudden horror moments significantly more effective.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* TAB 5: THEME PALETTE */}
        {activeTab === 'palette' && (
          <div
            id="panel-palette"
            role="tabpanel"
            aria-labelledby="tab-palette"
            className="tab-panel"
          >
            <section className="doc-section">
              <h2 className="section-heading cinzel-font">
                Color Palette Reference
              </h2>
              <p className="palette-intro">
                Click any color swatch below to copy its hex code:
              </p>
              <div className="palette-grid">
                {paletteSwatches.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => copyColorCode(c.hex)}
                    className="swatch-card"
                  >
                    <div
                      className="swatch-preview"
                      style={{ backgroundColor: c.hex }}
                    >
                      {copiedColor === c.hex && (
                        <span className="swatch-copied mono-font" role="status" aria-live="polite">
                          Copied!
                        </span>
                      )}
                    </div>
                    <div className="swatch-meta">
                      <h3 className="swatch-name cinzel-font">{c.name}</h3>
                      <code className="swatch-hex mono-font">{c.hex}</code>
                      <p className="swatch-desc">{c.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="site-footer mono-font">
        <p>IT306 – Game Development Final Project (Documentation &amp; Trailer) | Nightshift: Jojo&apos;s Gas Station</p>
      </footer>
    </div>
  );
}
