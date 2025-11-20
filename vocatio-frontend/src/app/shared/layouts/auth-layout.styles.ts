export const authLayoutStyles = `
:host {
  display: block;
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
}

.app-shell {
  min-height: 100vh;
  padding: 2rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-shell {
  width: min(1100px, 100%);
  background: white;
  border-radius: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  min-height: 600px;
  border: 1px solid var(--border-color);
}

.intro-panel {
  flex: 1;
  background: linear-gradient(135deg, var(--analyst-purple) 0%, var(--sentinel-blue) 100%);
  padding: 4rem;
  display: flex;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
}

/* Decorative circles */
.intro-panel::before,
.intro-panel::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.intro-panel::before {
  width: 300px;
  height: 300px;
  top: -50px;
  left: -50px;
}

.intro-panel::after {
  width: 200px;
  height: 200px;
  bottom: 50px;
  right: -50px;
}

.intro-content {
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.brand-mark {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background: white;
  color: var(--analyst-purple);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.85rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
}

.intro-content h1 {
  font-size: clamp(2.5rem, 4vw, 3rem);
  line-height: 1.1;
  margin: 0 0 1.5rem 0;
  color: white;
}

.intro-copy {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.intro-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: grid;
  gap: 1rem;
}

.intro-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-weight: 600;
}

.intro-list li::before {
  content: '✓';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 800;
}

.auth-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
}

@media (max-width: 960px) {
  .auth-shell {
    flex-direction: column;
    height: auto;
    min-height: auto;
  }

  .intro-panel {
    padding: 3rem 2rem;
    order: -1;
  }

  .auth-panel {
    padding: 2rem;
  }
}
`;
