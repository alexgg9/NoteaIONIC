import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../model/note';
import { NoteService } from '../services/note.services';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

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
  constructor(noteS: NoteService,private modalController: ModalController) {
    this.noteS= noteS;
  }
  ngOnInit(): void {
  }

  saveChanges() {
  
    this.noteS.updateNote(this.note)
      .then(() => {
        this.modalController.dismiss();
      })
      .catch((error) => {
        console.error("Error al actualizar la nota:", error);
      });
  }

  close() {
    this.modalController.dismiss();
  }
}
