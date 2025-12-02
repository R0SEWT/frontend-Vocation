import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { historyPageStyles } from './history-page.styles';
import { uiStyles } from '../../shared/styles/ui.styles';
import { TestService } from '../../core/services/test.service';
import { SessionService } from '../../core/services/session.service';

interface AttemptItem {
  id: string;
  status: string;
  completedAt?: string;
}

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <main class="main-shell">
      <header class="section-header">
        <div>
          <p class="eyebrow">Historial</p>
          <h2>Intentos anteriores</h2>
        </div>
        <div>
          <button class="secondary-action" [routerLink]="['/home']">Volver a inicio</button>
        </div>
      </header>

      <section class="card">
        <header class="card-header">
          <h3>Resumen</h3>
          <span class="badge">{{ attempts.length }} intentos</span>
          <div style="display:flex; gap:8px; margin-left:auto;">
            <button class="secondary-action danger" type="button" (click)="deleteAllAttempts()" [disabled]="deletingAll">
              {{ deletingAll ? 'Eliminando todos...' : 'Eliminar todos los intentos anteriores' }}
            </button>
          </div>
        </header>

        <div style="display:grid; gap:8px; margin-bottom:12px;">
          <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:end;">
            <label style="display:grid; gap:4px;">
              <span style="font-size:12px; color:#6b7280;">Estado</span>
              <select [(ngModel)]="statusFilter" (change)="onFiltersChanged()" style="padding:8px; border:1px solid #d1d5db; border-radius:8px;">
                <option value="all">Todos</option>
                <option value="completed">Completados</option>
                <option value="in-progress">En progreso</option>
              </select>
            </label>
            <label style="display:grid; gap:4px;">
              <span style="font-size:12px; color:#6b7280;">Desde</span>
              <input type="date" [(ngModel)]="fromDate" (change)="onFiltersChanged()" style="padding:8px; border:1px solid #d1d5db; border-radius:8px;" />
            </label>
            <label style="display:grid; gap:4px;">
              <span style="font-size:12px; color:#6b7280;">Hasta</span>
              <input type="date" [(ngModel)]="toDate" (change)="onFiltersChanged()" style="padding:8px; border:1px solid #d1d5db; border-radius:8px;" />
            </label>
            <label style="display:grid; gap:4px; min-width:200px; flex:1;">
              <span style="font-size:12px; color:#6b7280;">Buscar por ID</span>
              <input type="text" [(ngModel)]="idQuery" (keyup)="onFiltersChanged()" placeholder="Ej: 12345" style="padding:8px; border:1px solid #d1d5db; border-radius:8px;" />
            </label>
            <div style="display:flex; gap:8px;">
              <button class="secondary-action" type="button" (click)="clearFilters()">Limpiar</button>
            </div>
          </div>
        </div>

        <div class="list" *ngIf="filtered.length; else empty">
          <div class="item" *ngFor="let a of paginated; trackBy: trackById">
            <div class="meta">
              <strong>#{{ a.id }}</strong>
              <span>{{ a.completedAt ? formatDate(a.completedAt) : 'En progreso' }}</span>
              <span class="badge">{{ a.status }}</span>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="secondary-action" (click)="openAttempt(a)">Ver</button>
              <button class="secondary-action danger" (click)="deleteAttempt(a.id)" [disabled]="deleting[a.id]">{{ deleting[a.id] ? 'Eliminando...' : 'Eliminar' }}</button>
            </div>
          </div>
        </div>

        <ng-template #empty>
          <p style="margin:0; color:#6b7280;">No hay intentos que coincidan con los filtros.</p>
        </ng-template>

        <div class="pagination" *ngIf="filtered.length > pageSize">
          <span>Mostrando {{ pageStart + 1 }}–{{ pageEnd }} de {{ filtered.length }}</span>
          <button class="secondary-action" (click)="prev()" [disabled]="pageIndex === 0">Anterior</button>
          <button class="secondary-action" (click)="next()" [disabled]="(pageIndex + 1) * pageSize >= filtered.length">Siguiente</button>
        </div>
      </section>
    </main>
  `,
  styles: [uiStyles, historyPageStyles]
})
export class HistoryPageComponent implements OnInit {
  attempts: AttemptItem[] = [];
  deleting: Record<string, boolean> = {};
  deletingAll = false;

  pageIndex = 0;
  pageSize = 5;

  // Filtros
  statusFilter: 'all' | 'completed' | 'in-progress' = 'all';
  fromDate: string = '';
  toDate: string = '';
  idQuery: string = '';

  constructor(
    private testService: TestService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAttempts();
  }

  private loadAttempts(): void {
    const token = this.session.getAccessToken();
    if (!token) { this.router.navigate(['/auth/login']); return; }
    this.testService.listAssessments(token).subscribe({
      next: (raw) => {
        const sorted = [...raw].sort((a, b) => {
          const da = a.completedAt ? new Date(a.completedAt).getTime() : 0;
          const db = b.completedAt ? new Date(b.completedAt).getTime() : 0;
          return db - da;
        });
        this.attempts = sorted.map(a => ({ id: a.id, status: a.status, completedAt: a.completedAt }));
        this.pageIndex = 0;
      },
      error: (err: Error) => {
        console.error('Error loading attempts', err);
      }
    });
  }

  get filtered(): AttemptItem[] {
    let list = [...this.attempts];
    // Estado
    if (this.statusFilter !== 'all') {
      if (this.statusFilter === 'completed') list = list.filter(a => (a.status || '').toUpperCase() === 'COMPLETED');
      else list = list.filter(a => (a.status || '').toUpperCase() !== 'COMPLETED');
    }
    // ID contains
    const q = this.idQuery.trim().toLowerCase();
    if (q) list = list.filter(a => a.id.toLowerCase().includes(q));
    // Date range over completedAt
    if (this.fromDate) {
      const fromTs = new Date(this.fromDate).setHours(0,0,0,0);
      list = list.filter(a => !a.completedAt || new Date(a.completedAt).getTime() >= fromTs);
    }
    if (this.toDate) {
      const toTs = new Date(this.toDate).setHours(23,59,59,999);
      list = list.filter(a => !a.completedAt || new Date(a.completedAt).getTime() <= toTs);
    }
    return list;
  }

  get pageStart(): number { return this.pageIndex * this.pageSize; }
  get pageEnd(): number { return Math.min(this.pageStart + this.pageSize, this.filtered.length); }
  get paginated(): AttemptItem[] { return this.filtered.slice(this.pageStart, this.pageEnd); }

  prev(): void { if (this.pageIndex > 0) this.pageIndex--; }
  next(): void { if ((this.pageIndex + 1) * this.pageSize < this.filtered.length) this.pageIndex++; }

  onFiltersChanged(): void { this.pageIndex = 0; }
  clearFilters(): void {
    this.statusFilter = 'all';
    this.fromDate = '';
    this.toDate = '';
    this.idQuery = '';
    this.pageIndex = 0;
  }

  openResult(id: string): void { this.router.navigate(['/test/results', id]); }

  openAttempt(a: AttemptItem): void {
    const statusUpper = (a.status || '').toUpperCase();
    if (statusUpper === 'COMPLETED') {
      this.openResult(a.id);
    } else {
      // En progreso: navegar al test para continuar o recuperar
      this.router.navigate(['/test']);
    }
  }

  deleteAttempt(id: string): void {
    const token = this.session.getAccessToken();
    if (!token) { this.router.navigate(['/auth/login']); return; }
    if (!confirm('¿Eliminar este intento? Esta acción no se puede deshacer.')) return;
    this.deleting[id] = true;
    this.testService.deleteAssessment(id, token).subscribe({
      next: () => {
        this.attempts = this.attempts.filter(a => a.id !== id);
      },
      error: (e) => { console.error('Error al eliminar intento', e); },
      complete: () => { this.deleting[id] = false; }
    });
  }

  deleteAllAttempts(): void {
    const token = this.session.getAccessToken();
    if (!token) { this.router.navigate(['/auth/login']); return; }
    const hasAny = this.attempts.length > 0;
    if (!hasAny) return;
    const confirmMsg = '¿Eliminar TODOS los intentos anteriores? Esta acción no se puede deshacer.';
    if (!confirm(confirmMsg)) return;

    this.deletingAll = true;
    // Eliminar todos los intentos anteriores (independiente del estado)
    const idsToDelete = this.attempts.map(a => a.id);
    if (!idsToDelete.length) { this.deletingAll = false; return; }

    let completed = 0;
    idsToDelete.forEach(id => {
      this.deleting[id] = true;
      this.testService.deleteAssessment(id, token).subscribe({
        next: () => { completed++; this.attempts = this.attempts.filter(a => a.id !== id); },
        error: (e) => { console.error('Error eliminando intento', id, e); },
        complete: () => { this.deleting[id] = false; if (completed >= idsToDelete.length) { this.deletingAll = false; this.pageIndex = 0; } }
      });
    });
  }

  goHome(): void { this.router.navigate(['/home']); }

  trackById = (_: number, a: AttemptItem) => a.id;

  formatDate(dateString: string): string {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
