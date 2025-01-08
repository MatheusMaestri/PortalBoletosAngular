import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const guardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const temCnpjCpf = sessionStorage.getItem('cnpj_cpf');

  if (!temCnpjCpf) {
    router.navigate(['/']);
    return false;
  } else{
    return true;
  }

};
