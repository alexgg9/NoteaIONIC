import { Component,inject } from '@angular/core';
import {IonicModule, LoadingController} from '@ionic/angular'
  import {FormBuilder,FormGroup,FormsModule,
  ReactiveFormsModule,Validators} from '@angular/forms';
import { Note } from '../model/note';
import { NoteService } from '../services/note.services';
import { UIService } from '../services/ui.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule,
  FormsModule,ReactiveFormsModule],
})
export class Tab1Page {
  public form!:FormGroup;
  private formB = inject(FormBuilder);
  private noteS = inject(NoteService);
  private UIS = inject(UIService);
  public loadingS = inject(LoadingController);
  private myLoading!:HTMLIonLoadingElement;
  constructor() {
    this.form = this.formB.group({
      title:['',[Validators.required,Validators.minLength(4)]],
      description:['']
    });
  }


  public async saveNote():Promise<void>{
    if(!this.form.valid) return;
    let note:Note={
      title:this.form.get("title")?.value,
      description:this.form.get("description")?.value,
      date:Date.now().toLocaleString()
    }
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

  public async takePic(){
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });
    
      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      //var imageUrl = image.webPath;
    
      // Can be set to the src of an image now
      //imageElement.src = imageUrl;
  }
}