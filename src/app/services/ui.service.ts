import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  private loadingC = inject(LoadingController);
  private toastC = inject(ToastController);
  private loadingElement: HTMLIonLoadingElement | undefined;
  constructor() { }

  showLoading(msg?:string):Promise<void>{
    return new Promise(async(resolve,reject)=>{
      if(this.loadingElement){
        resolve();
      }else{
        this.loadingElement=await this.loadingC.create({message:msg});
        this.loadingElement=undefined;
        resolve();
      }
    })
  }

  async hideLoading():Promise<void>{
    if(!this.loadingElement) return;
    await this.loadingElement.dismiss();
    this.loadingElement=undefined;
  }

  async showToast(msg:string,
    color:string='primary',
    duration:number=1000,
    position:"top"|"bottom"|"middle"|undefined="middle",
    ):Promise<void>{
    let toast: HTMLIonToastElement = await this.toastC.create({
      message:msg,
      duration:duration,
      position:position,
      color:color,
      translucent:true
    });
    toast.present();
  }
}
