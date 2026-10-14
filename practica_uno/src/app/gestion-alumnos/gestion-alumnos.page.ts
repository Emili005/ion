import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonList } from '@ionic/angular';
import { ApiService } from '../services/api.service';

interface Alumno {
  n_control: string;
  nombre: string;
  snombre: string;
  apat: string;
  amat: string;
  genero: string;
  fecha_nac: string;
  fk_caralu: string | number;
}

interface Carrera {
  id: number;
  nombre: string;
  tipo?: string;
}

@Component({
  selector: 'app-gestion-alumnos',
  templateUrl: './gestion-alumnos.page.html',
  styleUrls: ['./gestion-alumnos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, IonSelect, IonSelectOption, IonList]
})
export class GestionAlumnosPage {

  alumnos: Alumno = {
    n_control: '',
    nombre: '',
    snombre: '',
    apat: '',
    amat: '',
    genero: '',
    fecha_nac: '',
    fk_caralu: ''
  };

  // Se llena desde la base de datos
  listaCarreras: Carrera[] = [];

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
    private router: Router,
    public api: ApiService
  ) {}

  // Se ejecuta cada vez que entras a la pantalla (también la primera vez)
  ionViewWillEnter() {
    this.obtenerCarreras();
  }

  obtenerCarreras() {
    this.http.get<Carrera[]>(this.api.url('carreg.php')).subscribe({
      next: (data) => {
        this.listaCarreras = data;
      },
      error: (err) => {
        console.error('Error al cargar carreras:', err);
      }
    });
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  validarGuardar() {
    if (!this.alumnos.n_control.trim()) {
      this.mostrarAlerta('Atención', 'El número de control es obligatorio.');
      return;
    }
    if (!this.alumnos.nombre.trim()) {
      this.mostrarAlerta('Atención', 'El nombre es obligatorio.');
      return;
    }
    if (!this.alumnos.apat.trim()) {
      this.mostrarAlerta('Atención', 'El apellido paterno es obligatorio.');
      return;
    }
    if (!this.alumnos.amat.trim()) {
      this.mostrarAlerta('Atención', 'El apellido materno es obligatorio.');
      return;
    }
    if (!this.alumnos.genero.trim()) {
      this.mostrarAlerta('Atención', 'El género es obligatorio.');
      return;
    }
    if (!this.alumnos.fecha_nac) {
      this.mostrarAlerta('Atención', 'La fecha de nacimiento es obligatoria.');
      return;
    }

    const edad = this.calcularEdad(this.alumnos.fecha_nac);

    if (edad < 12) {
      this.mostrarAlerta('Edad no permitida', `El alumno debe tener al menos 12 años (edad calculada: ${edad} años).`);
      return;
    }
    if (edad > 100) {
      this.mostrarAlerta('Edad no permitida', `La edad máxima permitida es de 100 años (edad calculada: ${edad} años).`);
      return;
    }

    if (!this.alumnos.fk_caralu) {
      this.mostrarAlerta('Atención', 'Debe seleccionar una carrera.');
      return;
    }

    this.http.post<{ status: string; mensaje: string }>(this.api.url('alureg.php'), this.alumnos).subscribe({
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
        this.mostrarAlerta('Error', 'No se pudo conectar con el servidor. Revisa la IP en el login.');
      }
    });
  }

  // Calcula la edad a partir de "AAAA-MM-DD" sin el desfase de zona horaria
  calcularEdad(fechaNacimientoStr: string): number {
    const [anio, mes, dia] = fechaNacimientoStr.split('-').map(Number);
    const hoy = new Date();

    let edad = hoy.getFullYear() - anio;
    const mesActual = hoy.getMonth() + 1;

    if (mesActual < mes || (mesActual === mes && hoy.getDate() < dia)) {
      edad--;
    }

    return edad;
  }

  limpiarFormulario() {
    this.alumnos = {
      n_control: '',
      nombre: '',
      snombre: '',
      apat: '',
      amat: '',
      genero: '',
      fecha_nac: '',
      fk_caralu: ''
    };

    this.router.navigate(['/home']);
  }
}