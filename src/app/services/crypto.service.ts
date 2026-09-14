import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  //Metodo para convertir en hash la contrasena
  async hashPassword(password: string): Promise<string> {
  
    const encoder = new TextEncoder();
  
    const data = encoder.encode(password);
  
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      data
    );
  
    const hashArray = Array.from(new Uint8Array(hashBuffer));
  
    return hashArray
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  
  }

  //Metodo para verificar la contra como hash
  async verifyPassword(password: string,hashedPassword: string): Promise<boolean> {

    const hash = await this.hashPassword(password);

    return hash === hashedPassword;

  }

  //Generamos el token
  generateToken(): string {

    return crypto.randomUUID();

  }


}
