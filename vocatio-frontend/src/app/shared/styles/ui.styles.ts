export const uiStyles = `
:host { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; color:#111827; }

.main-shell { max-width: 960px; margin: 0 auto; padding: 24px; }
.section-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
.section-header h2, .section-header h3 { margin:0; }
.eyebrow { font-size: 12px; color:#6b7280; letter-spacing:.04em; text-transform:uppercase; margin:0; }
.subtitle { margin:0; color:#6b7280; }

.card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 1px 2px rgba(0,0,0,.04); padding:16px; }
.card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.card-actions-inline { display:flex; gap:8px; align-items:center; }
.card-actions { display:flex; gap:8px; align-items:center; justify-content:flex-end; }

.primary-action { background:#2563eb; color:white; border:none; border-radius:8px; padding:10px 14px; cursor:pointer; transition:filter .15s ease; }
.primary-action.small { padding:8px 12px; }
.primary-action:hover { filter:brightness(1.05); }
.secondary-action { background:transparent; color:#111827; border:1px solid #d1d5db; border-radius:8px; padding:10px 14px; cursor:pointer; transition:background-color .15s ease; }
.secondary-action.small { padding:8px 12px; }
.secondary-action:hover { background:#f9fafb; }
.secondary-action.danger { color:#b91c1c; border-color:#fecaca; }
.text-action { background:transparent; border:none; color:#2563eb; cursor:pointer; }
.text-action.danger { color:#b91c1c; }

.field { display:grid; gap:6px; }
.field-error { color:#b91c1c; font-size:12px; }
.feedback-msg { color:#374151; }
.modal-feedback { padding:8px 12px; border-radius:8px; background:#f3f4f6; color:#111827; }
.modal-feedback.success { background:#ecfdf5; color:#065f46; }
.modal-feedback.error { background:#fef2f2; color:#7f1d1d; }

.list { display:grid; gap:12px; }
.item { display:flex; justify-content:space-between; align-items:center; padding:12px; border:1px solid #e5e7eb; border-radius:10px; }
.badge { font-size:12px; padding:4px 8px; border-radius:999px; background:#f3f4f6; color:#374151; }
.pagination { display:flex; gap:8px; align-items:center; justify-content:flex-end; margin-top:12px; }

.grid { display:grid; gap:12px; }
.tile { border:1px solid #e5e7eb; border-radius:10px; padding:12px; display:flex; flex-direction:column; gap:6px; }
.tile h4 { margin:0; font-size:16px; }
.tile p { margin:0; color:#4b5563; }
`;
