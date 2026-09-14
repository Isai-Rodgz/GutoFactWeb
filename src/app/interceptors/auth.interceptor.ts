import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('Interceptor ejecutado');

  const token = localStorage.getItem('token');

  if (token) {
    console.log('Token enviado:', token);
    
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }

  return next(req);

};