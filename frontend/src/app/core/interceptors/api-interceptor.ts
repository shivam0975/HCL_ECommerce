import { HttpInterceptorFn } from '@angular/common/http';

const API_BASE_URL = 'https://localhost:7196/api';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Clone the request and set the URL with the base URL
  const apiReq = req.clone({
    url: req.url.startsWith('http') ? req.url : `${API_BASE_URL}${req.url}`
  });
  return next(apiReq);
};
