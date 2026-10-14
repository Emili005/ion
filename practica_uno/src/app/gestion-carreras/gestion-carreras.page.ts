import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonList } from '@ionic/angular';
import { ApiService } from '../services/api.service';

interface Carrera {
  id?: number;
  nombre: string;
  tipo: string;
}

@Component({
  selector: 'app-gestion-carreras',
  templateUrl: './gestion-carreras.page.html',
  styleUrls: ['./gestion-carreras.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, IonSelect, IonSelectOption, IonList]
})
export class GestionCarrerasPage {

  carrera: Carrera = {
    nombre: '',
    tipo: ''
  };

  listaCarreras: Carrera[] = [];

  // Opciones permitidas por el campo ENUM de la base de datos
  tiposCarrera: string[] = ['Licenciatura', 'Ingenieria', 'Maestria'];

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
    private router: Router,
    public api: ApiService
  ) {}

  // Se ejecuta cada vez que entras a la pantalla
  ionViewWillEnter() {
    this.obtenerCarreras();
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  obtenerCarreras() {
    this.http.get<Carrera[]>(this.api.url('carreg.php')).subscribe({
      next: (data) => {
        this.listaCarreras = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  validarGuardar() {
    const nombreLimpio = this.carrera.nombre ? this.carrera.nombre.trim() : '';

    if (!nombreLimpio) {
      this.mostrarAlerta('Atención', 'El nombre de la carrera es obligatorio.');
      return;
    }

    if (nombreLimpio.length > 30) {
      this.mostrarAlerta('Atención', 'El nombre no puede exceder los 30 caracteres.');
      return;
    }

    if (!this.carrera.tipo) {
      this.mostrarAlerta('Atención', 'Debe seleccionar un tipo de carrera.');
      return;
    }

    // Revisa en la lista que ya cargó si la carrera existe
    const yaExiste = this.listaCarreras.some(
      c => c.nombre.trim().toLowerCase() === nombreLimpio.toLowerCase()
    );

    if (yaExiste) {
      this.mostrarAlerta('Carrera duplicada', `La carrera "${nombreLimpio}" ya se encuentra registrada.`);
      return;
    }

    this.http.post<{ status: string; mensaje: string }>(this.api.url('carreg.php'), { ...this.carrera, nombre: nombreLimpio }).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.mostrarAlerta('Éxito', response.mensaje);
          this.limpiarFormulario();
        } else {
          this.mostrarAlerta('Error', response.mensaje);
        }
      },
      error: (err) => {
        console.error(err);
        if (err.status === 409) {
          // El PHP manda el motivo en err.error.mensaje
          this.mostrarAlerta('Carrera duplicada', err.error?.mensaje ?? 'Esa carrera ya existe.');
        } else {
          this.mostrarAlerta('Error', 'No se pudo conectar con el servidor. Revisa la IP en el login.');
        }
      }
    });
  }

  limpiarFormulario() {
    this.carrera = {
      nombre: '',
      tipo: ''
    };
    this.router.navigate(['/home']);
  }
}