import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthService } from '../auth.service';
import { Usuario } from '../usuario';
import swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {


    usuario: Usuario = new Usuario();


    constructor(
        private router: Router,
        public authService: AuthService) {
    }

    ngOnInit() {
        if (this.authService.isAuthenticated()) {
            this.router.navigate (['/dashboard']);
            swal.fire('Aviso', `Ya estás autenticado! ${this.authService.usuario.username}`, 'info');
          }
    }

    onLoginAdmin() {
        this.usuario.username = 'admin';
        this.usuario.password = '12345';
        this.login();
    }

    onLoginUser() {
        this.usuario.username = 'antonio';
        this.usuario.password = '12345';
        this.login();
    }
    onQueryMode() {

        console.log(this.usuario);
        this.router.navigate(['/cursos']);
    }

    login(): void {
        this.authService.login(this.usuario).subscribe(
          response => {
            console.log(response);
            this.authService.guardarUsuario(response.access_token);
            this.authService.guardarToken(response.access_token);
            const usuario = this.authService.usuario;
            console.log(`login con éxito de ${usuario.username}`);
            this.router.navigate(['/dashboard']);
          },
          err => {
            if (err.status === 400) {
            swal.fire('Error Login', 'las credenciales son incorrectas!', 'error');
            }
          }
          );
        return;
      }
}
