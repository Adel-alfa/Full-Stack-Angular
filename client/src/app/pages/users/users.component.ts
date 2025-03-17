import {  Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';  
import { MatTableDataSource, MatTableModule } from '@angular/material/table';  
import { AuthService } from '../../services/auth.service';
import { UserDetails } from '../../interfaces/user-details';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort,MatSortModule } from '@angular/material/sort';
import { MatDialog,} from '@angular/material/dialog';
import { UserUpdateComponent } from '../../components/user-update/user-update.component';
@Component({
  selector: 'app-users',
  imports: [ MatCardModule,MatButtonModule,MatIconModule,
    MatTableModule,MatCheckboxModule,MatPaginatorModule,MatSortModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit  {

 
 dialog  =inject(MatDialog)
authService = inject(AuthService);
snackBar = inject(MatSnackBar);
dataSource = new MatTableDataSource<UserDetails>();
displayedColumns: string[] = ['fullName', 'email','status', 'roles', 'action'];

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

ngOnInit() {
  this.authService.getAll().subscribe(users => {
    this.dataSource.data = users;
    this.dataSource.paginator= this.paginator ;
    this.dataSource.sort = this.sort;
  });
}


loadUser() :void{
  this.authService.getAll().subscribe(users => {
    this.dataSource.data = users;
    this.dataSource.paginator= this.paginator ;
    this.dataSource.sort = this.sort;
  });
}

editUserRole(id:string){
  this.openDialog(id,'role');
  
}
editUserStatus(id:string){
  this.openDialog(id,'status');  
}


openDialog(userid:string,type:string): void {
  this.dialog.open(UserUpdateComponent, {
    width: '40%',
    enterAnimationDuration:'1000ms',
    exitAnimationDuration:'1000ms',
    data:{
      userid:userid,
      type:type,
    }
  }).afterClosed().subscribe(res=>{
    this.loadUser()
  });
}

}
