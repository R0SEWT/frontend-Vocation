export const testPageStyles = `
:host {
  display: block;
  min-height: 100vh;
  background: linear-gradient(135deg, #020617, #050f2d);
  color: #f8fafc;
}

.test-shell {
  padding: 2rem;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.test-hero {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.test-hero h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.5rem);
}

.test-hero .subtitle {
  color: #cbd5f5;
  max-width: 560px;
  line-height: 1.6;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  color: #7dd3fc;
  margin: 0;
}

.status {
  font-size: 0.95rem;
  color: #fda4af;
}

.test-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #34d399, #10b981);
  border-radius: inherit;
}

.progress-text {
  font-size: 0.85rem;
  color: #94a3b8;
}

.loading-section {
  display: flex;
  justify-content: center;
}

.loading-card {
  padding: 1rem 1.5rem;
  border-radius: 0.85rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.test-header {
  display: none;
}

.question-card {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.question-icon {
  font-size: 1.25rem;
}

.question-card h2 {
  margin: 0;
  font-size: 1.35rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.5rem;
}

.option-button {
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  font-size: 0.95rem;
  cursor: pointer;
  background: rgba(148, 163, 184, 0.15);
  color: #f8fafc;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.option-button:hover {
  border-color: rgba(59, 130, 246, 0.4);
}

.option-button.selected {
  background: linear-gradient(135deg, #a855f7, #2563eb);
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.35);
}

.actions-section {
  display: flex;
  justify-content: flex-end;
}

.navigation-actions {
  display: flex;
  gap: 0.75rem;
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
  border: none;
}

.primary-action {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: #02111f;
}

.primary-action:hover,
.secondary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
}

.secondary-action {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.6);
  color: #cbd5f5;
}

.results-card {
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.4);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.results-summary ul {
  margin: 0;
  padding-left: 1rem;
  color: #e0f2fe;
}

.results-summary li {
  margin-bottom: 0.35rem;
}

.results-actions {
  display: flex;
  gap: 0.75rem;
}

.empty {
  color: #eab308;
}

@media (max-width: 640px) {
  .test-shell {
    padding: 1.25rem;
  }
  .question-card h2 {
    font-size: 1.1rem;
  }
}
`;
