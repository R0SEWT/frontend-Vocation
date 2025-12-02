export const historyPageStyles = `
/* Layout */
.main-shell { max-width: 960px; margin: 0 auto; padding: 24px; }
.section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }

/* Typography */
.eyebrow { font-size: 12px; color:#6b7280; letter-spacing:.04em; text-transform:uppercase; margin:0; }

/* Cards */
.card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 1px 2px rgba(0,0,0,.04); padding:16px; }
.card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }

/* Actions */
.primary-action { background:#2563eb; color:white; border:none; border-radius:8px; padding:8px 12px; cursor:pointer; }
.secondary-action { background:transparent; color:#111827; border:1px solid #d1d5db; border-radius:8px; padding:8px 12px; cursor:pointer; }
.secondary-action.danger { color:#b91c1c; border-color:#fecaca; }

/* List */
.list { display:grid; gap:12px; }
.item { display:flex; justify-content:space-between; align-items:center; padding:12px; border:1px solid #e5e7eb; border-radius:10px; }
.meta { display:flex; gap:12px; align-items:center; color:#4b5563; }
.pagination { display:flex; gap:8px; align-items:center; justify-content:flex-end; margin-top:12px; }
.badge { font-size:12px; padding:4px 8px; border-radius:999px; background:#f3f4f6; color:#374151; }
`;
