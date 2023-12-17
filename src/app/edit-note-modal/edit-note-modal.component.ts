import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../model/note';
import { NoteService } from '../services/note.services';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { UIService } from '../services/ui.service';

@Component({
  selector: 'app-edit-note-modal',
  templateUrl: './edit-note-modal.component.html',
  styleUrls: ['./edit-note-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class EditNoteModalComponent  implements OnInit {

  @Input() note!: Note;
  public noteS: NoteService;
  private UI: UIService;
  constructor(UI: UIService,noteS: NoteService,private modalController: ModalController) {
    this.noteS= noteS;
    this.UI = UI;
  }
  ngOnInit(): void {
  }

  async saveChanges() {
    this.noteS.updateNote(this.note)
      .then(() => {
        this.UI.showToast('Nota editada correctamente', 'success');
        this.modalController.dismiss();
      })
      .catch((error) => {
        console.error("Error al actualizar la nota:", error);
        this.UI.showToast('Error al editar la nota', 'danger');
      });
  }

  close() {
    this.modalController.dismiss();
  }

  public async takePic() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    if (image.webPath) {
      const base64Image = await this.convertToBase64(image.webPath);
      this.note.img = base64Image;
    } else {
      console.error('No se pudo obtener el webPath de la imagen');
    }
  }

  private convertToBase64(webPath : string) {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', webPath);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  public async openModalMap() {
    const modal = await this.modalController.create({
      component: MapModalComponent,
      componentProps: {
        position: this.note.position
      }
    });

    modal.onDidDismiss().then((data) => {
      console.log('Data:', data);
      console.log('Data.data:', data.data);

      if (data && data.data ) {

        const { lat, lng } = data.data;
        console.log('lat:', lat);
        console.log('lng:', lng);
        if (this.note) {
          if (this.note.position) {
            if (lat !== undefined && lng !== undefined) {
              this.note.position[0] = lat;
              this.note.position[1] = lng;
            } else {
              console.error('Error: Invalid latitude or longitude');
            }
          } else {
            this.note.position = [lat ? lat.toString() : '', lng ? lng.toString() : ''];
          }
        } else {
          console.error('Error: this.note is undefined');
        }
      } else {
        console.error('Error: Invalid data format');
      }
    });

    await modal.present();

  }

}
