import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { Note } from '../model/note';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class MapModalComponent  implements OnInit {

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  form: FormGroup | undefined;
  showMap:boolean = false;
  position: { lat: number; lng: number; } | undefined;
  notes: Note[] = [];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.map = L.map(mapElement);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(this.map);
  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.setMarker(latitude, longitude);
            this.position = { lat: latitude, lng: longitude };
            console.log('Posición del mapa guardada:', this.position);
            this.map?.setView([latitude, longitude], 13);
          },
          (error) => {
            console.error('Error al obtener la ubicación actual:', error);
            this.map?.setView([37.6115100, -4.7474700], 13);
          }
        );
      } else {
        console.error('El navegador no admite la geolocalización');
        this.map.setView([37.6115100, -4.7474700], 13);
      }
  
      this.map.on('click', (event) => {
        const { lat, lng } = event.latlng;
        this.setMarker(lat, lng);
        this.position = { lat, lng };
        console.log('Posición del mapa guardada:', this.position);
      });
  
      if (this.isEditMode && this.initialLocation) {
        this.setMarker(this.initialLocation.lat, this.initialLocation.lng);
      }
    }
  }
  

  savePosition() {
    if (this.position && this.position.lat && this.position.lng) {
      this.dismissWithPosition(this.position);
      console.log(this.position);
      this.showMap = false;
    }
  }
  

  closeModal() {
    this.modalController.dismiss();
  }

  dismissWithPosition(position: { lat: number; lng: number }) {
    this.modalController.dismiss(position);
  }
  

  setMarker(lat: number, lng: number) {
    console.log('Marcador establecido en latitud:', lat, 'y longitud:', lng);
  }
  isEditMode: boolean = true;
  initialLocation = { 
    lat: 51.505,
    lng: -0.09
  };

}
