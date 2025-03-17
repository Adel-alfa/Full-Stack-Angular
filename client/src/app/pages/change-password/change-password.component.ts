import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChangePasswordRequest } from '../../interfaces/change-password-request';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  imports: [MatCardModule, MatInputModule, 
    MatFormFieldModule, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {

  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  changePasswordForm!: FormGroup;
  hide = true;
  
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const changePasswordRequest: ChangePasswordRequest = {
        email:this.authService.getUserDetail()?.email,
        newPassword: this.changePasswordForm.get('newPassword')?.value ?? '',
        currentPassword: this.changePasswordForm.get('currentPassword')?.value ?? '',
      };
      this.authService.changePasswordRequest(changePasswordRequest).subscribe({
        next: (response) => {        
            this.snackBar.open(response.message, 'Close', {
              duration: 5000,
            });
            this.authService.logout();
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
