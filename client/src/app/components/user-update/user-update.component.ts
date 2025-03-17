import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators,FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA,MatDialogRef, } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import { UserDetails } from '../../interfaces/user-details';
import { Role } from '../../interfaces/role';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UpdateUserRole } from '../../interfaces/update-user-role';
import { UpdateUserStatus } from '../../interfaces/update-user-status';

@Component({
  selector: 'app-user-update',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css'
})
export class UserUpdateComponent implements OnInit {
  authService = inject(AuthService);
  roleService=inject(RoleService);
  snackBar = inject(MatSnackBar);
  updateUserForm!: FormGroup;
  dialogdata:any;
  userdata!:any;
  roleList!:Role[];
  type='';
  title=''
 constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA)public data:any, private ref:MatDialogRef<UserUpdateComponent>) {}
  ngOnInit(): void {
    this.loadRoles();
    this.dialogdata= this.data;
    this.type = this.dialogdata.type;
    this.updateUserForm = this.fb.group({
      userid: [{ value: '', disabled: true }],
      roles: ['', Validators.required],
      status:[true]
    });

    if(this.dialogdata.userid!==''){
      this.authService.getUserDetailsById(this.dialogdata.userid).subscribe(res=>{
        this.userdata= res;
        this.updateUserForm.setValue({
          userid:this.userdata.id,
           roles: this.userdata.roles,
           status:this.userdata.status })
      })
      if(this.type ==='role'){this.title='Change Role';}
      else{this.title='Change Status';}
    }
  }
  loadRoles(){
    this.roleService.getRoles().subscribe(res => {
      this.roleList = res;
    })
  }
  onChangeRole (){
    if(this.updateUserForm.valid){
      
      if(this.type ==='role'){
        
        const updateuserObj:UpdateUserRole={
          userId:this.dialogdata.userid,
          roles:this.updateUserForm.get('roles')?.value,
        }
        this.roleService.updateRole(updateuserObj).subscribe(res=>{
          this.snackBar.open(res.message, 'close',{
            duration: 4000,
            horizontalPosition: 'center',
          });
          
        })
      }
      else{
     
        const updateuserObj:UpdateUserStatus={
          userId:this.dialogdata.userid,
          status:this.updateUserForm.get('status')?.value
        }
        this.authService.updateUserStatus(updateuserObj).subscribe(res=>{
          this.snackBar.open('test update status', 'close',{
            duration: 4000,
            horizontalPosition: 'center',
          });
        })
        

      }
      this.ref.close();
    }
  }
  closeDialog(){
    this.ref.close();
  }
}
