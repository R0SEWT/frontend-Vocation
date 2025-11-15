export const authFormStyles = `
:host {
  display: block;
  width: 100%;
}

.auth-card {
  width: min(420px, 100%);
  background: #0f172a;
  border-radius: 1.5rem;
  padding: 2.25rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 25px 45px rgba(2, 6, 23, 0.65);
}

.auth-card h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #e2e8f0;
}

.subtitle {
  margin-top: 0.35rem;
  margin-bottom: 1.75rem;
  color: #94a3b8;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #cbd5f5;
}

.field input {
  background: #020617;
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.9rem 1rem;
  font-size: 1rem;
}

.field input:focus {
  border-color: transparent;
  outline: 2px solid #6366f1;
}

.field input.invalid {
  border-color: #fb7185;
}

.field-error {
  color: #fb7185;
  font-size: 0.75rem;
}

.primary-action {
  width: 100%;
  border: none;
  padding: 0.95rem 1.1rem;
  border-radius: 0.95rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-action:focus-visible {
  outline: 3px solid rgba(99, 102, 241, 0.6);
  outline-offset: 2px;
}

.primary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 35px rgba(99, 102, 241, 0.35);
}

.note {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #cbd5f5;
}

.note a {
  color: #a855f7;
  text-decoration: none;
  font-weight: 600;
}

.feedback {
  margin-top: 1rem;
  min-height: 1.25rem;
  font-size: 0.9rem;
}

.feedback.success {
  color: #4ade80;
}

.feedback.error {
  color: #fb7185;
}

`;
