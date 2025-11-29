
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { authCardStyles } from '../../../shared/components/auth-card.styles';

@Component({
  selector: 'app-invalid-credentials-page',
  standalone: true,
  imports: [RouterModule],
  template: `
    <section class="auth-card">
      <p class="eyebrow">Acceso denegado</p>
      <h2>Credenciales incorrectas</h2>
      <p class="subtitle">
        {{ message }}
      </p>
      <button class="primary-action" type="button" (click)="returnToLogin()">
        Volver a iniciar sesión
      </button>
      <p class="note">
        ¿Aún no tienes cuenta?
        <a routerLink="/auth/register">Crea una ahora</a>
      </p>
    </section>
  `,
  styles: [authCardStyles]
})
export class InvalidCredentialsPageComponent {
  private readonly router = inject(Router);

  readonly message =
    this.getRouterMessage() ??
    (typeof history !== 'undefined' ? history.state?.message : undefined) ??
    'No pudimos verificar tus credenciales. Verifica tus datos e inténtalo de nuevo.';

  private getRouterMessage(): string | undefined {
    const extrasState = this.router.getCurrentNavigation()?.extras.state;
    if (!extrasState) {
      return undefined;
    }
    return (extrasState as { message?: string })['message'];
  }

  returnToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
