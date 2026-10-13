import { useEffect, useState } from 'react';
import { ArrowUpRight, Orbit, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, supabase } from './lib/supabase';

export type EntryStage = 'arrival' | 'jumping' | 'authentication' | 'entered';
type Provider = 'google' | 'apple';

type EntryExperienceProps = {
  authReady: boolean;
  hasSession: boolean;
  initialStage: EntryStage;
  returnTo: string;
  onEnter: () => void;
};

const providerLabels: Record<Provider, string> = {
  google: 'CONTINUE WITH GOOGLE',
  apple: 'CONTINUE WITH APPLE',
};

export default function EntryExperience({
  authReady,
  hasSession,
  initialStage,
  returnTo,
  onEnter,
}: EntryExperienceProps) {
  const [stage, setStage] = useState<EntryStage>(initialStage);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (stage !== 'jumping') return;
    const timer = window.setTimeout(() => {
      setStage('entered');
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [stage, hasSession]);

  useEffect(() => {
    if (stage !== 'entered') return;
    const timer = window.setTimeout(onEnter, 650);
    return () => window.clearTimeout(timer);
  }, [stage, onEnter]);

  const beginJump = () => {
    if (!authReady) return;
    setAuthError('');
    setStage('jumping');
  };

  const signIn = async (provider: Provider) => {
    if (!supabase) {
      setAuthError('Secure sign-in is not configured for this preview yet.');
      return;
    }
    setAuthError('');
    const target = returnTo || '/';
    const redirectTo = new URL('/', window.location.origin);
    redirectTo.searchParams.set('entry', 'auth');
    redirectTo.searchParams.set('returnTo', target);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo.toString() },
    });
    if (error) setAuthError(error.message || 'Sign-in could not be started. Please try again.');
  };

  return (
    <main className={`entry-experience entry-stage-${stage}`} aria-live="polite">
      <div className="entry-stars" aria-hidden="true" />
      <div className="entry-nebula entry-nebula-a" aria-hidden="true" />
      <div className="entry-nebula entry-nebula-b" aria-hidden="true" />
      <div className="entry-orbit entry-orbit-a" aria-hidden="true" />
      <div className="entry-orbit entry-orbit-b" aria-hidden="true" />
      <div className="entry-grid" aria-hidden="true" />
      <div className="entry-wormhole" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="entry-topline">
        <span>AURALCRAFTVERSE / ACV-001</span>
        <span>INDEPENDENT CREATIVE ECOSYSTEM</span>
      </div>

      <section className="entry-content">
        <div className="entry-emblem" aria-hidden="true">
          <div className="entry-emblem-ring" />
          <div className="entry-emblem-core" />
          {stage === 'jumping' ? <Rocket size={31} strokeWidth={1.1} /> : <Orbit size={26} strokeWidth={1} />}
        </div>

        {stage === 'arrival' && (
          <div className="entry-copy">
            <p className="entry-kicker">LAUNCH SITE / ORIGIN 001</p>
            <h1>ENTER THE<br /><span>AURALCRAFTVERSE</span></h1>
            <p className="entry-subtitle">An Independent Creative Ecosystem</p>
            <button className="jump-control" onClick={beginJump} disabled={!authReady}>
              <span className="jump-control-icon"><Rocket size={19} strokeWidth={1.4} /></span>
              <span className="jump-control-copy"><strong>INITIATE JUMP</strong><small>{authReady ? 'ENTER THE UNKNOWN' : 'ESTABLISHING SECURE CONNECTION'}</small></span>
              <ArrowUpRight size={17} />
            </button>
            <p className="entry-footnote">THE ECOSYSTEM REMAINS BEYOND THE THRESHOLD</p>
          </div>
        )}

        {stage === 'jumping' && (
          <div className="jump-sequence" role="status">
            <div className="jump-core"><span /><span /><span /></div>
            <p className="entry-kicker">JUMP SEQUENCE ACTIVE</p>
            <h2>ARRIVING AT DESTINATION</h2>
            <p>WORMHOLE TRANSIT COMPLETE · AURALCRAFTVERSE INBOUND</p>
            <div className="jump-progress"><span /></div>
          </div>
        )}

        {stage === 'authentication' && (
          <div className="entry-auth">
            <p className="entry-kicker">IDENTITY CHECKPOINT / 01</p>
            <h1>{hasSession ? 'IDENTITY<br /><span>CONFIRMED.</span>' : 'CONTINUE<br /><span>YOUR JOURNEY.</span>'}</h1>
            <p className="entry-auth-copy">
              {hasSession
                ? 'Your identity is verified. Complete the jump to enter the Auralcraftverse.'
                : 'Create your free account or sign in to complete the jump. Membership subscriptions remain optional.'}
            </p>
            {hasSession ? (
              <button className="jump-control jump-control-primary" onClick={() => setStage('entered')}>
                <span className="jump-control-icon"><ShieldCheck size={19} strokeWidth={1.4} /></span>
                <span className="jump-control-copy"><strong>COMPLETE JUMP</strong><small>ACCESS VERIFIED</small></span>
                <ArrowUpRight size={17} />
              </button>
            ) : (
              <div className="entry-provider-list">
                {(['google', 'apple'] as Provider[]).map((provider) => (
                  <button key={provider} className="provider-button" onClick={() => void signIn(provider)} disabled={!authReady || !isSupabaseConfigured}>
                    <span className={`provider-symbol provider-${provider}`}>{provider === 'google' ? 'G' : '●'}</span>
                    {providerLabels[provider]}
                    <ArrowUpRight size={15} />
                  </button>
                ))}
              </div>
            )}
            {!isSupabaseConfigured && (
              <p className="entry-setup-note"><Sparkles size={14} /> Preview setup required: Supabase URL and publishable/anon key must be configured before sign-in can be tested.</p>
            )}
            {authError && <p className="entry-auth-error" role="alert">{authError}</p>}
            <p className="entry-footnote">FREE ACCOUNT REQUIRED · SUBSCRIPTION OPTIONAL</p>
          </div>
        )}

        {stage === 'entered' && (
          <div className="arrival-flash" role="status">
            <Sparkles size={28} strokeWidth={1} />
            <p>ARRIVING AT DESTINATION</p>
          </div>
        )}
      </section>

      <div className="entry-bottomline">
        <span>ORIGIN / 001</span>
        <span>{stage === 'jumping' ? 'WORMHOLE TRANSIT IN PROGRESS' : stage === 'authentication' ? 'SECURE ACCESS PORTAL' : 'ACCESS POINT / 01'}</span>
        <span>TOOLS · KNOWLEDGE · MUSIC · PEOPLE</span>
      </div>
      <div className="entry-transition-flare" aria-hidden="true" />
    </main>
  );
}
