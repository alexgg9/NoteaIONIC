import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Note } from '../model/note';
import { NoteService } from '../services/note.services';
import {IonButton, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonTextarea, IonTitle, IonToolbar, LoadingController } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonButton,
    IonIcon
  ],
})
export class Tab1Page {
  public form!:FormGroup
  private formB = inject(FormBuilder);
  private noteS = inject(NoteService);
  private loadingS = inject(LoadingController);
  private myLoading:any;
  constructor() {
    this.form = this.formB.group({
      title:['',[Validators.required, Validators.minLength(4)]],
      description:['']
    });
  }

  public async saveNote():Promise<void>{
    let note:Note={
      title:this.form.get("title")?.value,
      description:this.form.get("description")?.value,
      date:Date.now().toLocaleString()
    }
    this.myLoading=await this.loadingS.create({});
    await this.noteS.addNote(note);
    this.myLoading.dismiss();
  }
}
