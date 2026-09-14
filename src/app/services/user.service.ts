import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { User } from '../models/user.model';
import { RegisterRequest } from '../models/register-request.model';
import { StorageKeys } from '../constants/storage-keys';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private storage: StorageService) { }


  //                //
  //METODOS PRIVADOS//
  //                //


  //Metodo para obtener todos los usuarios en un arreglo
  getAll(): User[] {

  return this.storage.get<User[]>(
    StorageKeys.USERS
  ) ?? [];

  }

  //Obtener la informacion del email indicado, porque necesito trabajar con el
  getByEmail(email: string): User | undefined {

  return this.getAll().find(
    user => user.email.toLowerCase() === email.toLowerCase() //No distingue entre mayusculas
  );

}

  //Metodo para recorrer cada email para ver si existe uno igual
  existsByEmail(email: string): boolean {

  return this.getByEmail(email) !== undefined;

  }

  
  //Metodo que registra el usuario (sin repetirlo)
  async create (request: RegisterRequest,hashedPassword: string): Promise <AuthResponse> {

  //Si existe un usuario igual arroja el error
  if (this.existsByEmail(request.email)) {

    
    return {
      success: false,
      message: 'El correo ya está registrado.'
    };

  }
  
  //Ejecuta el metodo de buscar los arreglos de usuarios en el base de datos
  const users = this.getAll();

  const user: User = {

    id: crypto.randomUUID(),

    email: request.email,

    password: hashedPassword, //Obtiene la contrasena convertida en hash

    empresa: request.empresa,

    country: request.country,

    createdAt: new Date()

  };
  

  //Si no existe un usuario igual guardara ese que se digito y devuelve un mensaje de registrado
  users.push(user);

  this.save(users);

  return {

    success: true,

    message: 'Usuario registrado correctamente.'

  };

  }


  //                //
  //METODOS PRIVADOS//
  //                //

  //Metodo para guardar usuarios
  private save(users: User[]): void {

    this.storage.set(
      StorageKeys.USERS,
      users
    );

  }



}
