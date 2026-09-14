import { Injectable, signal, computed} from '@angular/core';
import { StorageService } from './storage.service';
import { StorageKeys } from '../constants/storage-keys';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  //Signals para controlar el estado actual del usuario
  currentUser = signal<User | null>(null);

  loggedIn = signal(false);

  //Para acceder a todos los datos del usuario y mostrarlos en el html
  user = computed(() => this.currentUser());



  constructor(private storage: StorageService) {

      //Inicializa los signals, llenandolos con lo que haya en base de datos en el momento
      this.initializeSession();

   }

  //Guardar el token
  saveToken(token: string): void {

    this.storage.set(
        StorageKeys.TOKEN,
        token
    );

    this.loggedIn.set(true);

  }

  //Obtener el token
  getToken(): string | null {

    return this.storage.get<string>(
        StorageKeys.TOKEN
    );

  }


  //Metodo para guardar el usuario actual en el inicio de sesion
  saveCurrentUser(user: User): void {

    this.storage.set(
        StorageKeys.CURRENT_USER,
        user
    );

    this.currentUser.set(user);

  }


  //Obtener el usuario actual
  getCurrentUser(): User | null {

    return this.currentUser();

  }

  //Cerrar la sesion
  logout(): void {

    this.storage.remove(
        StorageKeys.TOKEN
    );

    this.storage.remove(
        StorageKeys.CURRENT_USER
    );

    this.loggedIn.set(false);

    this.currentUser.set(null);

  }


  //Metodo para decir cuando un usuario esta logeado
  isLoggedIn(): boolean {

    return this.loggedIn();

  }


  //Metodo para inicializar los signals al ingresar por primera vez o recargar
  private initializeSession(): void {

  const token = this.storage.get<string>(
    StorageKeys.TOKEN
  );

  const user = this.storage.get<User>(
    StorageKeys.CURRENT_USER
  );

  this.loggedIn.set(!!token);

  this.currentUser.set(user);

}

}
