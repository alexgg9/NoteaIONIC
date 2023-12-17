import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { AlertController, IonicModule, LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../model/note';
import { NoteService } from '../services/note.services';
import { UIService } from '../services/ui.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { CommonModule } from '@angular/common';
import { MapModalComponent } from '../map-modal/map-modal.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class Tab1Page {
  @ViewChild('map') mapContainer!: ElementRef;
  public form!: FormGroup;
  private formB = inject(FormBuilder);
  private noteS = inject(NoteService);
  private UIS = inject(UIService);
  public loadingS = inject(LoadingController);
  private myLoading!: HTMLIonLoadingElement;
  public note: any;
  public image: string | undefined;
  

  constructor(private modalController: ModalController, private alertController: AlertController) {
    this.form = this.formB.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: [''],
      photoURI: [''],
      position: this.formB.group({
        latitude: ['',Validators.required],
        longitude: ['',Validators.required]
      })
    });
  }
  
  updatePositionValue(lat: number, lng: number) {
    const positionValue = `${lat},${lng}`;
    this.form.patchValue({
      position: positionValue
    });
  }
  
  
  takePos() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.updatePositionValue(lat, lng);
      },
      (error) => {
        console.error('Error al obtener la posición:', error);
      }
    );
  }

  public async saveNote(): Promise<void> {
    if (!this.form.valid) return;
  
    const position = this.form.get('position');
    const lat = position?.get('latitude')?.value;
    const lng = position?.get('longitude')?.value;
  
    if (!lat || !lng) {
      console.error('Valores de latitud o longitud faltantes en el formulario.');
      return;
    }
  
    const note: Note = {
      title: this.form.get('title')?.value,
      description: this.form.get('description')?.value,
      date: new Date().toLocaleString(),
      img: this.form.get('photoURI')?.value,
      position: [lat, lng]
    };
  
    await this.UIS.showLoading();
  
    try{
      await this.noteS.addNote(note);
      this.form.reset();
      await this.UIS.showToast("Nota introducida correctamente","success");
    }catch(error){
      await this.UIS.showToast("Error al insertar la nota","danger");
    }finally{
      await this.UIS.hideLoading();
    }
  }
  
  

  async openMapModal() {
    const modal = await this.modalController.create({
      component: MapModalComponent
    });
  
    modal.onDidDismiss().then((data) => {
      const position = data.data;
      if (position) {
        this.form.patchValue({
          position: {
            latitude: position.lat,
            longitude: position.lng
          }
        });
      }
    });
  
    return await modal.present();
  }
  
  

  public async takePic() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    if (image.webPath) {
      const base64Image = await this.convertToBase64(image.webPath);
      this.form.get("photoURI")?.setValue(base64Image);
    } else {
      console.error('No se pudo obtener el webPath de la imagen');
    }
  }

  private convertToBase64(webPath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fileReader = new FileReader();
  
      fileReader.onloadend = () => {
        const base64Image = fileReader.result as string;
        resolve(base64Image);
      };
  
      fileReader.onerror = () => {
        reject(fileReader.error);
      };
  
      xhr.open('GET', webPath);
      xhr.responseType = 'blob';
  
      xhr.onload = () => {
        const blob = xhr.response;
        fileReader.readAsDataURL(blob);
      };
  
      xhr.onerror = () => {
        reject(xhr.statusText);
      };
  
      xhr.send();
    });
  }

}