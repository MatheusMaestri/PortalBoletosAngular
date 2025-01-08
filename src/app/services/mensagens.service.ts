import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensagensService {
  logInfo(message: string, data?: any) {}

  logError(message: string, data?: any) {}

  logDebug(message: string, data?: any) {}
}
