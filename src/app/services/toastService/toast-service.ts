import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) {
    this.init();
  }

  async init() { }

  async dismissToast() {
    await this.toastController.dismiss();
  }

  async presentToast(message: string, colour: string) {
    await this.dismissToast();
    const toast = await this.toastController.create({
      message: message,
      color: colour,
      position: 'top'
    });
    
    await toast.present();
  }

}
