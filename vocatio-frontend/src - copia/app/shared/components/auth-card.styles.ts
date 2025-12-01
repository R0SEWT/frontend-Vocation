export const authCardStyles = `
:host {
  display: block;
  width: 100%;
}

.auth-card {
  width: min(420px, 100%);
  background: var(--card-bg);
  border-radius: 2rem;
  padding: 2.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.auth-card h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-color);
}

.eyebrow {
  font-weight: 700;
  color: var(--analyst-purple);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  color: #718096;
  line-height: 1.5;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  color: var(--text-color);
  font-weight: 600;
}

.field input,
.field button,
.field select {
  background: #f7fafc;
  border: 2px solid var(--border-color);
  color: var(--text-color);
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  font-family: var(--font-family-base);
  transition: border-color 0.2s;
}

.field input:focus,
.field select:focus,
.field button:focus-visible {
  border-color: var(--analyst-purple);
  outline: none;
  background: white;
}

.field input.invalid,
.field select.invalid {
  border-color: #fc8181;
}

.field-error {
  color: #e53e3e;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.primary-action {
  width: 100%;
  border: none;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  background: var(--analyst-purple);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 1rem;
  box-shadow: 0 4px 14px rgba(136,97,154,0.4);
}

.primary-action[disabled] {
  opacity: 0.8;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.primary-action .label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.primary-action .loading-indicator {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  animation: spin 0.85s linear infinite;
}

.primary-action.loading {
  pointer-events: none;
  box-shadow: none;
}

.primary-action:not(.loading) .loading-indicator {
  display: none;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.primary-action:focus-visible {
  outline: 3px solid rgba(136,97,154, 0.6);
  outline-offset: 2px;
}

.primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(136,97,154,0.6);
}

.primary-action:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.secondary-action {
  width: 100%;
  background: transparent;
  border: 2px solid var(--border-color);
  margin-top: 0.5rem;
}

.note {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #718096;
  text-align: center;
}

.note a {
  color: var(--analyst-purple);
  text-decoration: none;
  font-weight: 700;
}

.note a:hover {
  text-decoration: underline;
}

.feedback {
  margin-top: 1rem;
  min-height: 1.25rem;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 600;
}

.feedback.success {
  color: var(--diplomat-green);
}

.feedback.error {
  color: #e53e3e;
}

.policy-list {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #718096;
  display: grid;
  gap: 0.25rem;
}

.policy-list li {
  list-style: disc;
  margin-left: 1.25rem;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-row input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.4rem;
  accent-color: var(--analyst-purple);
}
`;
