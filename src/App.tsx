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
  { code: '01', title: 'SOUND', copy: 'Music, production and listening treated as craft rather than commodity.', action: 'works' },
  { code: '02', title: 'TECHNOLOGY', copy: 'Purpose-built tools that extend creative judgment without replacing it.', action: 'tools' },
  { code: '03', title: 'CULTURE', copy: 'Curation, research and observation kept close to the work.', action: 'research' },
  { code: '04', title: 'CRAFT', copy: 'Human decisions, developed patiently and carried through to completion.', action: 'human' },
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
  { id: 'packages', label: '05A / PRODUCTION PACKAGES', eyebrow: 'THE OFFERING' },
  { id: 'production', label: '05 / PRODUCTION SUITE', eyebrow: 'HUMAN CRAFT' },
  { id: 'human', label: '06 / HUMAN CRAFT', eyebrow: 'THE METHOD' },
  { id: 'archive', label: '07 / THE ARCHIVE', eyebrow: 'THE RECORD' },
  { id: 'research', label: '07A / CULTURAL RESEARCH', eyebrow: 'THE CULTURAL LAYER' },
  { id: 'assembly', label: '07B / THE ASSEMBLY', eyebrow: 'THE PEOPLE' },
  { id: 'mind', label: '08 / THE MIND', eyebrow: 'THE CONSCIOUSNESS' },
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
    copy: 'Production packages, recording, beatmaking, mixing, mastering, artist development and bookings.',
    icon: AudioLines,
    tone: 'warm',
    action: 'EXPLORE PRODUCTION',
  },
  {
    name: 'MIXMIND',
    subtitle: 'Producer Intelligence.',
    copy: 'Musical and sonic evidence transformed into production decisions — harmony, arrangement, EQ, dynamics, space, FX and mastering.',
    icon: Orbit,
    tone: 'cool',
    action: 'ENTER MIXMIND',
  },
  {
    name: 'HUSH DENOISE',
    subtitle: 'Professional audio restoration.',
    copy: 'Noise reduction, restoration and repair for vocals, speech, interviews, field recordings and more.',
    icon: Sparkles,
    tone: 'quiet',
    action: 'OPEN HUSH DENOISE',
  },
  {
    name: 'SPLIT IT!',
    subtitle: 'Music ownership documentation.',
    copy: 'Create, save and reopen music split sheets, document contributor ownership and export professional PDF or structured CSV records.',
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
        <nav className="universe-nav" aria-label="Auralcraftverse architecture">
          <button className="nav-tab" onClick={() => go('top')}>VERSE</button>
          <button className="nav-tab" onClick={() => openRoom('works')}>WORKS</button>
          <div className="nav-item" onMouseEnter={() => setNavOpen('tools')} onMouseLeave={() => setNavOpen('')}>
            <button className={'nav-tab ' + (navOpen === 'tools' ? 'active' : '')} onClick={() => setNavOpen(navOpen === 'tools' ? '' : 'tools')} aria-expanded={navOpen === 'tools'}>TOOLS</button>
            {navOpen === 'tools' && <div className="nav-dropdown tools-dropdown">
              <button onClick={() => openRoom('production')}><span>PRODUCTION SUITE</span><small>HUMAN CRAFT</small></button>
              <button onClick={() => openRoom('mixmind')}><span>MIXMIND</span><small>PRODUCER INTELLIGENCE</small></button>
              <button onClick={() => openRoom('hush')}><span>HUSH DENOISE</span><small>LOCAL AUDIO RESTORATION</small></button>
              <button onClick={openSplitIt}><span>SPLIT IT!</span><small>MUSIC OWNERSHIP DOCUMENTATION</small></button>
            </div>}
          </div>
          <button className="nav-tab" onClick={() => go('origin')}>ORIGIN</button>
          <div className="nav-item" onMouseEnter={() => setNavOpen('deeper')} onMouseLeave={() => setNavOpen('')}>
            <button className={'nav-tab nav-tab-more ' + (navOpen === 'deeper' ? 'active' : '')} onClick={() => setNavOpen(navOpen === 'deeper' ? '' : 'deeper')} aria-expanded={navOpen === 'deeper'}>MORE <span>+</span></button>
            {navOpen === 'deeper' && <div className="nav-dropdown deeper-dropdown">
              {deeperFloors.map(floor => <button key={floor.id + floor.label} onClick={() => openRoom(floor.id)}><span>{floor.label}</span><small>{floor.eyebrow}</small></button>)}
              <button onClick={() => openRoom('booking')}><span>03 / BOOKING</span><small>PRODUCTION REQUEST</small></button>
            </div>}
          </div>
        </nav>
      </header>

      <section id="top" className="hero chamber">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="hero-core" aria-hidden="true">
          <div className="core-ring" />
          <div className="core-point" />
        </div>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
            <p className="kicker">A CREATIVE UNIVERSE</p>
          <h1>
            AURALCRAFT<span>VERSE</span>
          </h1>
          <p className="hero-line">
            Sound. Technology. Culture.
            <br />
            Crafted beyond the moment.
          </p>
        </div>
        <button className="enter-link" onClick={() => go('reveal')}>
          <span>ENTER THE VERSE</span>
          <ArrowDown size={16} />
        </button>
        <div className="hero-index">01 / 09</div>
      </section>

      <section id="reveal" className="reveal chamber">
        <div className="section-meta">
          <span>02</span>
          <span>THE REVEAL</span>
        </div>
        <div className="monolith" aria-hidden="true">
          <div className="monolith-frame" />
          <div className="monolith-frame frame-inner" />
          <div className="monolith-line line-a" />
          <div className="monolith-line line-b" />
          <div className="monolith-orbit" />
          <div className="monolith-orbit orbit-secondary" />
          <div className="monolith-node" />
          <span className="monolith-label label-top">ACV / 02</span>
          <span className="monolith-label label-bottom">A SYSTEM FOR MAKING</span>
        </div>
        <div className="reveal-copy">
          <p className="kicker">THE VERSE / A DECLARATION</p>
          <h2>
            Not a genre.
            <br />
            <em>A world.</em>
          </h2>
          <p className="reveal-lead">
            Auralcraftverse is an independent creative universe built where sound,
            technology, culture and human craft meet. It is a place to make things,
            test ideas, preserve what matters and develop work beyond the moment.
          </p>
          <div className="reveal-statement">
            <span>THE PRINCIPLE</span>
            <strong>Build the work.<br />Build the world around it.</strong>
          </div>
          <div className="reveal-domains">
            {revealDomains.map(domain => (
              <button key={domain.code} className="reveal-domain" onClick={() => revealAndGo(domain.action)}>
                <span>{domain.code}</span>
                <div><strong>{domain.title}</strong><small>{domain.copy}</small></div>
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>
          <div className="reveal-footnote">THE FIRST DOOR OPENS HERE. THE ARCHITECTURE REVEALS ITSELF AS YOU EXPLORE.</div>
        </div>
      </section>

      {activeRoom && <div className="room-layer">
      {activeRoom === 'works' && <section id="works" className="works chamber">
        <div className="section-meta">
          <span>03</span>
          <span>WORKS</span>
        </div>
          <div className="works-layout">
          <div className="works-intro">
            <p className="kicker">SONIC EVIDENCE / SELECTED RECORDS</p>
            <h2>What we<br /><em>leave behind.</em></h2>
            <p className="body-copy">A record is more than an output. It is evidence of decisions made, ideas developed and moments given form.</p>
            <div className="works-index">
              <div><span>RECORDS</span><strong>{String(works.length).padStart(2, '0')}</strong></div>
              <div><span>STATUS</span><strong>LISTENING</strong></div>
            </div>
            <div className="works-principle">
              <span>THE RECORD</span>
              <p>Selected works from across the universe. Press play. Follow the evidence.</p>
            </div>
          </div>
          <div className="works-records">
            <div className="works-records-head"><span>ACV / WORKS / 03</span><span>SELECTED OUTPUT</span></div>
            <div className="works-players" aria-label="Selected works Spotify players">
              {works.map(([artist, title, trackId], index) => (
                <article className="work-player" key={trackId}>
                  <div className="work-player-meta">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><strong>{title}</strong><small>{artist}</small></div>
                    <i aria-hidden="true">AURAL RECORD</i>
                  </div>
                  <iframe title={artist + ' — ' + title} src={'https://open.spotify.com/embed/track/' + trackId + '?utm_source=generator'} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
                </article>
              ))}
            </div>
            <div className="works-records-foot"><span>LISTEN / TRACE / CONTEXT</span><span>THE ARCHIVE CONTINUES</span></div>
          </div>
        </div>
      </section>}

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
                    if (index === 1) openRoom('mixmind');
                    if (index === 2) openRoom('hush');
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

      {activeRoom === 'human' && <section id="human" className="human chamber">
        <div className="section-meta">
          <span>06</span>
          <span>HUMAN CRAFT</span>
        </div>
        <div className="human-statement">
          <div className="signal" aria-hidden="true">
            <div />
          </div>
          <p className="kicker">FLOOR 04 / THE METHOD</p>
          <blockquote>
            Technology changes.
            <br />
            <em>Craft remains.</em>
          </blockquote>
        </div>
        <div className="human-details">
          <p>
            Machines can measure. Tools can assist. But the record still begins
            with a human decision — what to say, what to keep, what to remove,
            what to make matter.
          </p>
          <div className="method-grid">
            <article><span>01</span><strong>LISTEN</strong><p>Understand the idea before touching the sound.</p></article>
            <article><span>02</span><strong>SHAPE</strong><p>Make deliberate choices about arrangement, tone and space.</p></article>
            <article><span>03</span><strong>REFINE</strong><p>Remove what weakens the record and strengthen what gives it identity.</p></article>
            <article><span>04</span><strong>RELEASE</strong><p>Finish with intention. The work leaves the room when it is ready.</p></article>
          </div>
        </div>
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

      {activeRoom === 'research' && <section id="research" className="research chamber">
        <div className="section-meta"><span>07A</span><span>RESEARCH / THE CULTURAL LAYER</span></div>
        <div className="research-heading">
          <div>
            <p className="kicker">FLOOR 07A / CULTURAL RESEARCH</p>
            <h2>Stay curious.<br /><em>Go deeper.</em></h2>
          </div>
          <p>Not everything needs to become a product. Some things need to be observed, questioned, tested and understood before they become part of the work.</p>
        </div>
        <div className="research-field">
          <div className="research-orbit" aria-hidden="true"><span></span><i></i><b></b></div>
          <div className="research-copy">
            <span className="research-index">ACV / FIELD NOTES / 07A</span>
            <h3>THE CULTURAL LAYER</h3>
            <p>Auralcraftverse treats research as part of creative practice: listening to culture, studying sound, observing technology, testing ideas and preserving the discoveries that sharpen the craft.</p>
          </div>
        </div>
        <div className="research-signals">{researchSignals.map(signal => <article key={signal.number}><span>{signal.number}</span><strong>{signal.title}</strong><p>{signal.copy}</p></article>)}</div>
        <div className="research-footer"><span>OBSERVE / QUESTION / EXPERIMENT / DOCUMENT</span><span>THE FIELD REMAINS OPEN</span></div>
      </section>}

      {activeRoom === 'assembly' && <section id="assembly" className="assembly chamber">
        <div className="assembly-background" aria-hidden="true">
          <div className="assembly-vignette" />
          <div className="assembly-stars" />
          <div className="assembly-orbit orbit-a" />
          <div className="assembly-orbit orbit-b" />
          <div className="assembly-orbit orbit-c" />
          <div className="craft-trajectory" />
          <div className="the-craft" aria-label="The Craft">
            <span className="craft-glow" />
            <span className="craft-body" />
            <span className="craft-wing wing-left" />
            <span className="craft-wing wing-right" />
            <span className="craft-engine engine-one" />
            <span className="craft-engine engine-two" />
          </div>
        </div>

        <div className="section-meta">
          <span>07B</span>
          <span>THE ASSEMBLY</span>
        </div>

        <div className="assembly-header">
          <div>
            <p className="kicker">FLOOR 07B / THE ASSEMBLY</p>
            <h2>NO UNIVERSE<br /><em>EXISTS ALONE.</em></h2>
            <p>The Assembly is the people who enter, create, collaborate, discover and help shape Auralcraftverse.</p>
          </div>
          <div className="assembly-seal">
            <span>ACV</span>
            <strong>07B</strong>
            <small>THE ASSEMBLY</small>
          </div>
        </div>

        <div className="assembly-field">
          <article className="assembly-node node-invited">
            <div className="assembly-node-icon"><Users size={20} strokeWidth={1.1} /></div>
            <div><span>01</span><h3>THE INVITED</h3><p>Artists. Producers. Writers. Creators.</p><em>Those who arrive with an idea.</em></div>
          </article>
          <article className="assembly-node node-craft">
            <div className="assembly-node-icon"><Wrench size={20} strokeWidth={1.1} /></div>
            <div><span>02</span><h3>THE CRAFT</h3><p>Engineers. Musicians. Designers. Technologists.</p><em>Those who shape what the idea becomes.</em></div>
          </article>
          <article className="assembly-node node-curators">
            <div className="assembly-node-icon"><Layers3 size={20} strokeWidth={1.1} /></div>
            <div><span>03</span><h3>THE CURATORS</h3><p>Researchers. Selectors. Cultural observers.</p><em>Those who give context to the work.</em></div>
          </article>
          <article className="assembly-node node-listeners">
            <div className="assembly-node-icon"><Eye size={20} strokeWidth={1.1} /></div>
            <div><span>04</span><h3>THE LISTENERS</h3><p>The people who encounter the work.</p><em>Those who complete the circuit by listening.</em></div>
          </article>
          <div className="craft-label">THE CRAFT</div>
        </div>

        <div className="assembly-open-door">
          <p className="kicker">THE OPEN DOOR</p>
          <h3>THERE IS NO FINAL ROSTER.</h3>
          <p>Auralcraftverse is built by those who contribute to it. Some arrive to create. Some arrive to collaborate. Some arrive to observe. Some arrive simply to listen.</p>
          <button className="text-link" onClick={() => go('top')}>RETURN TO THE VERSE <ArrowUpRight size={15} /></button>
        </div>

        <div className="assembly-footer">
          <span>CREATE / COLLABORATE / CONTRIBUTE / DISCOVER / LISTEN</span>
          <span>THE FIELD REMAINS OPEN</span>
        </div>
      </section>}

      {activeRoom === 'mind' && <section id="mind" className="mind chamber">
        <div className="section-meta"><span>08</span><span>THE MIND</span></div>
        <div className="mind-header">
          <div>
            <p className="kicker">FLOOR 08 / THE CONSCIOUSNESS</p>
            <h2>Every universe<br /><em>begins as an idea.</em></h2>
            <p>The mind behind Auralcraftverse is not presented as a monument. It is the aperture through which the architecture becomes legible: a producer, artist, songwriter and creative architect imagining what sound, technology, culture and human craft can become when they are built as one universe.</p>
          </div>
          <div className="mind-seal" aria-hidden="true"><div className="mind-seal-orbit" /><div className="mind-seal-core" /><span>ACV / 08</span></div>
        </div>
        <div className="mind-field">
          <div className="mind-portrait-field" aria-hidden="true">
            <div className="mind-orbit mind-orbit-a" /><div className="mind-orbit mind-orbit-b" /><div className="mind-orbit mind-orbit-c" />
            <div className="mind-node node-gold" /><div className="mind-node node-cyan" /><div className="mind-node node-white" /><div className="mind-axis" />
            <span className="mind-coordinate">THE ARCHITECT / 01</span>
          </div>
          <div className="mind-thoughts">
            <article><span>01 / SOUND</span><h3>What does sound become when treated as architecture?</h3><p>Records are not simply assembled. They are shaped, given tension, space, identity and a reason to exist.</p></article>
            <article><span>02 / CRAFT</span><h3>What survives when shortcuts are removed?</h3><p>Originality begins with attention: listening deeply, making deliberate choices and protecting the character of the work.</p></article>
            <article><span>03 / TECHNOLOGY</span><h3>What should technology do for the artist?</h3><p>Technology belongs in service of the work — extending perception, reducing friction and opening new ways to create.</p></article>
            <article><span>04 / TIME</span><h3>What are we building that should still matter decades from now?</h3><p>Auralcraftverse is designed as an evolving body of work: something that can outlive the moment that produced it.</p></article>
          </div>
        </div>
        <div className="mind-reveal">
          <span className="mind-reveal-index">THE ARCHITECT</span>
          <div><h3>MAYOWA BHADMUS</h3><p>Producer · Artist · Songwriter · Creative Architect</p></div>
          <p className="mind-reveal-copy">The universe is larger than its creator. But every universe carries the imprint of the mind that imagined it.</p>
        </div>
        <div className="mind-footer"><span>SOUND / CRAFT / CULTURE / TECHNOLOGY / TIME</span><span>THE MIND REMAINS IN MOTION</span></div>
      </section>}

      {activeRoom === 'mixmind' && <section className="tool-room chamber mixmind-room">
        <div className="section-meta"><span>TOOL / 01</span><span>MIXMIND / AURALCRAFTVERSE</span></div>
        <div className="tool-room-head"><div><p className="kicker">PRODUCER INTELLIGENCE</p><h2>Listen.<br /><em>Decide.</em></h2><p>MixMind remains its own tool — its own UX, its own working environment — but it now lives as a chamber inside the Auralcraftverse.</p></div><button className="text-link" onClick={() => go('top')}>RETURN TO THE VERSE <ArrowUpRight size={15} /></button></div>
        <div className="tool-frame"><iframe title="MixMind by Auralcraftverse" src="https://mixmind-ai-uj4ort.v2.appdeploy.ai/" loading="lazy" allow="microphone" /></div>
        <div className="tool-room-foot"><span>ACV / TOOL CHAMBER / MIXMIND</span><span>THE UX IS DISTINCT. THE UNIVERSE IS SHARED.</span></div>
      </section>}

      {activeRoom === 'hush' && <section className="tool-room chamber hush-room">
        <div className="section-meta"><span>TOOL / 02</span><span>HUSH DENOISE / AURALCRAFTVERSE</span></div>
        <div className="tool-room-head"><div><p className="kicker">PROFESSIONAL AUDIO RESTORATION</p><h2>Make the noise<br /><em>disappear.</em></h2><p>Restore and clean audio in Hush Denoise. Processing runs locally on your device, while the Auralcraftverse environment stays around the tool.</p></div><button className="text-link" onClick={() => go('top')}>RETURN TO THE VERSE <ArrowUpRight size={15} /></button></div>
        <div className="tool-frame"><iframe title="Hush Denoise by Auralcraftverse" src="https://hush-denoise-by-auralcraftverse-wc3fxc.v2.appdeploy.ai/" loading="lazy" /></div>
        <div className="tool-room-foot"><span>ACV / TOOL CHAMBER / HUSH</span><span>THE UX WILL BE DISTINCT. THE UNIVERSE WILL BE SHARED.</span></div>
      </section>}

      

      </div>}

      <section id="origin" className="origin chamber">
        <div className="section-meta">
          <span>09</span>
          <span>THE ORIGIN</span>
        </div>
        <div className="origin-grid">
          <div className="origin-intro">
            <p className="kicker">EVERY UNIVERSE HAS AN ORIGIN</p>
            <h2>Rooted here.<br /><em>Built for beyond.</em></h2>
            <p className="origin-lead">Auralcraftverse did not appear fully formed. It is the present shape of a creative practice that began with sound and kept asking what could exist beyond it.</p>
          </div>
          <div className="origin-archive" aria-label="Auralcraftverse origin layers">
            <div className="origin-root-system" aria-hidden="true">
              <span className="root-axis" />
              <span className="root-branch root-branch-a" />
              <span className="root-branch root-branch-b" />
              <span className="root-branch root-branch-c" />
              <span className="root-branch root-branch-d" />
              <span className="root-node root-node-a" />
              <span className="root-node root-node-b" />
              <span className="root-node root-node-c" />
              <span className="root-node root-node-d" />
              <span className="origin-orbit origin-orbit-a" />
              <span className="origin-orbit origin-orbit-b" />
              <span className="origin-orbit origin-orbit-c" />
              <span className="origin-signal" />
            </div>
            <div className="origin-records">
              <article>
                <span>01 / THE ROOT</span>
                <strong>2011</strong>
                <p>The beginning of the creative practice from which the present architecture grew.</p>
              </article>
              <article>
                <span>02 / THE TRANSFORMATION</span>
                <strong>FROM SOUND TO SYSTEM</strong>
                <p>Music expanded into production, artistry, curation, research and purpose-built technology.</p>
              </article>
              <article>
                <span>03 / THE VERSE</span>
                <strong>NOW / OPEN-ENDED</strong>
                <p>Auralcraftverse is the current form — designed to keep evolving rather than arrive at a final shape.</p>
              </article>
            </div>
          </div>
        </div>
        <div className="origin-declaration">
          <span>THE CARRYING FORWARD</span>
          <p>WE DIDN'T BUILD A WORLD TO ESCAPE FROM THE ONE WE CAME FROM.<br /><em>WE BUILT ONE TO CARRY IT FORWARD.</em></p>
        </div>
        <div className="origin-footer-line"><span>ROOT / TRANSFORM / BUILD / CONTINUE</span><span>ACV / 09</span></div>
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
            <p>Creative institution for sound, technology and culture.</p>
          </div>
          <div className="footer-links">
            <button onClick={() => go('top')}>VERSE</button>
            <button onClick={() => go('reveal')}>REVEAL</button>
            <button onClick={() => openRoom('works')}>WORKS</button>
            <button onClick={() => openRoom('tools')}>TOOLS</button>
            <button onClick={() => go('origin')}>ORIGIN</button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>AURALCRAFTVERSE / 2026</span>
          <span>BUILT TO OUTLIVE THE MOMENT.</span>
        </div>
      </footer>
    </main>
  );
}

export default App;
