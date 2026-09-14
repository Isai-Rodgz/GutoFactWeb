import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';
import { StorageService } from './storage.service';
import { RegisterRequest } from '../models/register-request.model';
import { UserService } from './user.service';
import { CryptoService } from './crypto.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private userService: UserService, private cryptoService: CryptoService,
    private sessionService: SessionService) {}


  // /// METODOS Privados /// //



  // /// METODOS PUBLICOS /// //


  //Metodo de registro de usuario desde autenticacion hasta base de datos devolviendo hash
  async register(request: RegisterRequest): Promise<AuthResponse> {

  const hashedPassword =
    await this.cryptoService.hashPassword(request.password);

  return await this.userService.create(request,hashedPassword);

  }

  //Metodo para iniciar sesion
  async login (email: string,password: string): Promise <AuthResponse> {

    //Parametro para obtener el email seleccionado
    const user = this.userService.getByEmail(email);

    // Validacion de si el usuario existe
    if (!user) {
    return {
      success: false,
      message: 'El correo no está registrado.'
      };
    }

    // Validacion de si la Contraseña del usuario es la correcta 
    // (a traves del hash en cryptpservice)
    const valid = await this.cryptoService.verifyPassword
    (password,user.password);

    if (!valid) {
      return {
        success: false,
        message: 'Contraseña incorrecta.'};
    }

    //Genera un token y lo guarda en la variable
    const token = this.cryptoService.generateToken();

    //Guarda el token en localstorage
    this.sessionService.saveToken(token);

    //Guarda el usuario actual
    this.sessionService.saveCurrentUser(user);


    //Regresar un mensaje de que todo salio bien
    return {
      success: true,
      message: 'Inicio de sesión exitoso.'
    };

  }

  //Metodo para obtener el usuario que inicio sesion
  getCurrentUser(): User | null {

    return this.sessionService.getCurrentUser();

  }


  //Metodo para terminar la sesion (elimina el token que la valida)
  logout(): void {

    this.sessionService.logout();

  }

  

  /* Este método responderá:

  true → hay sesión iniciada.
  false → no hay sesión. */
  
  isLoggedIn(): boolean {

    return this.sessionService.isLoggedIn();

  }



  

  
}
