export const homePageStyles = `
:host {
  display: block;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.home-shell {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.home-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, rgba(136,97,154,0.1) 0%, rgba(51,164,116,0.1) 100%);
  border-radius: 2rem;
  margin-bottom: 3rem;
}

.hero-copy {
  max-width: 800px;
}

.eyebrow {
  font-weight: 700;
  color: var(--analyst-purple);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.hero-copy h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  margin-bottom: 1.5rem;
  color: var(--text-color);
  line-height: 1.2;
}

.hero-copy p {
  font-size: 1.25rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.primary-action,
.secondary-action {
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
}

.primary-action {
  background-color: var(--analyst-purple);
  color: white;
  box-shadow: 0 4px 14px rgba(136,97,154,0.4);
}

.primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(136,97,154,0.6);
}

.secondary-action {
  background-color: white;
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

.secondary-action:hover {
  transform: translateY(-2px);
  border-color: var(--analyst-purple);
  color: var(--analyst-purple);
}

.characters {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.character-card {
  width: 100px;
  height: 140px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.5rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.character-card:hover {
  transform: scale(1.05) rotate(2deg);
}

.analyst { background-color: var(--analyst-purple); }
.diplomat { background-color: var(--diplomat-green); }
.sentinel { background-color: var(--sentinel-blue); }
.explorer { background-color: var(--explorer-yellow); }

.status-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  text-align: left;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.status-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: var(--text-color);
}

.profile-panel {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  width: min(360px, 100%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.profile-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--text-color);
}

.profile-email {
  margin: 0.25rem 0;
  color: #718096;
  font-weight: 500;
}

.profile-meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: #4a5568;
  font-size: 0.95rem;
}

.profile-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.profile-feedback {
  margin: 0;
  color: var(--explorer-yellow);
  font-size: 0.9rem;
}

.profile-form {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-header h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color);
}

.ghost {
  background: transparent;
  border: none;
  color: var(--sentinel-blue);
  font-weight: 600;
  cursor: pointer;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--text-color);
}

.field input,
.field textarea {
  background: #f7fafc;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  font-size: 0.95rem;
  font-family: var(--font-family-base);
}

.field textarea {
  min-height: 5rem;
  resize: vertical;
}

.field-error {
  color: #e53e3e;
  font-size: 0.75rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.danger-action {
  border-color: #fc8181;
  color: #e53e3e;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

header .subtitle {
  color: #718096;
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

.resource-card {
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s;
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}

.resource-card h4 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--analyst-purple);
}

.resource-card p {
  margin: 0;
  color: #4a5568;
  line-height: 1.5;
}

.resource-card small {
  color: #a0aec0;
  font-weight: 600;
}

.feedback {
  margin-top: 1rem;
  color: var(--diplomat-green);
  font-weight: 600;
}

@media (max-width: 720px) {
  .home-shell {
    padding: 1rem;
  }
  
  .hero-copy h1 {
    font-size: 2.5rem;
  }
  
  .characters {
    gap: 1rem;
  }
  
  .character-card {
    width: 80px;
    height: 110px;
    font-size: 1.2rem;
  }
}
`;
