# Lado front de mi curriculum Vitae con Angular 9 y Bootstrap 4

Este proyecto web ofrece mi curriculum (Antonio Fernández Lucena). Tiene tres perfiles para navegar:

- Como administrador, con todas la funcionalidades
- Como usuario genérico, que puede actulizar pero no eliminar ni entrar en el área de herramientas ni en la de administración de perfiles.
- Sin log in, modo consulta

## [Demo](https://aflcv-front.web.app)

Para una demo completa, tendríamos que instalar el proyecto java aflcv-back, que podemos [descargar](https://github.com/antonio63j/aflcv-back.git) 

### Requisitos

###### Este proyecto corre correctamente con:

```bash
OS: win32 x64

node 14.2.0

npm 6.9.0

Angular CLI: 9.1.1

Angular: 9.1.1

@angular-devkit/architect 0.901.4

@angular-devkit/build-angular 0.901.4

@angular-devkit/build-optimizer 0.901.4

@angular-devkit/build-webpack 0.901.4

@angular-devkit/core 9.1.4

@angular-devkit/schematics 9.1.1

@angular/cdk 9.2.2

@angular/material 9.2.2

@ngtools/webpack 9.1.4

@schematics/angular 9.1.1

@schematics/update 0.901.1

rxjs 6.5.5

typescript 3.8.3

webpack 4.42.0


```

### Instalación

```bash
$ git clone https://github.com/antonio63j/aflcv-front.git
$ cd aflcv-front

# instalacion de dependencias
$ npm install

# Ejecutar en local en el puerto 4200 (con angular-cli en local)
$ npm run -- ng serve -o [--port 4200]

# Para crear la version de producción en el directorio 'dist', ver # package.json 
$ npm run prod 
# también
$ npm run -- ng build --prod --base-href="./"
```



### Deploy en Firebase

- Crear proyecto aflcv-front en Firebase
  
  

- Instalar las herramientas Firebase
  
  **npm install -g firebase-tools**
  
  

- Iniciar sesión en Firebase
  
  **firebase login**
  
  

- Preparación del proyecto
  
  **firebase init**
  
  Solo se necesita hosting y cuando pregunta por cuál sería el directorio público, ponemos 'dist' 
  
  

- Una vez generado 'dist', hacemos deploy
  
  **firebase deploy**
















































