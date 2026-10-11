import { useState } from 'react';

const sessionTypes = ['FULL PRODUCTION SESSION', 'RECORDING SESSION', 'MIX / MASTER SESSION', 'BEATMAKING SESSION', 'ARTIST DEVELOPMENT SESSION'];
const availabilityWindows = ['MORNING', 'AFTERNOON', 'EVENING', 'FLEXIBLE'];

const archiveRecords = [
  { year: '2026', category: 'RELEASES', title: 'MID-LIFE / CURATED EXPERIENCE', description: 'A recorded body of work documenting a period of adult rebuilding, reflection and forward motion.', marker: 'RELEASE / 01', status: 'RECENT' },
  { year: '2026', category: 'CURATION', title: 'RECALIBRATED', description: 'A human-led curatorial layer for discovering and contextualising music beyond the noise.', marker: 'CULTURE / 01', status: 'ACTIVE' },
  { year: '2026', category: 'TOOLS', title: 'MIXMIND', description: 'Producer Intelligence built to translate musical and sonic evidence into production decisions.', marker: 'TOOL / 01', status: 'ACTIVE' },
  { year: '2026', category: 'TOOLS', title: 'HUSH DENOISE', description: 'Professional audio restoration and noise reduction built for practical recovery of recorded sound.', marker: 'TOOL / 02', status: 'ACTIVE' },
  { year: '2011', category: 'ORIGIN', title: 'THE ROOTS', description: 'The beginning of the creative practice from which the present architecture grew.', marker: 'ORIGIN / 01', status: 'FOUNDATION' },
  { year: '∞', category: 'FUTURE', title: 'THE NEXT RECORD', description: 'Unfinished by design. New works, tools, experiments and cultural records will enter here.', marker: 'FUTURE / ∞', status: 'OPEN' },
];

const archiveCategories = ['ALL', 'RELEASES', 'CURATION', 'TOOLS', 'ORIGIN', 'FUTURE'];

const knowledgeLibrary = [
  { category: 'TERMINOLOGY', title: 'Gain staging', level: 'FOUNDATIONS', summary: 'Keep each stage of a signal chain at a useful level before it reaches the next processor.', detail: 'Set input and output levels deliberately from recording through plugins and buses. Leave headroom on the master bus, and use level matching when comparing processed and unprocessed audio so louder does not automatically seem better.' },
  { category: 'TERMINOLOGY', title: 'Headroom', level: 'FOUNDATIONS', summary: 'The space between your working level and the maximum level a system can represent.', detail: 'Digital audio clips when it exceeds full scale. Leave margin while recording, mixing and exporting; avoid pushing every channel to the ceiling. Final loudness choices come later in mastering and distribution.' },
  { category: 'TERMINOLOGY', title: 'Phase and polarity', level: 'FOUNDATIONS', summary: 'Understand why combining microphones or layered sounds can weaken low end and change tone.', detail: 'Polarity inversion flips a waveform’s sign; phase describes timing relationships that vary with frequency. Check mono compatibility, listen to combined sources, and adjust timing or microphone placement when the blend loses weight.' },
  { category: 'DAW GUIDES', title: 'FL Studio: patterns and Playlist', level: 'FL STUDIO', summary: 'Understand how patterns, channels and the Playlist work together to arrange a track.', detail: 'Create instrument or drum parts as patterns, then place pattern clips and audio clips in the Playlist. Keep patterns named, use automation clips for changing parameters over time, and make a versioned copy before major arrangement changes.' },
  { category: 'DAW GUIDES', title: 'Ableton Live: Session and Arrangement', level: 'ABLETON LIVE', summary: 'Move from loop-based idea building to a linear arrangement without losing the original material.', detail: 'Use Session View to audition clips and combinations; record or capture the chosen performance into Arrangement View for a song timeline. Keep an untouched scene or set copy before committing to a long arrangement.' },
  { category: 'DAW GUIDES', title: 'Logic Pro: Flex Time basics', level: 'LOGIC PRO', summary: 'Correct timing in audio while keeping edits audible and musical.', detail: 'Choose a Flex mode suited to the source, identify the transient or phrase that needs adjustment, and move the smallest useful region. Compare against the original and listen for artifacts around sustained notes and room tone.' },
  { category: 'DAW GUIDES', title: 'Pro Tools: buses and routing', level: 'PRO TOOLS', summary: 'Route related tracks through an auxiliary bus for shared processing and level control.', detail: 'Create an auxiliary input, assign its input to an unused bus, and route the source tracks’ outputs to that bus. Label the path clearly and check that the auxiliary output reaches the intended mix bus.' },
  { category: 'WORKFLOWS', title: 'A clean vocal recording checklist', level: 'RECORDING', summary: 'Reduce preventable noise and clipping before reaching for restoration plugins.', detail: 'Check the room, microphone placement, headphone bleed, cable noise and input peaks. Record a short test, listen between phrases, and capture a little room tone. Save a clean original before editing or processing.' },
  { category: 'WORKFLOWS', title: 'Compression: what to listen for', level: 'MIXING', summary: 'Use compression to control movement and envelope, not just to make a track louder.', detail: 'Set the threshold so the intended phrases trigger gain reduction, then shape attack and release to fit the source. Match output loudness for A/B listening. If the sound pumps, dulls, or loses its groove, revisit the settings.' },
  { category: 'RIGHTS & BUSINESS', title: 'Split sheets and contributor credits', level: 'RELEASE PREP', summary: 'Record agreed ownership shares and contributor information while everyone is available to confirm them.', detail: 'List every contributor and their role, agree the relevant composition shares, verify names and contact details, and have contributors review the record. A split sheet documents the agreement; it does not replace legal advice or a signed publishing agreement.' },
];

const peopleProfiles = [
  { name: 'Don Jazzy', role: 'Producer · Founder and CEO, Mavin Records', tier: 'ESTABLISHED', area: 'Nigeria · Executive leadership / production', contribution: 'Founded Mavin Records in 2012 after building a career as a producer. Mavin’s official profile documents his work as a producer, songwriter and entrepreneur and the label’s artist development history.', source: 'Mavin Records profile', href: 'https://www.mavinrecords.com/don-jazzy-profile/' },
  { name: 'Tega Oghenejobo', role: 'President and Chief Operating Officer, Mavin Global', tier: 'ESTABLISHED', area: 'Nigeria · Label operations / talent development', contribution: 'A founding member of Mavin Records in 2012, later appointed President and COO. The label credits his leadership with its growth and strategic direction.', source: 'Mavin Records announcement', href: 'https://www.mavinrecords.com/2024/10/29/tega-oghenejobo-appointed-president-chief-operating-officer-of-mavin-global-in-expanded-role/' },
  { name: 'Sarz', role: 'Producer · Founder, The Sarz Academy and 1789 MusicTech', tier: 'ESTABLISHED', area: 'Nigeria · Production / education', contribution: 'A Nigerian producer whose work spans artist collaborations and producer development. His artist profile describes The Sarz Academy as a talent incubator for emerging producers.', source: '1789 MusicTech artist profile', href: 'https://1789musictech.com/artists/sarz/' },
  { name: 'Chika Emmanuela', role: 'Merchandise Associate · Partnerships, Mavin', tier: 'RISING PROFESSIONAL', area: 'Nigeria · Partnerships / merchandising', contribution: 'Mavin’s published career story traces her progression from executive assistant to work in partnerships and merchandising, including Culture Hayvn.', source: 'Mavin Records growth story', href: 'https://www.mavinrecords.com/2025/04/01/chikas-growth-story-from-ea-to-the-coo-to-merch-associate-of-partnerships/' },
];


const researchSignals = [
  { number: '01', title: 'LISTEN', copy: 'Pay attention before reacting. Context changes what the signal means.' },
  { number: '02', title: 'QUESTION', copy: 'Challenge defaults, inherited formulas and convenient answers.' },
  { number: '03', title: 'EXPERIMENT', copy: 'Build, test and observe. Discovery often begins where certainty ends.' },
  { number: '04', title: 'DOCUMENT', copy: 'Keep the useful evidence. Today\'s experiment can become tomorrow\'s method.' },
];
import {
  ArrowDown,
  ArrowUpRight,
  Circle,
  Orbit,
  AudioLines,
  Archive,
  Compass,
  Sparkles,
  Users,
  Wrench,
  Layers3,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';

const AuralcraftMark = () => (
  <svg className="auralcraft-mark" viewBox="0 0 80 80" aria-hidden="true" focusable="false">
    <ellipse cx="40" cy="40" rx="29" ry="11" fill="none" stroke="currentColor" strokeWidth="1.55" />
    <path d="M22 64 40 10 58 64" fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="square" strokeLinejoin="miter" />
    <circle cx="40" cy="52.5" r="3.15" fill="currentColor" />
    <path d="M40 55.8v9.2" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" />
  </svg>
);

const revealDomains = [
  { code: '01', title: 'USE A TOOL', copy: 'Purpose-built systems for production, restoration and music ownership records.', action: 'tools' },
  { code: '02', title: 'LEARN THE CRAFT', copy: 'Searchable explanations and practical production workflows for every level.', action: 'research' },
  { code: '03', title: 'HEAR THE MUSIC', copy: 'Listen to releases connected to the Auralcraftverse ecosystem.', action: 'mind' },
  { code: '04', title: 'JOIN THE WORK', copy: 'Find opportunities and ways to contribute as the ecosystem grows.', action: 'assembly' },
];

const works = [
  ['Lil Eazi', 'Locked In Kpa', '2zqdV4BiJS1qC9YZheU5UO'],
  ['Superstar DZ', 'Mary Go Round', '1FLgMIOJ6V1xx8phwdzJ3I'],
  ['JiggyRickky', 'Action Film', '66r2ep0Gj463GErL3fYNAw'],
  ['Auralcraft Pro × Oscar Dice', 'Dreams', '7w8xLrPsafUIvtiFEdYtVO'],
  ['The Big M', 'NewTaker', '6D60j3vjtvlJmwUZQ7KzFS'],
  ['Skiz', 'Never Die Yet', '7w20HOD7C8Mmrf3IDiokCV'],
  ['Nony 4DGD', 'OMW', '0srnOgk3higgVCwx9i5W8R'],
  ['Auralcraft Pro × Oscar Dice × Kaye Blaq', 'Charlie Chaplin', '4YUivdwN5Gwmv5kX4Cb8qD'],
  ['Roemeinia', 'Silly Hearts', '0h3BH3HRqPVmw5GiOJPnWk'],
];

const deeperFloors = [
  { id: 'packages', label: 'PRODUCTION PACKAGES', eyebrow: 'BOOK A SESSION' },
  { id: 'research', label: 'MUSIC PRODUCTION KNOWLEDGE LIBRARY', eyebrow: 'LEARN' },
  { id: 'human', label: 'WEST AFRICAN MUSIC RECOGNITION ARCHIVE', eyebrow: 'PEOPLE' },
  { id: 'assembly', label: 'CAREERS / CONTRIBUTE', eyebrow: 'JOIN AURALCRAFTVERSE' },
  { id: 'archive', label: 'THE ARCHIVE', eyebrow: 'THE RECORD' },
];

const packages = [
  { name: 'ARTIST DEVELOPMENT', price: '₦850K', note: 'DEVELOPMENT' },
  { name: 'PRO BUNDLE', price: '₦500K', note: 'PRODUCTION' },
  { name: 'UPCOMING / EMERGING', price: '₦200K', note: 'EMERGING ARTISTS' },
  { name: 'STUDENT', price: '₦150K', note: 'STUDENT' },
  { name: 'MIX / MASTER', price: '₦100K', note: 'POST-PRODUCTION' },
  { name: 'RECORDING', price: '₦100K', note: 'SESSION' },
  { name: 'BEATMAKING', price: '₦100K', note: 'ORIGINAL PRODUCTION' },
];

const tools = [
  {
    name: 'PRODUCTION SUITE',
    subtitle: 'Human production.',
    copy: 'Recording, beatmaking, mixing, mastering and artist development shaped around each project. One human-led route from first idea to finished record, with clear packages and booking access.'
    icon: AudioLines,
    tone: 'warm',
    action: 'EXPLORE PRODUCTION',
  },
  {
    name: 'MIXMIND',
    subtitle: 'Producer Intelligence.',
    copy: 'Turn listening into structured production decisions across harmony, arrangement, EQ, dynamics, space and effects. MixMind helps producers decide what to try next and connects analysis to Auralcraftverse production practice.'
    icon: Orbit,
    tone: 'cool',
    action: 'ENTER MIXMIND',
  },
  {
    name: 'HUSH DENOISE',
    subtitle: 'Professional audio restoration.',
    copy: 'Restore noisy recordings and clean speech or vocals with processing designed to run on your device. Hush helps recover usable audio while keeping the working file local, as part of the Auralcraftverse production toolkit.'
    icon: Sparkles,
    tone: 'quiet',
    action: 'OPEN HUSH DENOISE',
  },
  {
    name: 'SPLIT IT!',
    subtitle: 'Music ownership documentation.',
    copy: 'Create and reopen split sheets, document contributor ownership, and export PDF or CSV records. Split It! replaces scattered credit notes with a clear release-prep document that connects to the Auralcraftverse music archive.'
    icon: FileSpreadsheet,
    tone: 'warm',
    action: 'OPEN SPLIT IT!',
  },
];

function App() {
  const [navOpen, setNavOpen] = useState('');
  const [activeRoom, setActiveRoom] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [availability, setAvailability] = useState('');
  const [bookingStage, setBookingStage] = useState<'select' | 'request' | 'availability' | 'confirmation'>('select');
  const [archiveFilter, setArchiveFilter] = useState('ALL');
  const [openArchiveRecord, setOpenArchiveRecord] = useState('');
  const [libraryQuery, setLibraryQuery] = useState('');
  const [libraryCategory, setLibraryCategory] = useState('ALL');
  const go = (id: string) => {
    setActiveRoom('');
    setNavOpen('');
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 0);
  };

  const openRoom = (id: string) => {
    setActiveRoom(id);
    setNavOpen('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSplitIt = () => {
    window.location.assign('https://split-it-by-auralcraftverse-isolated-port-yvds53.v2.appdeploy.ai/');
  };

  const revealAndGo = (id: string) => openRoom(id);
  const bookingMailto = `mailto:auralcraftverse@gmail.com?subject=${encodeURIComponent(`Production booking request: ${projectName}`)}&body=${encodeURIComponent([
    `Name: ${clientName}`,
    `Project / record: ${projectName}`,
    `Package: ${selectedPackage}`,
    `Session type: ${sessionType}`,
    `Availability: ${availability}`,
  ].join('\n'))}`;

  return (
    <main className="verse">
      <div className="noise" aria-hidden="true" />
      <div className="universe-environment" aria-hidden="true">
        <div className="universe-image" />
        <div className="universe-vignette" />
        <div className="universe-stars" />
        <div className="universe-orbit env-orbit-a" />
        <div className="universe-orbit env-orbit-b" />
        <div className="universe-orbit env-orbit-c" />
        <div className="universe-trajectory" />
        <div className="universe-craft">
          <span className="craft-glow" />
          <span className="craft-body" />
          <span className="craft-wing wing-left" />
          <span className="craft-wing wing-right" />
          <span className="craft-engine engine-one" />
          <span className="craft-engine engine-two" />
        </div>
      </div>
      <header className="topbar">
        <button className="wordmark" onClick={() => go('top')} aria-label="Return to Auralcraftverse">
          <AuralcraftMark />
          AURALCRAFTVERSE
        </button>
        <nav className="universe-nav" aria-label="Auralcraftverse sections">
          <button className="nav-tab" onClick={() => go('top')}>HOME</button>
          <button className="nav-tab" onClick={() => openRoom('mind')}>MUSIC</button>
          <div className="nav-item" onMouseEnter={() => setNavOpen('tools')} onMouseLeave={() => setNavOpen('')}>
            <button className={'nav-tab ' + (navOpen === 'tools' ? 'active' : '')} onClick={() => setNavOpen(navOpen === 'tools' ? '' : 'tools')} aria-expanded={navOpen === 'tools'}>TOOLS</button>
            {navOpen === 'tools' && <div className="nav-dropdown tools-dropdown">
              <button onClick={() => openRoom('production')}><span>PRODUCTION SUITE</span><small>PACKAGES / BOOKING</small></button>
              <button onClick={() => window.location.assign('https://mixmind-ai-uj4ort.v2.appdeploy.ai/')}><span>MIXMIND</span><small>PRODUCER INTELLIGENCE</small></button>
              <button onClick={() => window.location.assign('https://hush-denoise-by-auralcraftverse-wc3fxc.v2.appdeploy.ai/')}><span>HUSH DENOISE</span><small>AUDIO RESTORATION</small></button>
              <button onClick={openSplitIt}><span>SPLIT IT!</span><small>OWNERSHIP DOCUMENTATION</small></button>
            </div>}
          </div>
          <button className="nav-tab" onClick={() => openRoom('research')}>LEARN</button>
          <button className="nav-tab" onClick={() => openRoom('human')}>PEOPLE</button>
          <div className="nav-item" onMouseEnter={() => setNavOpen('deeper')} onMouseLeave={() => setNavOpen('')}>
            <button className={'nav-tab nav-tab-more ' + (navOpen === 'deeper' ? 'active' : '')} onClick={() => setNavOpen(navOpen === 'deeper' ? '' : 'deeper')} aria-expanded={navOpen === 'deeper'}>MORE <span>+</span></button>
            {navOpen === 'deeper' && <div className="nav-dropdown deeper-dropdown">
              {deeperFloors.map(floor => <button key={floor.id + floor.label} onClick={() => openRoom(floor.id)}><span>{floor.label}</span><small>{floor.eyebrow}</small></button>)}
              <button onClick={() => go('origin')}><span>ORIGIN / ECOSYSTEM</span><small>START HERE</small></button>
            </div>}
          </div>
        </nav>
      </header>

      <section id="top" className="hero chamber">
        <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="hero-core" aria-hidden="true"><div className="core-ring" /><div className="core-point" /></div><div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy"><p className="kicker">INDEPENDENT CREATIVE INFRASTRUCTURE</p><h1>WELCOME TO<br /><span>AURALCRAFTVERSE</span></h1><p className="hero-line">Tools to make. Knowledge to grow.<br />Music and people to discover.</p></div>
        <button className="enter-link" onClick={() => go('reveal')}><span>EXPLORE THE ECOSYSTEM</span><ArrowDown size={16} /></button>
        <div className="hero-index">01 / 06</div>
      </section>

      <section id="reveal" className="reveal chamber ecosystem-intro">
        <div className="section-meta"><span>02</span><span>WHAT YOU CAN DO HERE</span></div>
        <div className="ecosystem-heading"><p className="kicker">AURALCRAFTVERSE / THE ECOSYSTEM</p><h2>Make. Learn.<br /><em>Release. Connect.</em></h2><p>Explore working music tools, practical production knowledge, West African industry contributors, and releases from the Auralcraftverse network.</p></div>
        <div className="reveal-domains">{revealDomains.map(domain => <button key={domain.code} className="reveal-domain" onClick={() => revealAndGo(domain.action)}><span>{domain.code}</span><div><strong>{domain.title}</strong><small>{domain.copy}</small></div><ArrowUpRight size={15} /></button>)}</div>
      </section>

      {activeRoom && <div className="room-layer">
      

      {activeRoom === 'tools' && <section id="tools" className="tools chamber">
        <div className="section-meta">
          <span>04</span>
          <span>TOOLS</span>
        </div>
        <div className="tools-heading">
          <div>
            <p className="kicker">THE WORKING LAYER / 04</p>
            <h2>
              Built to
              <br />
              <em>extend.</em>
            </h2>
          </div>
          <p>
            Technology here is not the destination. It is infrastructure for
            better decisions, deeper listening and more deliberate making.
          </p>
        </div>
        <div className="tools-introduction">
          <div className="tools-signal">
            <span>ACV / TECHNOLOGY / 04</span>
            <strong>TOOLS ARE PART OF THE CRAFT.</strong>
          </div>
          <p>Purpose-built systems developed around the realities of making sound. Each one enters the universe for a reason.</p>
        </div>
        <div className="tool-list">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <article className={'tool-card ' + tool.tone} key={tool.name}>
                <div className="tool-number">0{index + 1}</div>
                <div className="tool-icon">
                  <Icon size={24} strokeWidth={1.2} />
                </div>
                <div className="tool-content">
                  <p className="kicker">{tool.subtitle}</p>
                  <h3>{tool.name}</h3>
                  <p>{tool.copy}</p>
                  {index === 0 && <span className="tool-status">HUMAN-LED / PRODUCTION ROOM</span>}
                  {index === 1 && <span className="tool-status">LISTEN / ANALYZE / DECIDE</span>}
                  {index === 2 && <span className="tool-status">RESTORE / RECONSTRUCT / RECOVER</span>}
                </div>
                <button
                  className="tool-action"
                  onClick={() => {
                    if (index === 0) openRoom('production');
                    if (index === 1) window.location.assign('https://mixmind-ai-uj4ort.v2.appdeploy.ai/');
                    if (index === 2) window.location.assign('https://hush-denoise-by-auralcraftverse-wc3fxc.v2.appdeploy.ai/');
                    if (index === 3) openSplitIt();
                  }}
                >
                  {tool.action}
                  <ArrowUpRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
        <div className="tools-closing">
          <span>THE PRINCIPLE</span>
          <p>Technology should make the work more possible, not make the artist less necessary.</p>
        </div>
        <div className="future-line">
          <Circle size={7} fill="currentColor" /> MORE TOOLS ARE BEING BUILT.
        </div>
      </section>}

      {activeRoom === 'packages' && <section id="packages" className="packages chamber">
        <div className="section-meta"><span>05A</span><span>PRODUCTION PACKAGES</span></div>
        <div className="packages-heading"><div><p className="kicker">CHOOSE YOUR PATH</p><h2>Production<br /><em>without templates.</em></h2></div><p>Choose the production path that fits the work. Every engagement is developed around the record itself.</p></div>
        <div className="package-grid">
          {[
            ['ARTIST DEVELOPMENT', '₦850K', 'DEVELOPMENT'],
            ['PRO BUNDLE', '₦500K', 'PRODUCTION'],
            ['UPCOMING / EMERGING', '₦200K', 'EMERGING ARTISTS'],
            ['STUDENT', '₦150K', 'STUDENT'],
            ['MIX / MASTER', '₦100K', 'POST-PRODUCTION'],
            ['RECORDING', '₦100K', 'SESSION'],
            ['BEATMAKING', '₦100K', 'ORIGINAL PRODUCTION'],
          ].map(([name, price, note], index) => (
            <article className={'package-card ' + (selectedPackage === name ? 'selected' : '')} key={name}>
              <div className="package-top"><span>0{index + 1}</span><span>{note}</span></div>
              <h3>{name}</h3><div className="package-price">{price}</div>
              <p>Purpose-built production for the record in front of us.</p>
              <button className="package-button" onClick={() => { setSelectedPackage(name); setBookingStage('request'); revealAndGo('booking'); }}>SELECT PACKAGE <ArrowUpRight size={14} /></button>
            </article>
          ))}
        </div>
      </section>}

      {activeRoom === 'booking' && <section id="booking" className="booking chamber">
        <div className="section-meta"><span>F03 / 04</span><span>BOOKING SYSTEM</span></div>
        <div className="booking-layout">
          <div>
            <p className="kicker">FLOOR 03 / CLIENT INTAKE</p>
            <h2>Build the<br /><em>record.</em></h2>
            <p className="body-copy">A guided production request: choose the work, describe the project, indicate the session format and give us a window for availability.</p>
            <div className="booking-rail">
              <button className={bookingStage === 'request' ? 'rail-active' : ''} onClick={() => setBookingStage('request')}><span>01</span> SELECT</button>
              <button className={bookingStage === 'request' ? 'rail-active' : ''} onClick={() => setBookingStage('request')}><span>02</span> CLIENT</button>
              <button className={bookingStage === 'availability' ? 'rail-active' : ''} onClick={() => setBookingStage('availability')}><span>03</span> AVAILABILITY</button>
              <button className={bookingStage === 'confirmation' ? 'rail-active' : ''} onClick={() => setBookingStage('confirmation')}><span>04</span> CONFIRM</button>
            </div>
          </div>
          <div className="booking-console">
            <div className="booking-state"><span className="booking-dot" /><span>PRODUCTION SUITE / REQUEST</span></div>
            {bookingStage === 'select' && <div className="booking-stage"><p className="kicker">START HERE</p><h3>Choose a production path.</h3><p>Return to the packages above and select the engagement that matches the work.</p><button className="booking-primary" onClick={() => revealAndGo('packages')}>VIEW PRODUCTION PACKAGES <ArrowUpRight size={15} /></button></div>}
            {bookingStage === 'request' && <div className="booking-stage"><div className="booking-selected"><span>SELECTED PACKAGE</span><strong>{selectedPackage || 'CHOOSE A PACKAGE'}</strong></div><div className="field-grid"><label>CLIENT NAME<input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Your name" /></label><label>PROJECT / RECORD<input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project title" /></label></div><label className="field-full">SESSION TYPE<select value={sessionType} onChange={e => setSessionType(e.target.value)}><option value="">Select session type</option>{sessionTypes.map(type => <option key={type}>{type}</option>)}</select></label><button className="booking-primary" disabled={!selectedPackage || !clientName || !projectName || !sessionType} onClick={() => setBookingStage('availability')}>CONTINUE TO AVAILABILITY <ArrowUpRight size={15} /></button></div>}
            {bookingStage === 'availability' && <div className="booking-stage"><div className="booking-selected"><span>REQUEST</span><strong>{selectedPackage}</strong></div><p className="booking-prompt">What session window works for you?</p><div className="availability-grid">{availabilityWindows.map(window => <button key={window} className={availability === window ? 'availability-option active' : 'availability-option'} onClick={() => setAvailability(window)}>{window}</button>)}</div><button className="booking-primary" disabled={!availability} onClick={() => setBookingStage('confirmation')}>REVIEW REQUEST <ArrowUpRight size={15} /></button></div>}
            {bookingStage === 'confirmation' && <div className="booking-stage confirmation-stage"><span className="confirmation-mark">✓</span><p className="kicker">REQUEST READY TO SEND</p><h3>{projectName}</h3><p>{selectedPackage} · {sessionType} · {availability}</p><p className="booking-note">Your email app will open with the booking details addressed to auralcraftverse@gmail.com. Review the message and press Send to submit your request.</p><a className="booking-primary" href={bookingMailto}>OPEN EMAIL TO SEND REQUEST <ArrowUpRight size={15} /></a><button className="secondary-button" onClick={() => revealAndGo('production')}>RETURN TO PRODUCTION SUITE <ArrowUpRight size={15} /></button></div>}
          </div>
        </div>
      </section>}

      {activeRoom === 'production' && <section id="production" className="production chamber">
        <div className="section-meta">
          <span>05</span>
          <span>PRODUCTION SUITE</span>
        </div>
        <div className="production-panel">
          <div className="production-art" aria-hidden="true">
            <AudioLines size={100} strokeWidth={0.55} />
          </div>
          <div className="production-copy">
            <p className="kicker">HUMAN CRAFT / AURALCRAFT PRO</p>
            <h2>
              Come with an idea.
              <br />
              <em>Leave with something developed.</em>
            </h2>
            <p>
              Production packages and sessions designed around the record, not a
              template. Explore the offering, find the right path, then book.
            </p>
            <div className="production-actions">
              <button className="primary-button" onClick={() => revealAndGo('packages')}>
                VIEW PACKAGES <ArrowUpRight size={15} />
              </button>
              <button className="secondary-button" onClick={() => { setBookingStage('select'); revealAndGo('booking'); }}>
                BOOK A SESSION <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>}

      {activeRoom === 'human' && <section id="human" className="human chamber recognition-archive">
        <div className="section-meta"><span>06</span><span>WEST AFRICAN MUSIC RECOGNITION ARCHIVE</span></div>
        <div className="recognition-heading"><div><p className="kicker">THE PEOPLE BEHIND THE INDUSTRY</p><h2>Work worth<br /><em>remembering.</em></h2></div><p>An editorial archive recognising the executives, producers, talent developers and rising professionals shaping West African music. Profiles link to their source material and grow through careful research.</p></div>
        <div className="recognition-note"><span>EDITORIAL STANDARD</span><p>Roles and contributions are attributed to cited profiles or announcements. This first edition focuses on documented Nigerian contributors; regional coverage will expand as profiles are verified.</p></div>
        <div className="people-grid">{peopleProfiles.map((person,index) => <article className="person-card" key={person.name}><div className="person-card-top"><span className="person-index">0{index+1}</span><span className={person.tier === 'RISING PROFESSIONAL' ? 'person-tier rising' : 'person-tier'}>{person.tier}</span></div><div className="person-monogram" aria-hidden="true">{person.name.split(' ').map(part=>part[0]).join('').slice(0,2)}</div><p className="kicker">{person.area}</p><h3>{person.name}</h3><strong className="person-role">{person.role}</strong><p>{person.contribution}</p><a href={person.href} target="_blank" rel="noopener noreferrer">SOURCE / {person.source} <ArrowUpRight size={14} /></a></article>)}</div>
        <div className="recognition-footer"><span>ESTABLISHED CONTRIBUTORS / RISING PROFESSIONALS</span><span>PROFILES ARE EDITORIALLY CURATED</span></div>
      </section>}

      {activeRoom === 'archive' && <section id="archive" className="archive chamber">
        <div className="section-meta"><span>07</span><span>ARCHIVE / THE RECORD</span></div>
        <div className="archive-head">
          <div>
            <p className="kicker">FLOOR 05 / THE ARCHIVE</p>
            <h2>Everything we<br /><em>make</em> becomes history.</h2>
            <p className="archive-intro">A living institutional record of releases, curation, tools, origins and experiments. Nothing here is decoration; each entry marks a piece of the universe being built.</p>
          </div>
          <div className="archive-seal" aria-hidden="true"><Archive size={42} strokeWidth={0.7} /><span>ACV / 05</span></div>
        </div>
        <div className="archive-controls" aria-label="Archive filters">
          <span>INDEX</span>
          <div>{archiveCategories.map(category => <button key={category} className={archiveFilter === category ? 'archive-filter active' : 'archive-filter'} onClick={() => { setArchiveFilter(category); setOpenArchiveRecord(''); }}>{category}</button>)}</div>
        </div>
        <div className="archive-index">{archiveRecords.filter(record => archiveFilter === 'ALL' || record.category === archiveFilter).map((record, index) => <article className={'archive-record ' + (openArchiveRecord === record.title ? 'open' : '')} key={record.title}>
          <button className="archive-record-main" onClick={() => setOpenArchiveRecord(openArchiveRecord === record.title ? '' : record.title)} aria-expanded={openArchiveRecord === record.title}>
            <span className="archive-record-number">{String(index + 1).padStart(2, '0')}</span><span className="archive-record-year">{record.year}</span><span className="archive-record-category">{record.category}</span><span className="archive-record-title">{record.title}</span><span className="archive-record-status">{record.status}</span><ArrowUpRight size={15} className="archive-record-arrow" />
          </button>
          {openArchiveRecord === record.title && <div className="archive-record-detail"><div><span>{record.marker}</span><strong>{record.title}</strong></div><p>{record.description}</p><span className="archive-detail-note">ARCHIVAL RECORD / AURALCRAFTVERSE</span></div>}
        </article>)}</div>
        <div className="archive-footer-line"><span>{archiveRecords.filter(record => archiveFilter === 'ALL' || record.category === archiveFilter).length} RECORDS INDEXED</span><span>THE ARCHIVE REMAINS OPEN</span><span>∞</span></div>
      </section>}

      {activeRoom === 'research' && <section id="research" className="research chamber knowledge-library">
        <div className="section-meta"><span>07A</span><span>MUSIC PRODUCTION KNOWLEDGE LIBRARY</span></div>
        <div className="library-heading"><div><p className="kicker">SEARCH / LEARN / APPLY</p><h2>Find the term.<br /><em>Learn the move.</em></h2></div><p>A growing, searchable guide to production language, DAWs, workflows, troubleshooting and music business fundamentals.</p></div>
        <div className="library-search"><label htmlFor="knowledge-search">Search the library</label><input id="knowledge-search" type="search" value={libraryQuery} onChange={event => setLibraryQuery(event.target.value)} placeholder="Try “gain staging” or “FL Studio”" /></div>
        <div className="library-filters" aria-label="Knowledge categories">{['ALL', 'TERMINOLOGY', 'DAW GUIDES', 'WORKFLOWS', 'RIGHTS & BUSINESS'].map(category => <button key={category} className={libraryCategory === category ? 'active' : ''} onClick={() => setLibraryCategory(category)}>{category}</button>)}</div>
        <div className="knowledge-grid">
          {knowledgeLibrary.filter(entry => (libraryCategory === 'ALL' || entry.category === libraryCategory) && (libraryQuery.trim() === '' || (entry.title + ' ' + entry.category + ' ' + entry.summary + ' ' + entry.detail).toLowerCase().includes(libraryQuery.trim().toLowerCase()))).map(entry => <article className="knowledge-card" key={entry.title}><div className="knowledge-card-meta"><span>{entry.category}</span><small>{entry.level}</small></div><h3>{entry.title}</h3><p>{entry.summary}</p><details><summary>READ THE GUIDE <ArrowUpRight size={14} /></summary><p>{entry.detail}</p></details></article>)}
          {knowledgeLibrary.filter(entry => (libraryCategory === 'ALL' || entry.category === libraryCategory) && (libraryQuery.trim() === '' || (entry.title + ' ' + entry.category + ' ' + entry.summary + ' ' + entry.detail).toLowerCase().includes(libraryQuery.trim().toLowerCase()))).length === 0 && <p className="library-empty">No guide matches yet. Try a different term or category.</p>}
        </div>
        <div className="library-footer"><span>EDITORIAL STARTER LIBRARY / VERSION 01</span><span>NEW GUIDES WILL BE ADDED OVER TIME</span></div>
      </section>}

      {activeRoom === 'assembly' && <section id="assembly" className="assembly chamber careers">
        <div className="section-meta"><span>07B</span><span>CAREERS / CONTRIBUTE</span></div>
        <div className="careers-heading"><div><p className="kicker">BUILD WITH AURALCRAFTVERSE</p><h2>Make room<br /><em>for your craft.</em></h2></div><p>We welcome thoughtful people who can help independent creative infrastructure grow—through full-time work, freelance projects, internships and collaboration.</p></div>
        <div className="careers-status"><span className="status-dot" /><div><strong>NO PUBLIC VACANCIES LISTED RIGHT NOW</strong><p>We’re open to expressions of interest for future work. Sending a portfolio does not create an active application or guarantee a role.</p></div></div>
        <div className="opportunity-grid">
          <article><span>01 / EMPLOYMENT</span><h3>Open positions</h3><p>When a role is available, its responsibilities, requirements, engagement type and closing date will be listed here.</p></article>
          <article><span>02 / FREELANCE</span><h3>Specialist work</h3><p>Production, engineering, design, software, editorial and operational support for defined projects.</p></article>
          <article><span>03 / EARLY CAREER</span><h3>Internships and entry-level</h3><p>Structured opportunities to learn through practical work with clear supervision and expectations.</p></article>
          <article><span>04 / COLLABORATION</span><h3>Project partnerships</h3><p>Pitch a relevant collaboration or express interest in contributing skills to the ecosystem.</p></article>
        </div>
        <div className="careers-apply"><div><span>HOW TO INTRODUCE YOURSELF</span><p>Share your area of work, location, availability, a short note about how you could contribute, and a CV or portfolio link. Do not attach confidential or unreleased material.</p></div><a className="primary-button" href="mailto:auralcraftverse@gmail.com?subject=Auralcraftverse%20careers%20interest&body=Area%20of%20work%3A%0ALocation%3A%0AAvailability%3A%0APortfolio%20or%20CV%20link%3A%0AShort%20introduction%3A">EXPRESS INTEREST <ArrowUpRight size={15} /></a></div>
      </section>}

      {activeRoom === 'mind' && <section id="mind" className="mind chamber music-broadcast">
        <div className="section-meta"><span>08</span><span>MUSIC BROADCAST / RELEASE CATALOGUE</span></div>
        <div className="broadcast-heading"><div><p className="kicker">AURALCRAFTVERSE / SELECTED RELEASES</p><h2>Music made<br /><em>to be heard.</em></h2></div><p>A curated catalogue of artists and projects connected to Auralcraftverse. Listen through official Spotify embeds, then follow the release to its music platform.</p></div>
        <div className="broadcast-source-note"><span>CURATED CATALOGUE</span><p>Spotify player embeds and outbound links use official Spotify content. Other platform catalogues can be connected after developer credentials and catalog records are available. Release dates will appear when verified.</p></div>
        <div className="broadcast-grid">{works.map(([artist,title,trackId],index) => <article className="broadcast-card" key={trackId}><div className="broadcast-card-meta"><span>ACV RELEASE / {String(index+1).padStart(2,'0')}</span><span>ARTIST / {artist}</span></div><h3>{title}</h3><p className="broadcast-artist">{artist}</p><iframe title={artist + ' — ' + title} src={'https://open.spotify.com/embed/track/' + trackId + '?utm_source=generator'} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" /><div className="broadcast-links"><a href={'https://open.spotify.com/track/' + trackId} target="_blank" rel="noopener noreferrer">SPOTIFY <ArrowUpRight size={13} /></a><a href={'https://music.apple.com/us/search?term=' + encodeURIComponent(artist + ' ' + title)} target="_blank" rel="noopener noreferrer">APPLE MUSIC SEARCH <ArrowUpRight size={13} /></a></div></article>)}</div>
        <div className="broadcast-footer"><span>PLAY / DISCOVER / FOLLOW OFFICIAL RELEASES</span><span>CATALOGUE RECORDS REMAIN EDITORIAL</span></div>
      </section>}

      

      

      

      </div>}

      <section id="origin" className="origin chamber ecosystem-gateway">
        <div className="section-meta"><span>09</span><span>THE AURALCRAFTVERSE ECOSYSTEM</span></div>
        <div className="gateway-heading"><div><p className="kicker">ROOTED HERE / BUILT FOR BEYOND</p><h2>One ecosystem.<br /><em>Useful by design.</em></h2></div><p>Move from an idea to a finished record, learn the language of production, document ownership, and discover the people and music that make the work possible.</p></div>
        <div className="gateway-grid">
          {tools.map((tool,index) => <article className="gateway-card" key={tool.name}><span>GATEWAY / 0{index+1}</span><p className="kicker">{tool.subtitle}</p><h3>{tool.name}</h3><p>{tool.copy}</p>{index === 0 ? <button onClick={() => openRoom('production')}>LEARN MORE <ArrowUpRight size={14} /></button> : <a href={['','https://mixmind-ai-uj4ort.v2.appdeploy.ai/','https://hush-denoise-by-auralcraftverse-wc3fxc.v2.appdeploy.ai/','https://split-it-by-auralcraftverse-isolated-port-yvds53.v2.appdeploy.ai/'][index]}>LEARN MORE <ArrowUpRight size={14} /></a>}</article>)}
          <article className="gateway-card gateway-resource"><span>GATEWAY / 05</span><p className="kicker">LEARN / KEEP BUILDING</p><h3>Production Knowledge Library</h3><p>Find clear explanations, DAW guides and practical workflows. A growing reference for creatives at every stage.</p><button onClick={() => openRoom('research')}>LEARN MORE <ArrowUpRight size={14} /></button></article>
          <article className="gateway-card gateway-resource"><span>GATEWAY / 06</span><p className="kicker">PEOPLE / PROFESSIONAL LEGACY</p><h3>West African Music Archive</h3><p>Discover documented contributions from professionals and rising talent shaping the region’s music industry.</p><button onClick={() => openRoom('human')}>LEARN MORE <ArrowUpRight size={14} /></button></article>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-horizon" aria-hidden="true">
          <div className="horizon-ring" />
        </div>
        <div className="footer-main">
          <div>
            <div className="footer-mark">
              <AuralcraftMark />
              AURALCRAFTVERSE
            </div>
            <p>Independent creative infrastructure for music, learning, ownership and opportunity.</p>
          </div>
          <div className="footer-links">
            <button onClick={() => go('top')}>VERSE</button>
            <button onClick={() => openRoom('research')}>LEARN</button>
            <button onClick={() => openRoom('mind')}>MUSIC</button>
            <button onClick={() => openRoom('tools')}>TOOLS</button>
            <button onClick={() => go('origin')}>ORIGIN</button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>AURALCRAFTVERSE / 2026</span>
          <span>TOOLS / KNOWLEDGE / MUSIC / PEOPLE / OPPORTUNITY</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
