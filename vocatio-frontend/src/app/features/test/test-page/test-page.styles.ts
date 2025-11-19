export const testPageStyles = `
:host {
  display: block;
  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(59, 130, 246, 0.25), transparent 30%), #030712;
  color: #e2e8f0;
  overflow-x: hidden;
}

.test-shell {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.test-hero {
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease-out;
}

.hero-copy {
  max-width: 600px;
}

.eyebrow {
  color: #fbbf24;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.hero-copy h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-copy p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  font-size: 1.1rem;
}

.test-progress {
  margin-top: 2rem;
  animation: slideIn 0.6s ease-out 0.3s both;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}

.progress-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 500;
}

.loading-section,
.error-section,
.question-section,
.actions-section {
  width: 100%;
  max-width: 600px;
  animation: fadeInScale 0.6s ease-out;
}

.loading-card,
.error-card,
.question-card,
.results-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.loading-card p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
}

.error-card h2 {
  color: #fb7185;
  margin-bottom: 1rem;
}

.error-card p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
}

.question-card {
  animation: slideInFromBottom 0.6s ease-out;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.question-icon {
  font-size: 2rem;
  animation: pulse 2s infinite;
}

.question-card h2 {
  color: #fff;
  font-size: 1.5rem;
  margin: 0;
  line-height: 1.4;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.option-button {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.option-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.option-button:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.option-button:hover::before {
  left: 100%;
}

.option-button:active {
  transform: translateY(0);
}

.results-card {
  animation: bounceIn 0.8s ease-out;
}

.results-card h2 {
  color: #fbbf24;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.results-card p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.results-summary h3 {
  color: #fff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.results-summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.results-summary li {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #fff;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.results-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.navigation-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.primary-action,
.secondary-action {
  border-radius: 50px;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  min-width: 140px;
}

.primary-action {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #fff;
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(139, 92, 246, 0.6);
}

.secondary-action {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  backdrop-filter: blur(10px);
}

.secondary-action:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .test-shell {
    padding: 1rem;
    gap: 1.5rem;
  }

  .hero-copy h1 {
    font-size: 2.5rem;
  }

  .question-card h2 {
    font-size: 1.3rem;
  }

  .options-grid {
    gap: 0.75rem;
  }

  .option-button {
    padding: 1rem;
    font-size: 0.95rem;
  }

  .results-actions,
  .navigation-actions {
    flex-direction: column;
    align-items: center;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .test-shell {
    padding: 0.75rem;
  }

  .hero-copy h1 {
    font-size: 2rem;
  }

  .loading-card,
  .error-card,
  .question-card,
  .results-card {
    padding: 1.5rem;
  }
}
`;
