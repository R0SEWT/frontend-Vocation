export const testPageStyles = `
:host {
  display: block;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.test-shell {
  padding: 2rem;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.test-hero {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.test-hero h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--text-color);
}

.test-hero .subtitle {
  color: #718096;
  max-width: 600px;
  line-height: 1.6;
  margin: 0 auto;
  font-size: 1.1rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.85rem;
  color: var(--analyst-purple);
  font-weight: 700;
  margin: 0;
}

.status {
  font-size: 1rem;
  color: #e53e3e;
  text-align: center;
  font-weight: 600;
}

.test-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.progress-bar {
  flex: 1;
  height: 12px;
  background: #edf2f7;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--diplomat-green), var(--sentinel-blue));
  border-radius: inherit;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 1rem;
  color: #4a5568;
  font-weight: 700;
  min-width: 60px;
  text-align: right;
}

.loading-section {
  display: flex;
  justify-content: center;
}

.loading-card {
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  background: white;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  color: var(--text-color);
  font-weight: 600;
}

.test-header {
  display: none;
}

.question-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.05);
}

.question-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.question-icon {
  font-size: 2rem;
  background: #f7fafc;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.question-card h2 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.3;
  color: var(--text-color);
  padding-top: 0.5rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.option-button {
  border-radius: 1rem;
  padding: 1.25rem;
  border: 2px solid var(--border-color);
  font-size: 1rem;
  cursor: pointer;
  background: white;
  color: var(--text-color);
  transition: all 0.2s ease;
  font-weight: 600;
  text-align: left;
  font-family: var(--font-family-base);
  min-height: 100%;
}

.option-button:hover {
  border-color: var(--analyst-purple);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.option-button.selected {
  background: var(--analyst-purple);
  color: white;
  border-color: var(--analyst-purple);
  box-shadow: 0 10px 20px rgba(136,97,154,0.3);
}

.insight-notes {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.insight-notes label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.95rem;
  color: var(--text-color);
}

.insight-notes textarea {
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: #f8fafc;
  color: var(--text-color);
  resize: none;
  padding: 0.75rem;
  font-family: inherit;
}

.insight-note-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.field-hint {
  color: #718096;
}

.field-error {
  color: #e53e3e;
}

.actions-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.navigation-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.primary-action,
.secondary-action {
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
}

.primary-action {
  background: var(--analyst-purple);
  color: white;
  box-shadow: 0 4px 14px rgba(136,97,154,0.4);
}

.primary-action:hover,
.secondary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.secondary-action {
  background: white;
  border: 2px solid var(--border-color);
  color: var(--text-color);
}

.secondary-action:hover {
  border-color: var(--analyst-purple);
  color: var(--analyst-purple);
}

.secondary-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  border-color: var(--border-color);
  color: #a0aec0;
}

.results-card {
  padding: 2.5rem;
  border-radius: 2rem;
  background: white;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  text-align: center;
  align-items: center;
}

.results-card h2 {
  color: var(--diplomat-green);
  font-size: 2rem;
  margin: 0;
}

.results-summary {
  width: 100%;
  max-width: 500px;
  text-align: left;
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 1rem;
}

.results-summary h3 {
  margin-top: 0;
  color: var(--text-color);
}

.results-summary ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #4a5568;
}

.results-summary li {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.results-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.insights-panel {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  text-align: left;
}

.insights-panel h3 {
    color: var(--analyst-purple);
    margin: 0 0 0.5rem 0;
}

.insights-grid {
  display: grid;
  grid-template-columns: minmax(260px, 320px) 1fr;
  gap: 1.5rem;
  align-items: center;
}

.mbti-highlight {
  background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 45%),
    linear-gradient(135deg, var(--analyst-purple), var(--diplomat-green));
  color: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 14px 28px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.mbti-figure {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.mbti-head {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  color: #2d3748;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.mbti-eyes {
  font-size: 1.75rem;
  letter-spacing: 0.3rem;
  line-height: 1;
  transform: translateX(0.15rem);
}

.mbti-mouth {
  width: 32px;
  height: 10px;
  background: #2d3748;
  border-radius: 999px;
  margin-top: 0.3rem;
  display: inline-block;
}

.mbti-body {
  width: 140px;
  height: 80px;
  border-radius: 80px 80px 28px 28px;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  margin-top: -12px;
}

.mbti-badge {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #2d3748;
  color: white;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-weight: 800;
  letter-spacing: 0.08em;
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
}

.mbti-caption {
  margin: 0;
  font-weight: 700;
}

.insights-detail {
  background: #f7fafc;
  border-radius: 1.25rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.insights-block h4 {
  margin: 0 0 0.35rem 0;
  color: var(--text-color);
}

.insights-block ul {
  margin: 0;
  padding-left: 1.25rem;
  color: #4a5568;
}

.qualities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quality-chip {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.4rem 0.8rem;
  font-weight: 700;
  color: var(--text-color);
  box-shadow: 0 6px 14px rgba(0,0,0,0.05);
}

.insights-loading {
  color: var(--sentinel-blue);
  font-size: 0.9rem;
  font-style: italic;
}

.insights-careers ul {
  margin: 0.35rem 0 0;
  padding-left: 1.25rem;
  color: var(--text-color);
}

.profile-summary {
  color: var(--text-color);
  line-height: 1.6;
  background: #fffbeb;
  padding: 1rem;
  border-radius: 0.75rem;
  border-left: 4px solid var(--explorer-yellow);
}

.empty {
  color: #d69e2e;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 640px) {
  .test-shell {
    padding: 1rem;
  }
  .question-card h2 {
    font-size: 1.25rem;
  }
  .options-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .insights-grid {
    grid-template-columns: 1fr;
  }
  .results-actions {
    flex-direction: column;
    width: 100%;
  }
  .primary-action, .secondary-action {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .options-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .options-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
`;
