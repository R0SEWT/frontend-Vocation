export const homePageStyles = `
:host {
  display: block;
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(59, 130, 246, 0.25), transparent 30%), #030712;
  color: #e2e8f0;
}

.home-shell {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.home-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.hero-copy {
  max-width: 480px;
}

.hero-copy h1 {
  font-size: clamp(2.5rem, 4vw, 3rem);
  margin-bottom: 0.5rem;
}

.hero-copy p {
  color: #94a3b8;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.primary-action,
.secondary-action {
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-action {
  border: none;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #fff;
}

.primary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 35px rgba(99, 102, 241, 0.35);
}

.secondary-action {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.6);
  color: #cbd5f5;
}

.secondary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(148, 163, 184, 0.2);
}

.status-card {
  background: #0f172a;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.status-card h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #fbbf24;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

header .subtitle {
  color: #94a3b8;
  margin-top: 0.25rem;
}

.resource-card {
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 15px 30px rgba(2, 6, 23, 0.6);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.resource-card h4 {
  margin: 0;
  font-size: 1.1rem;
}

.resource-card p {
  margin: 0;
  color: #cbd5f5;
}

.resource-card small {
  color: #94a3b8;
}

.feedback {
  margin-top: 0.75rem;
  color: #fb7185;
}

@media (max-width: 720px) {
  .home-shell {
    padding: 1.5rem;
  }

  .home-hero {
    flex-direction: column;
  }
}
`;
