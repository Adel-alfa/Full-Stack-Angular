import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
 const authService = inject(AuthService);

 const router=inject(Router);

  if(!authService.getToken()) return next(req);
    
    const cloned = req.clone({
      headers: req.headers.set(
        'Authorization', 
        `Bearer ${authService.getToken()}`) ,
    });
    return next(cloned).pipe(
      catchError((err:HttpErrorResponse)=>{
        if(err.status === 401) {
          authService.refreshToken({
            email:authService.getUserDetail()?.email,
            token:authService.getToken() || "",
            refreshToken:authService.getRefreshToken() || "",
          }).subscribe({
            next: (res) => {
              if(res.isSuccess){
                localStorage.setItem("user",JSON.stringify(res));
                const cloned = req.clone({
                  setHeaders:{
                    Authorization: `Bearer ${res.token}`
                  },
                });
                location.reload();
              }
            },
            error: () => {
              authService.logout();
              router.navigate(['/login']);
            },
          });
        }
        return throwError(err);
      })
      
    )
  
};
