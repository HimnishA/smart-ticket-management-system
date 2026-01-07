import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="brand">
          <div class="logo-circle">ST</div>
          <div>
            <h1>Smart Ticket System</h1>
            <p *ngIf="!isRegisterMode">Sign in to manage and track your support tickets.</p>
            <p *ngIf="isRegisterMode">Create an account to get started with ticket management.</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button 
            class="tab" 
            [class.active]="!isRegisterMode"
            (click)="switchToLogin()"
            type="button">
            Sign In
          </button>
          <button 
            class="tab" 
            [class.active]="isRegisterMode"
            (click)="switchToRegister()"
            type="button">
            Register
          </button>
        </div>

        <!-- Login Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate *ngIf="!isRegisterMode">
          <div class="field">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="you@example.com"
              [class.invalid]="emailInvalid"
            />
            <div class="error" *ngIf="emailInvalid">
              Please enter a valid email address.
            </div>
          </div>

          <div class="field">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              [class.invalid]="passwordInvalid"
            />
            <div class="error" *ngIf="passwordInvalid">
              Password is required (min 6 characters).
            </div>
          </div>

          <div class="error global" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button
            class="primary-btn"
            type="submit"
            [disabled]="form.invalid || loading"
          >
            <span *ngIf="!loading">Sign in</span>
            <span *ngIf="loading">Signing in...</span>
          </button>
        </form>

        <!-- Registration Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onRegister()" novalidate *ngIf="isRegisterMode">
          <div class="field">
            <label for="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              formControlName="fullName"
              placeholder="John Doe"
              [class.invalid]="fullNameInvalid"
            />
            <div class="error" *ngIf="fullNameInvalid">
              Full name is required.
            </div>
          </div>

          <div class="field">
            <label for="regEmail">Email</label>
            <input
              id="regEmail"
              type="email"
              formControlName="email"
              placeholder="you@example.com"
              [class.invalid]="regEmailInvalid"
            />
            <div class="error" *ngIf="regEmailInvalid">
              Please enter a valid email address.
            </div>
          </div>

          <div class="field">
            <label for="regPassword">Password</label>
            <input
              id="regPassword"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              [class.invalid]="regPasswordInvalid"
            />
            <div class="error" *ngIf="regPasswordInvalid">
              Password is required (min 6 characters).
            </div>
          </div>

          <div class="error global" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="success global" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <button
            class="primary-btn"
            type="submit"
            [disabled]="registerForm.invalid || loading"
          >
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading">Creating account...</span>
          </button>
        </form>

        <p class="hint" *ngIf="!isRegisterMode">
          Use the credentials provided by your administrator to access the system.
        </p>
        <p class="hint" *ngIf="isRegisterMode">
          Your account will be pending approval from an administrator.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top left, #1d4ed8, #020617);
      padding: 24px;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: white;
      border-radius: 16px;
      padding: 32px 28px;
      box-shadow:
        0 20px 25px -5px rgba(15, 23, 42, 0.2),
        0 8px 10px -6px rgba(15, 23, 42, 0.1);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .logo-circle {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      background: linear-gradient(to bottom right, #2563eb, #1d4ed8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      letter-spacing: 0.03em;
    }

    h1 {
      font-size: 1.4rem;
      margin: 0;
      color: #0f172a;
    }

    .brand p {
      margin: 2px 0 0;
      font-size: 0.85rem;
      color: #64748b;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #0f172a;
    }

    input {
      border-radius: 8px;
      border: 1px solid #cbd5f5;
      padding: 10px 12px;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.3);
    }

    input.invalid {
      border-color: #dc2626;
    }

    .error {
      font-size: 0.78rem;
      color: #b91c1c;
    }

    .error.global {
      margin-top: 4px;
      padding: 8px 10px;
      border-radius: 6px;
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .primary-btn {
      margin-top: 8px;
      border-radius: 999px;
      border: none;
      background: linear-gradient(to right, #2563eb, #1d4ed8);
      color: white;
      padding: 10px 16px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.1s, opacity 0.1s;
    }

    .primary-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
    }

    .primary-btn:disabled {
      opacity: 0.6;
      cursor: default;
      box-shadow: none;
    }

    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 8px;
    }

    .tab {
      flex: 1;
      padding: 10px 16px;
      border: none;
      background: transparent;
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 500;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab:hover {
      color: #475569;
      background: rgba(255, 255, 255, 0.5);
    }

    .tab.active {
      background: white;
      color: #2563eb;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .hint {
      margin-top: 16px;
      font-size: 0.8rem;
      color: #94a3b8;
      text-align: center;
    }

    .success.global {
      margin-top: 4px;
      padding: 8px 10px;
      border-radius: 6px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      font-size: 0.85rem;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 24px 18px;
      }
    }
  `]
})
export class LoginComponent {
  loading = false;
  errorMessage = '';
  successMessage = '';
  isRegisterMode = false;

  form!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  switchToLogin(): void {
    this.isRegisterMode = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.form.reset();
  }

  switchToRegister(): void {
    this.isRegisterMode = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.registerForm.reset();
  }

  get emailInvalid(): boolean {
    const c = this.form.controls['email'];
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  get passwordInvalid(): boolean {
    const c = this.form.controls['password'];
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  get fullNameInvalid(): boolean {
    const c = this.registerForm?.controls['fullName'];
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  get regEmailInvalid(): boolean {
    const c = this.registerForm?.controls['email'];
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  get regPasswordInvalid(): boolean {
    const c = this.registerForm?.controls['password'];
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    if (!email || !password) {
      return;
    }

    this.loading = true;
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        // Navigate based on first role, fallback to tickets
        const roles = this.auth.roles;
        if (roles.includes('SupportManager')) {
          this.router.navigate(['/dashboard']);
        } else if (roles.includes('SupportAgent')) {
          this.router.navigate(['/agent-dashboard']);
        } else if (roles.includes('EndUser')) {
          this.router.navigate(['/user-dashboard']);
        } else if (roles.includes('Admin')) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/tickets']);
        }
      },
      error: (err) => {
        this.loading = false;

        // Log for debugging during development
        console.error('Login failed', err);

        const apiError = err?.error;

        // Handle different API error shapes:
        // 1) { "error": "Invalid email or password." }
        // 2) { "message": "Invalid email or password." }
        // 3) "Invalid email or password." (plain text)
        if (apiError) {
          if (typeof apiError === 'string') {
            this.errorMessage = apiError;
          } else if (apiError.error) {
            this.errorMessage = apiError.error;
          } else if (apiError.message) {
            this.errorMessage = apiError.message;
          }
        }

        // Fallbacks if we still don't have a message
        if (!this.errorMessage && err?.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        }

        if (!this.errorMessage) {
          this.errorMessage = 'Unable to sign in. Please try again.';
        }
      }
    });
  }

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.registerForm.invalid || this.loading) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { fullName, email, password } = this.registerForm.getRawValue();
    if (!fullName || !email || !password) {
      return;
    }

    this.loading = true;
    this.auth.register(fullName.trim(), email.trim(), password).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Registration successful! Your account is pending approval from an administrator.';
        this.registerForm.reset();
        // Optionally switch to login after 3 seconds
        setTimeout(() => {
          this.switchToLogin();
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 400 || err?.status === 409) {
          this.errorMessage = err?.error?.message || 'Email already exists or invalid data.';
        } else {
          this.errorMessage = 'Unable to register. Please try again.';
        }
      }
    });
  }
}


