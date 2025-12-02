export const profilePageStyles = `
:host { display:block; }
.main-shell { padding: 32px; max-width: 960px; margin: 0 auto; }
.section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
.eyebrow { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: #6b7280; margin:0; }
.card { background:#fff; border-radius:16px; box-shadow: 0 10px 28px rgba(0,0,0,.08); padding:20px; }
.card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.card-actions-inline { display:flex; gap:10px; }
.icon-btn { border:none; background:transparent; cursor:pointer; padding:10px; border-radius:10px; }
.icon-btn:hover { background:#f3f4f6; }
.primary-action { background:#2563eb; color:#fff; border:none; border-radius:10px; padding:12px 16px; cursor:pointer; }
.primary-action.small { padding:8px 12px; }
.secondary-action { background:#e5e7eb; color:#111827; border:none; border-radius:10px; padding:12px 16px; cursor:pointer; }
.text-action { background:transparent; color:#2563eb; border:none; cursor:pointer; }
.text-action.danger { color:#b91c1c; }
.small { padding:8px 12px; font-size:14px; }
.profile-body p { margin:6px 0; }
.edit-overlay { margin-top:16px; }
.edit-form { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
.edit-form .form-header { grid-column: 1 / -1; display:flex; justify-content:space-between; align-items:center; }
.field { display:grid; gap:6px; }
.field input, .field select { border: 1px solid #d1d5db; border-radius:10px; padding:10px 12px; font-size:14px; }
.field input:focus, .field select:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.15); }
.field-error { color:#b91c1c; }
.interests-container { display:flex; flex-wrap:wrap; gap:10px; padding:6px 0; }
.checkbox-option { display:flex; align-items:center; gap:6px; background:#f9fafb; border:1px solid #e5e7eb; padding:6px 10px; border-radius:10px; }
.modal-feedback { padding:10px 12px; border-radius:10px; }
.modal-feedback.success { background:#ecfdf5; color:#065f46; }
.modal-feedback.error { background:#fef2f2; color:#7f1d1d; }
.form-actions { grid-column: 1 / -1; display:flex; gap:10px; justify-content:flex-end; margin-top:4px; }
`;