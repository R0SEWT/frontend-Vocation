import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { profilePageStyles } from './profile-page.styles';
import { UserProfile } from '../../core/validators/models/profile.models';
import { ProfileService } from '../../core/services/profile.service';
import { SessionService } from '../../core/services/session.service';
import { INTEREST_AREA_CATALOG } from '../../core/constants/interest-area.constants';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <main class="main-shell">
      <header class="section-header">
        <div>
          <p class="eyebrow">Mi Perfil</p>
          <h2>{{ profile?.name || profile?.email || 'Perfil' }}</h2>
        </div>
        <div class="card-actions-inline">
          <button class="secondary-action" [routerLink]="['/home']">Volver a inicio</button>
          <button class="icon-btn" (click)="logout()" title="Cerrar sesión" aria-label="Cerrar sesión">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 6a7 7 0 1010 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      <section class="card">
        <header class="card-header">
          <div>
            <p class="eyebrow">Datos</p>
            <h3>{{ profile?.name || 'Nombre no definido' }}</h3>
          </div>
          <div class="card-actions-inline">
            <button class="primary-action small" (click)="openEdit()">Editar Perfil</button>
          </div>
        </header>

        <div class="profile-body">
          <p><strong>Nombre:</strong> {{ profile?.name || 'No definido' }}</p>
          <p><strong>Edad:</strong> {{ profile?.age ?? '--' }} años</p>
          <p><strong>Grado:</strong> {{ profile?.grade || 'No definido' }}</p>
          <p><strong>Intereses:</strong> {{ interestsLabel(profile) }}</p>
          @if (profileFeedback && !editing) {
            <p class="feedback-msg">{{ profileFeedback }}</p>
          }
        </div>

        @if (editing) {
          <div class="edit-overlay">
            <form [formGroup]="form" (ngSubmit)="save()" class="edit-form">
              <div class="form-header">
                <h4>Actualiza tu perfil</h4>
                <button type="button" class="secondary-action" (click)="cancel()" [disabled]="status === 'saving'">Cerrar</button>
              </div>

              <label class="field">
                <span>Nombre completo</span>
                <input type="text" formControlName="fullName" placeholder="Tu nombre" />
                @if (form.controls['fullName'].touched && form.controls['fullName'].hasError('required')) {
                  <small class="field-error">El nombre es obligatorio.</small>
                }
              </label>

              <label class="field">
                <span>Edad estimada</span>
                <input type="number" formControlName="age" min="14" placeholder="Ej: 18" />
                @if (form.controls['age'].touched && form.controls['age'].hasError('required')) {
                  <small class="field-error">La edad es obligatoria.</small>
                }
              </label>

              <label class="field">
                <span>Grado de estudio</span>
                <select formControlName="grade">
                  <option value="" disabled>Selecciona tu último grado aprobado</option>
                  @for (option of gradeOptions; track option.value) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
                @if (form.controls['grade'].touched && form.controls['grade'].hasError('required')) {
                  <small class="field-error">Selecciona un grado.</small>
                }
              </label>

              <div class="field">
                <span>Intereses</span>
                <div class="interests-panel">
                  <div class="interests-container">
                  @for (interest of interestOptions; track interest) {
                    <label class="checkbox-option">
                      <input type="checkbox"
                             [checked]="isInterestSelected(interest)"
                             (change)="toggleInterest(interest, $event)">
                      {{ interest }}
                    </label>
                  }
                  </div>
                </div>
                @if (form.controls['interests'].touched && form.controls['interests'].invalid) {
                  <small class="field-error">Selecciona al menos un interés.</small>
                }
              </div>

              @if (editFeedback) {
                <div class="modal-feedback" [class.error]="status === 'error'" [class.success]="status === 'success'">
                  {{ editFeedback }}
                </div>
              }

              <div class="form-actions">
                <button type="button" class="secondary-action" (click)="cancel()" [disabled]="status === 'saving'">
                  Cancelar
                </button>
                <button class="primary-action" type="submit"
                        [disabled]="form.invalid || status === 'saving' || status === 'success'">
                  @switch (status) {
                    @case ('saving') { Guardando... }
                    @case ('success') { ¡Guardado! }
                    @default { Guardar }
                  }
                </button>
              </div>
            </form>
          </div>
        }

        <div class="card-actions" style="margin-top:12px;">
          <button class="text-action danger" (click)="deleteAccount()" [disabled]="deleting">
            {{ deleting ? 'Eliminando...' : 'Eliminar cuenta' }}
          </button>
        </div>
      </section>
    </main>
  `,
  styles: [profilePageStyles]
})
export class ProfilePageComponent implements OnInit {
  profile?: UserProfile;
  form: FormGroup;
  editing = false;
  status: 'idle' | 'saving' | 'success' | 'error' = 'idle';
  editFeedback = '';
  profileFeedback = '';
  deleting = false;

  interestOptions: string[] = Object.keys(INTEREST_AREA_CATALOG);
  gradeOptions = [
    { value: 'SECUNDARIA_1', label: '1° de secundaria' },
    { value: 'SECUNDARIA_2', label: '2° de secundaria' },
    { value: 'SECUNDARIA_3', label: '3° de secundaria' },
    { value: 'SECUNDARIA_4', label: '4° de secundaria' },
    { value: 'SECUNDARIA_5', label: '5° de secundaria' },
    { value: 'SUPERIOR_TECNICA_1', label: '1° ciclo de instituto técnico' },
    { value: 'SUPERIOR_TECNICA_2', label: '2° ciclo de instituto técnico' },
    { value: 'SUPERIOR_TECNICA_3', label: '3° ciclo de instituto técnico' },
    { value: 'SUPERIOR_TECNICA_4', label: '4° ciclo de instituto técnico' },
    { value: 'SUPERIOR_TECNICA_5_MAS', label: '5° ciclo o más de instituto técnico' },
    { value: 'UNIVERSIDAD_1', label: '1° ciclo universitario' },
    { value: 'UNIVERSIDAD_2', label: '2° ciclo universitario' },
    { value: 'UNIVERSIDAD_3', label: '3° ciclo universitario' },
    { value: 'UNIVERSIDAD_4', label: '4° ciclo universitario' },
    { value: 'UNIVERSIDAD_5', label: '5° ciclo universitario' },
    { value: 'UNIVERSIDAD_6_MAS', label: '6° ciclo o más universitario' }
  ];

  constructor(
    private profileService: ProfileService,
    private session: SessionService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(14)]],
      grade: ['', Validators.required],
      interests: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    // Reload profile data on navigation back to /profile
    this.router.events.subscribe((evt: any) => {
      if (evt?.constructor?.name === 'NavigationEnd') {
        this.loadProfile();
      }
    });
  }

  private loadProfile(): void {
    this.profileService.fetchProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.syncForm();
      },
      error: (error: Error) => {
        this.profileFeedback = error.message;
      }
    });
  }

  private syncForm(): void {
    this.form.patchValue({
      fullName: this.profile?.name ?? '',
      age: this.profile?.age ?? null,
      grade: this.profile?.grade ?? '',
      interests: this.profile?.interests ?? []
    });
  }

  openEdit(): void {
    this.editing = true;
    this.status = 'idle';
    this.editFeedback = '';
    this.form.enable();
    this.syncForm();
  }

  cancel(): void {
    this.editing = false;
    this.status = 'idle';
    this.editFeedback = '';
    this.form.enable();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const fullName = raw.fullName?.trim();
    const age = Number(raw.age);
    const grade = (raw.grade ?? '').trim();
    const interests = raw.interests as string[] || [];

    if (!interests.length) {
      this.status = 'error';
      this.editFeedback = 'Selecciona al menos un interés.';
      return;
    }

    this.status = 'saving';
    this.editFeedback = '';
    this.form.disable();

    this.profileService.updateProfile({ age, grade, interests }).subscribe({
      next: (response) => {
        if (fullName && fullName !== this.profile?.name) {
          this.patchName(fullName, response.profile);
        } else {
          this.finishUpdate(response.profile);
        }
      },
      error: (error: Error) => {
        this.handleError(error);
      }
    });
  }

  private patchName(newName: string, currentProfile: UserProfile): void {
    this.profileService.patchPersonalData({ name: newName, preferences: currentProfile.preferences || {} }).subscribe({
      next: (response) => this.finishUpdate(response.profile),
      error: (error: Error) => {
        this.finishUpdate(currentProfile, 'Perfil actualizado, pero hubo un error al guardar el nombre.');
      }
    });
  }

  private finishUpdate(profile: UserProfile, customMessage?: string): void {
    this.profile = profile;
    this.status = 'success';
    this.editFeedback = customMessage || '¡Perfil actualizado correctamente!';
    this.syncForm();

    setTimeout(() => {
      this.editing = false;
      this.form.enable();
      this.status = 'idle';
      this.editFeedback = '';
    }, 1500);
  }

  private handleError(error: Error): void {
    this.status = 'error';
    this.editFeedback = error.message || 'Error al guardar los cambios.';
    this.form.enable();
  }

  deleteAccount(): void {
    const confirmation = prompt("Escribe ELIMINAR para confirmar la eliminación irreversible de la cuenta.");
    if (!confirmation || confirmation.trim().toUpperCase() !== 'ELIMINAR') {
      this.profileFeedback = "Escribe 'ELIMINAR' para confirmar la eliminación.";
      return;
    }

    const currentPassword = prompt('Ingresa tu contraseña actual');
    if (!currentPassword?.trim()) {
      this.profileFeedback = 'La contraseña actual es obligatoria.';
      return;
    }

    this.deleting = true;
    this.profileFeedback = '';
    this.profileService.deleteAccount({ confirmation: 'ELIMINAR', currentPassword }).subscribe({
      next: (response) => {
        this.profileFeedback = response.message;
        this.session.clearTokens();
        this.router.navigate(['/auth/login']);
      },
      error: (error: Error) => {
        this.profileFeedback = error.message;
      },
      complete: () => {
        this.deleting = false;
      }
    });
  }

  logout(): void {
    this.session.clearTokens();
    this.router.navigate(['/auth/login']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  isInterestSelected(interest: string): boolean {
    const current = this.form.controls['interests'].value as string[] || [];
    return current.includes(interest);
  }

  toggleInterest(interest: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const current = this.form.controls['interests'].value as string[] || [];
    const next = isChecked ? [...current, interest] : current.filter(i => i !== interest);
    this.form.patchValue({ interests: next });
    this.form.controls['interests'].markAsTouched();
  }

  interestsLabel(p?: UserProfile): string {
    const arr = p?.interests || [];
    return arr.length ? arr.join(', ') : 'Sin intereses';
  }
}
