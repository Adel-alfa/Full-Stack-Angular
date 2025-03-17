import { Component, inject } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { RoleFormComponent } from "../../components/role-form/role-form.component";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RoleListComponent } from "../../components/role-list/role-list.component";
import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-role',
  imports: [RoleFormComponent,
    MatSnackBarModule, RoleListComponent,
    AsyncPipe,
    MatSelectModule,
    MatInputModule,],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {

  roleService = inject(RoleService);
  authService = inject(AuthService);
  snackBar= inject(MatSnackBar)
  errorMessage = '';
  role: RoleCreateRequest = {} as RoleCreateRequest;
  roles$ = this.roleService.getRoles();
  users$ = this.authService.getAll();
  selectedRole:string = '';
  selectedUser:string = '';
  createRole(role:RoleCreateRequest){
    this.roleService.createRole(role).subscribe({

    });
  };

  deleteRole(id:string){
    this.roleService.deleteRole(id).subscribe({
      next: (response:{message:string}) => {this.snackBar.open('Role deleted successfully', 'close', {
        duration: 4000,

      });
    },
    error:(error:HttpErrorResponse)=>{
      this.snackBar.open(error.message, 'Close', {
        duration: 4000,
      });
    },
    });
  }
  assignRole(){
    this.roleService.assignRole(this.selectedUser, this.selectedRole).subscribe({
      next: (response:{message:string}) => {
        this.roles$ = this.roleService.getRoles();
        this.snackBar.open('Role Assiged Successfully!', 'Close', {
          duration: 5000,          
        });
        this.selectedUser='';
        this.selectedRole ='';
      },
      error:(error:HttpErrorResponse)=>{
        this.snackBar.open(error.message, 'Close', {
          duration: 4000,
        });
      },
    });
  }
}
