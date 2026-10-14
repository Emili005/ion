import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly clave = 'ip_servidor';

  // Lee la IP guardada. Si no hay ninguna, usa localhost
  private _ip: string = localStorage.getItem(this.clave) ?? 'localhost';

  // Lo que está escrito en el campo de IP del login
  get ip(): string {
    return this._ip;
  }

  // Cada vez que cambia la IP, se guarda en el navegador
  set ip(valor: string) {
    this._ip = valor;
    localStorage.setItem(this.clave, valor);
  }

  // Arma la URL de un PHP. Ejemplo: this.api.url('registro.php')
  url(archivo: string): string {
    return `http://${(this._ip || '').trim()}/api_ionic/${archivo}`;
  }

  // true si la IP es localhost o 127.0.0.1
  esLocalhost(): boolean {
    const host = (this._ip || '').trim().toLowerCase();
    return host === 'localhost' || host === '127.0.0.1';
  }
}