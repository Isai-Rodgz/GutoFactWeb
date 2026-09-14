import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController
  ) { }

  //Metodo principal para mostrar el toast
  private async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary'
  ) {

    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'top',
      color
    });

    await toast.present();

  }

  //Tipos de metodos toast segun la situacion
  async success(message: string) {
    await this.showToast(message, 'success');
  }

  async error(message: string) {
    await this.showToast(message, 'danger');
  }

  async warning(message: string) {
    await this.showToast(message, 'warning');
  }

  async info(message: string) {
    await this.showToast(message, 'primary');
  }

}