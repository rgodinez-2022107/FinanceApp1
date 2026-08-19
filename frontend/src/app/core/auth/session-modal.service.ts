// frontend/src/app/core/auth/session-modal.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionModalService {
  private readonly visible$ = new BehaviorSubject<boolean>(false);
  readonly isVisible$ = this.visible$.asObservable();

  show(): void {
    this.visible$.next(true);
  }

  hide(): void {
    this.visible$.next(false);
  }
}