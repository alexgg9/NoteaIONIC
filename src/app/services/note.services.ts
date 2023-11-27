import { Injectable, inject } from '@angular/core';
import { DocumentReference, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore'
import { environment } from 'src/environments/environment';
import { Note } from '../model/note';
import { Observable } from 'rxjs';
//import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  myCollection: AngularFirestoreCollection<any>;
  private fireStore: AngularFirestore = inject(AngularFirestore);
  constructor() {
    this.myCollection = this.fireStore.collection<any>(environment.firebaseConfig.collectionName);
  }
  addNote(note: Note): Promise<DocumentReference> {
    return this.myCollection.add(note);
  }
  //todo: paginated read
  readAll(): Observable<any> {
    return this.myCollection.get();
  }
  readNote(key: string):  Observable<any> {
    return this.myCollection.doc(key).get();
  }
  updateNote(note: Note): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!note.key) reject("Key not defined");
      const { key, ...data } = note;
      try {
        resolve(await this.myCollection.doc(note.key).set(data));
      } catch (err) {
        reject(err);
      }
    })
  }
  deleteNote(note:Note):Promise<void>{
    return new Promise(async (resolve,reject)=>{
      if (!note.key) reject("Key not defined");
      try{
        resolve(await this.myCollection.doc(note.key).delete());
      }catch(err){
        reject(err);
      }
    });
  }

}