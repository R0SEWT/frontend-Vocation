export const authLayoutStyles = `
:host {
  display: block;
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 45%),
    #050816;
  color: #e2e8f0;
}

.app-shell {
  min-height: 100vh;
  padding: 2rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-shell {
  width: min(1200px, 100%);
  background: rgba(15, 23, 42, 0.9);
  border-radius: 2rem;
  box-shadow: 0 25px 60px rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(18px);
  display: flex;
  gap: 2rem;
  overflow: hidden;
}

.intro-panel {
  flex: 1.1;
  background: linear-gradient(160deg, rgba(236, 72, 153, 0.25), rgba(59, 130, 246, 0.2));
  padding: 3rem;
  display: flex;
  align-items: center;
}

.intro-content {
  max-width: 360px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.brand-mark {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: #0f172a;
  color: #fef3c7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.04em;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.7rem;
  margin: 0;
  color: #fbbf24;
}

.intro-content h1 {
  font-size: clamp(2.25rem, 3vw, 2.75rem);
  line-height: 1.1;
  margin: 0;
}

.intro-copy {
  margin-top: 1rem;
  color: rgba(248, 250, 252, 0.9);
  font-size: 1rem;
}

.intro-list {
  margin: 1.25rem 0 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.5rem;
  color: rgba(248, 250, 252, 0.8);
  font-size: 0.95rem;
}

.intro-list li {
  list-style: disc;
}

.auth-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

@media (max-width: 960px) {
  .auth-shell {
    flex-direction: column;
    padding: 1rem;
  }

  .intro-panel {
    order: 2;
    border-radius: 1.5rem;
  }

  .auth-panel {
    order: 1;
    padding: 1.5rem 1rem;
  }
}
`;
