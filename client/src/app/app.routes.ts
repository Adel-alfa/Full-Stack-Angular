import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './guards/auth.guard';
import { UsersComponent } from './pages/users/users.component';
import { roleGuard } from './guards/role.guard';
import { RoleComponent } from './pages/role/role.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ProductsComponent } from './pages/products/products.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';


export const routes: Routes = [

    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'forget-password',
        component: ForgetPasswordComponent,        
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,        
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent, 
        canActivate: [authGuard],       
    },
    {
        path: 'account/:id',
        component: AccountComponent,
        canActivate: [authGuard],
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [roleGuard],
        data:{
            roles:['Admin'],
        },
    },
    {
        path: 'roles',
        component: RoleComponent,
        canActivate: [roleGuard],
        data:{
            roles:['Admin'],
        },
    },
    {
        path: 'categories',
        component: CategoriesComponent,
    },
    {
        path: 'products',
        component: ProductsComponent,
    },
    {
        path: 'add-product',
        component: AddProductComponent,
    },
    {
        path: 'user-home',
        component: UserHomeComponent,
    }
    
];
