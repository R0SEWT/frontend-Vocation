export const homePageStyles = `
  :host {
    display: block;
    min-height: 100vh;
    background-color: #f8fafc; /* Color de fondo más suave y moderno */
    color: var(--text-color);
  }

  .home-shell {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 4rem; /* Espaciado vertical consistente entre secciones */
  }

  /* --- HERO SECTION --- */
  .hero-section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
    text-align: center;
    padding: 3rem 1.5rem;
    background: linear-gradient(135deg, rgba(136,97,154,0.05) 0%, rgba(51,164,116,0.05) 100%);
    border-radius: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    border: 1px solid rgba(255,255,255,0.5);
  }

  @media (min-width: 768px) {
    .hero-section {
      grid-template-columns: 1.2fr 0.8fr; /* Texto a la izq, visual a la der */
      text-align: left;
      padding: 4rem;
    }
    .hero-actions {
      justify-content: flex-start;
    }
  }

  .highlight { color: var(--diplomat-green); }
  
  .hero-content h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.1;
    margin-bottom: 1rem;
    color: var(--text-color);
  }

  .hero-subtitle {
    font-size: 1.1rem;
    color: #64748b;
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .hero-visual {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    justify-items: center;
  }

  .character-card {
    width: 100%;
    max-width: 100px;
    aspect-ratio: 3/4;
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 1.2rem;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }
  .character-card:hover { transform: translateY(-5px); }

  /* Estilos específicos de las cartas */
  .analyst { background: var(--analyst-purple); transform: rotate(-3deg); }
  .diplomat { background: var(--diplomat-green); transform: rotate(2deg); margin-top: 1.5rem;}
  .sentinel { background: var(--sentinel-blue); transform: rotate(3deg); }
  .explorer { background: var(--explorer-yellow); transform: rotate(-2deg); margin-top: 1.5rem;}


  /* --- DASHBOARD GRID --- */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 850px) {
    .dashboard-grid {
      grid-template-columns: 2fr 1fr; /* Perfil grande, Estado pequeño */
      align-items: start;
    }
  }

  .profile-card, .status-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    border: 1px solid #e2e8f0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 1rem;
  }

  .card-header h3 { margin: 0; font-size: 1.5rem; color: var(--text-color); }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: #94a3b8;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background 0.2s;
  }
  .icon-btn:hover { background: #f1f5f9; color: #ef4444; }

  .profile-body {
    margin-bottom: 2rem;
    color: #475569;
    font-size: 1rem;
    line-height: 1.6;
  }

  .card-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  /* --- ESTADO --- */
  .status-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .status-item {
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px dashed #cbd5e1;
  }
  
  .status-value {
    display: block;
    font-size: 3rem;
    font-weight: 800;
    color: var(--analyst-purple);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .status-label {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .status-message p {
    font-size: 0.95rem;
    color: #475569;
    font-style: italic;
  }

  /* --- RECOMENDACIONES --- */
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .section-header h2 { margin-bottom: 0.5rem; color: var(--text-color); }
  .subtitle { color: #64748b; margin: 0; }

  .resource-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .resource-card {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    height: 100%;
  }

  .resource-card:hover {
    border-color: var(--analyst-purple);
    transform: translateY(-4px);
    box-shadow: 0 10px 20px -5px rgba(0,0,0,0.1);
  }

  .resource-icon { font-size: 2rem; }
  .resource-info h4 { margin: 0 0 0.5rem 0; font-size: 1.1rem; color: var(--text-color); }
  .resource-info p { margin: 0; font-size: 0.9rem; color: #64748b; line-height: 1.5; }
  .resource-info small { display: block; margin-top: 0.5rem; color: #94a3b8; font-size: 0.75rem; font-weight: 600; }

  /* --- UTILS & FORM --- */
  .eyebrow {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #94a3b8;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  .primary-action {
    background: var(--analyst-purple);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 99px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: var(--font-family-base);
  }
  
  .primary-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(136,97,154,0.3);
  }
  
  .primary-action.small { padding: 0.5rem 1.25rem; font-size: 0.9rem; }

  .secondary-action {
    background: white;
    border: 2px solid #e2e8f0;
    padding: 0.75rem 1.5rem;
    border-radius: 99px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    color: var(--text-color);
    transition: all 0.2s;
    font-family: var(--font-family-base);
  }

  .secondary-action:hover {
    border-color: var(--analyst-purple);
    color: var(--analyst-purple);
  }

  .text-action.danger {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: underline;
    font-family: var(--font-family-base);
  }
  
  /* Modal Styles */
  .edit-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
    padding: 1rem;
  }
  
  .edit-form {
    background: white;
    padding: 2rem;
    border-radius: 1.5rem;
    width: min(400px, 100%);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .form-header h4 { margin: 0; font-size: 1.2rem; }
  .close-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #94a3b8; }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .field input,
  .field textarea {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    font-family: inherit;
    font-size: 1rem;
    color: var(--text-color);
  }
  
  .field input:focus, .field textarea:focus {
    outline: 2px solid var(--analyst-purple);
    border-color: transparent;
  }

  .field textarea { min-height: 80px; resize: vertical; }
  .field-error { color: #e53e3e; font-size: 0.8rem; font-weight: 400; }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .feedback, .empty-state {
    text-align: center;
    color: #64748b;
    padding: 2rem;
    background: #f1f5f9;
    border-radius: 1rem;
  }
`;