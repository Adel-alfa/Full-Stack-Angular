import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';
import { ValidationError } from '../../interfaces/validation-error';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { RoleService } from '../../services/role.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [MatInputModule, MatIconModule,MatSelectModule,
    RouterLink, ReactiveFormsModule,AsyncPipe,CommonModule,MatSnackBarModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  
  authService = inject(AuthService);
  roleService = inject(RoleService);
  matSnackbar = inject(MatSnackBar);
  roles$!:Observable<Role[]>;
fb = inject(FormBuilder);
registerForm!: FormGroup;
router = inject(Router);
confirmPasswordHide:boolean = true;
passwordHide:boolean = true;
errors!:ValidationError[];

ngOnInit(): void {
  this.registerForm = this.fb.group({
    email: ['',[Validators.required,  Validators.email]],
    password: ['',[Validators.required ]],
    fullName: ['',Validators.required],
    roles: [''],
    confirmPassword: ['', Validators.required],
  },
  {
    validator: this.passwordMatchValidator,
  }
);
this.roles$ = this.roleService.getRoles();
}
private passwordMatchValidator(control: AbstractControl):{[key:string]:boolean} | null{
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if(password != confirmPassword){
    return { 'passwordNoMatch': true };
  }
  return null;
}
register(): void{
  this.authService.register(this.registerForm.value).subscribe({
    next: (res) => {
      console.log(res);

      this.matSnackbar.open(res.message, 'close',{
        duration: 4000,
        horizontalPosition: 'center',
      });
      this.router.navigate(['/login']);
    },
    error: (err: HttpErrorResponse)=>{
      if(err!.status== 400){
        this.errors = err!.error;
        this.matSnackbar.open('Validations error','Close', {
          duration: 2000,
          horizontalPosition: 'center',
        });
      }
    },
    complete: () => console.log('Register Succes'),
  });
}

}
