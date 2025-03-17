import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  snackBar = inject(MatSnackBar);
  resetPasswordForm!: FormGroup;
  hide = true;


  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.route.queryParams.subscribe((params) => {
      this.resetPasswordForm.patchValue({ email: params['email'] });
    });
  }
  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const resetPasswordRequest = {
        ...this.resetPasswordForm.value,
        token: this.route.snapshot.queryParamMap.get('token'),
        email:this.route.snapshot.queryParamMap.get('email'),
      };

      this.authService.resetPasswordRequest(resetPasswordRequest).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Close', {
            duration: 5000,
          });
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.error.message, 'Close', {
            duration: 5000,
          });
        }
      });
    }
  }
}
