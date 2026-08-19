import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  userEmail: string | null;
  userName: string = 'Usuario';
  
  totalBalance: string = '$124,500.00';
  balanceTrend: string = '+12.5%';
  fixedIncomeProgress: number = 75;
  variableIncomeProgress: number = 45;

  recentActivities = [
    { title: 'Nómina Q2', date: 'Hoy, 09:00 AM', amount: '+$45,000', type: 'income' },
    { title: 'AWS Hosting', date: 'Ayer', amount: '-$1,200', type: 'expense' },
    { title: 'Suscripción SaaS', date: '12 Oct', amount: '-$850', type: 'expense' }
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.userEmail = this.authService.getCurrentUserEmail();
    if (this.userEmail) {
      this.userName = this.userEmail.split('@')[0];
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
  }

  addTransaction(): void {
    console.log('Abrir modal de nueva transacción');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}