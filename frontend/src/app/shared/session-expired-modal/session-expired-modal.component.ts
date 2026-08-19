// frontend/src/app/shared/session-expired-modal/session-expired-modal.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionModalService } from '../../core/auth/session-modal.service';

@Component({
  selector: 'app-session-expired-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-expired-modal.component.html',
  styleUrls: ['./session-expired-modal.component.scss'],
})
export class SessionExpiredModalComponent {
  isVisible$: Observable<boolean>;

  constructor(
    private sessionModalService: SessionModalService,
    private router: Router
  ) {
    this.isVisible$ = this.sessionModalService.isVisible$;
  }

  onAccept(): void {
    this.sessionModalService.hide();
    this.router.navigate(['/']);
  }
}