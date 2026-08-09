import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Swords, Target, UserPlus, Gamepad2, ChevronRight, Sparkles } from 'lucide-react';

const CountUp = ({ end, duration = 1600, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

const stats = [
  { icon: Users, value: 500, suffix: '+', label: 'Active players' },
  { icon: Target, value: 100, suffix: '+', label: 'Competitive teams' },
  { icon: Trophy, value: 50, suffix: '+', label: 'Tournaments hosted' },
  { icon: Swords, value: 1000, suffix: '+', label: 'Matches played' },
];

const steps = [
  { icon: UserPlus, title: 'Build your identity', text: 'Create your player or organizer profile and become part of the arena.' },
  { icon: Gamepad2, title: 'Find your next match', text: 'Join a roster, discover competitive events, or create a tournament of your own.' },
  { icon: Trophy, title: 'Play for the podium', text: 'Track matches, standings, and results as you climb toward the top.' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <img src="/logo.png" alt="ArenaLink" className="landing-logo" onClick={() => navigate('/')} />
        <div className="landing-nav-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn btn-blurple" onClick={() => navigate('/register')}>Join Arena</button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-content">
          <p className="eyebrow"><Sparkles size={14} /> The competitive gaming network</p>
          <h1 className="hero-title">Compete.<br />Connect.<br /><span className="hero-title-accent">Conquer.</span></h1>
          <p className="hero-copy">Your all-in-one home for tournaments, teams, and the moments that turn players into champions.</p>
          <div className="hero-actions">
            <button className="btn btn-blurple btn-lg" onClick={() => navigate('/tournaments')}>Explore tournaments <ChevronRight size={17} /></button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/register')}>Create your profile</button>
          </div>
        </div>
      </section>

      <section className="landing-stats" aria-label="ArenaLink community statistics">
        {stats.map(({ icon: Icon, value, suffix, label }) => (
          <div className="landing-stat" key={label}>
            <div className="landing-stat-icon"><Icon size={20} /></div>
            <div><div className="landing-stat-value"><CountUp end={value} suffix={suffix} /></div><div className="landing-stat-label">{label}</div></div>
          </div>
        ))}
      </section>

      <section className="landing-section">
        <div className="landing-section-heading">
          <p className="section-kicker">YOUR PATH TO THE PODIUM</p>
          <h2>Everything starts with one match</h2>
        </div>
        <div className="steps-grid">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <article className="landing-step" data-step={`0${index + 1}`} key={title}>
              <div className="step-icon"><Icon size={25} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta-wrap">
        <div className="landing-cta">
          <div>
            <h2>Ready to prove your skills?</h2>
            <p>Join a growing community of players, teams, and tournament hosts.</p>
          </div>
          <div className="hero-actions">
            <button className="btn btn-blurple btn-lg" onClick={() => navigate('/register')}>Join the arena</button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/tournaments')}>Browse events</button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">© 2024 ArenaLink. Play with purpose.</footer>
    </main>
  );
};

export default LandingPage;
