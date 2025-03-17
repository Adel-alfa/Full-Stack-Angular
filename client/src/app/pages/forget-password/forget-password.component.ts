import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule, 
    ReactiveFormsModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {

  forgotPasswordForm: FormGroup;
  matSnakBar = inject(MatSnackBar);
  showEmailSent= false;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  };

  onSubmit(): void {
    this.isSubmitting= true;
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPasswordRequest(this.forgotPasswordForm.value).subscribe({
        next: (response) => {
          if(response.isSuccess){
            this.matSnakBar.open(response.message,"Close",{
              duration: 5000,
            });
            this.showEmailSent = true;
          }
          else{
            this.matSnakBar.open(response.message, 'Close',{
              duration: 5000,
            });
          }         
        },
        error: (error:HttpErrorResponse) => {
          this.matSnakBar.open(error.message, 'Close',{
            duration: 5000,
          });
          console.error('Password reset request failed:', error);
        }, 
        complete: () => {
          this.isSubmitting = false;
        },
      });
    }
  }
  get email() {
    return this.forgotPasswordForm.get('email');
  }
}
