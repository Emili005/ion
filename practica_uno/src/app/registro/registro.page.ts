import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, IonList } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonInput, IonList]
})
export class RegistroPage implements OnInit {

  usuarios = {
    nombre: '',
    matricula: '',
    correo: ''
  };

  // false = Login, true = Registro
  esRegistro: boolean = false;

  // "public" para que el HTML pueda usar api.ip en el campo de IP
  constructor(private http: HttpClient, private router: Router, public api: ApiService) {}

  ngOnInit() {}

  cambiarModo() {
    this.esRegistro = !this.esRegistro;
  }

  procesarAccion() {
    if (!this.api.ip || !this.api.ip.trim()) {
      alert('Escribe la IP del servidor o localhost.');
      return;
    }

    // En el celular, localhost apunta al propio celular, no a la PC
    if (Capacitor.isNativePlatform() && this.api.esLocalhost()) {
      alert('En el celular no funciona localhost. Escribe la IP de tu PC.');
      return;
    }

    if (!this.usuarios.matricula.trim() || !this.usuarios.correo.trim()) {
      alert('Por favor, llena al menos la matrícula y el correo.');
      return;
    }

    if (this.esRegistro && !this.usuarios.nombre.trim()) {
      alert('El nombre es obligatorio para registrarse.');
      return;
    }

    const datosEnvio = {
      nombre: this.usuarios.nombre.trim(),
      matricula: this.usuarios.matricula.trim(),
      correo: this.usuarios.correo.trim(),
      accion: this.esRegistro ? 'registrar' : 'login'
    };

    this.http.post<{ status: string; mensaje: string }>(this.api.url('registro.php'), datosEnvio).subscribe({
      next: (respuesta) => {
        if (respuesta.status === 'success') {
          this.router.navigate(['/home']);
        } else {
          alert(respuesta.mensaje);
        }
      },
      error: (err) => {
        console.error(err);
        alert('No se pudo conectar con el servidor. Revisa la IP y que XAMPP esté encendido.');
      }
    });
  }
}