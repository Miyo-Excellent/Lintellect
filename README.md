# Lintellect

## Pre-requisitos
* Instalación de Node
* Instalación de MongoDB
* Instalar dependencias con `npm install` o `yarn install`

## Scripts
  *  build: compila los paquetes para el servidor y para el cliente
  *  clean: borra la carpeta donde están alojado los builds
  *  lint: checkea el código mediante ESlint
  *  git-hooks (precommit, prepush, etc.): scripts auto-ejecutables al instanciar un script
  *  start: corre el proyecto (Servidor y Cliente) con Hot-Reload y muchas otras características
  *  start-analyzer: inicia un servicio para analizar los paquetes alojados en el proyecto. (Se recomienda usar este script para supervisar el tamaño de los paquetes)
  *  start-production: corre el proyecto (Servidor y Cliente) optimización máxima
  *  test: nothing.
  *  watch-client: corre el proyecto (solo Front-End)
  *  watch-server: corre el proyecto (solo Back-End)s
  * Compresión GZip


## Características relevantes
  *  Eslint  
  * Configuración de Webpack
    * Cliente
    * Servidor
    * Optimizaciones de Bundle
    * División de bundles
    * Webpack Hot Middleware / Webpack Dev Middleware / Webpack Hot Server Middleware
  * Server Side Rendering (SSR)
  * GraphQL
  * APOLLO GraphQL
  * Manejo de rutas
  * Data con State local
  * Data con Redux
  * Envió del Redux Initial State Desde el Servidor  
  * Utilizar SSR sólo cuando detectamos un Search Bot 
  * Integraciòn con Gravatar
  * Encriptación de contraseñas para los usuarios 
  * Compresión GZip
  * Compilación SASS, SCSS
  * Compilación LESS
  * Compilación CSS
  * Compilación POST-CSS
  * Compilación JS
  * Compilación ES6
  * Compilación PNG, JGP, GIF, SVG
  * Compilación JSON
  
## Metodos HTTP  API
* Registro/sign-up via JSON/TOKEN de usurios 
* Ingreso/sign-in via JSON/TOKEN de usurios 
* Retorna un producto, es necesario tener un JSON/TOKEN de usurios 
* Retorna todos los productos, es necesario tener un JSON/TOKEN de usurios 
* Insertar producto, es necesario tener un JSON/TOKEN de usurios 
* Eliminar producto, es necesario tener un JSON/TOKEN de usurios 
* Actualizar producto, es necesario tener un JSON/TOKEN de usurios

## ¿Como crear un usuario?
> Es necesario enviar datos al end-point (POST)
> `localhost:3000/signup` 
>```json
> {
>  "email": "theofficesmichell@gmail.com",
>  "password": "Secret",
>  "name": "Michell Excellent"
> }
>```

### ¿Como iniciar sesion?
> Es necesario enviar datos al end-point (POST), esta petición retorna un JSON/TOKEN que se debe almacenar en el dispositivo (tiene vigencia de 8 días)
> `localhost:3000/signip` 
>```json
> {
>  "email": "theofficesmichell@gmail.com",
>  "password": "Secret"
> }
>```

### ¿Como crear un producto?
> Es necesario enviar datos al end-point (POST), el JSON/TOKEN debe ir en `Headers` de la petición con el nombre/key `authorization`
>ejemplo 
>```json
>{
>  "headers": {
>    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjYxNzQ2MDUsImV4cCI6MTU2Njg2NTgwNX0.cqJ50JYUJ3s4iWre76zCat9E5yqYrryp-OUZLezWnjI"
>  }
>}
>```
> Siguiente Paso.
> `localhost:3000/api/product` 
>```json
>{
>  "category": "computers",
>  "name": "MacBook Pro",
>  "picture": "url of image",
>  "price": "99999"
>}
>```

### ¿Como actualizar un producto?
> Es necesario enviar datos al end-point (PUT), el JSON/TOKEN debe ir en `Headers` de la petición con el nombre/key `authorization`
>ejemplo 
>```json
>{
>  "headers": {
>    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjYxNzQ2MDUsImV4cCI6MTU2Njg2NTgwNX0.cqJ50JYUJ3s4iWre76zCat9E5yqYrryp-OUZLezWnjI"
>  }
>}
>```
> Siguiente Paso. Se deben enviar en el (`body`) los valor que se quieren actualizar
> `localhost:3000/api/product` 
>```json
>{
>  "price": "99999",
>  "name": "New Name"
>}
>```

### ¿Como borrar un producto?
> Es necesario enviar datos al end-point (PUT), el JSON/TOKEN debe ir en `Headers` de la petición con el nombre/key `authorization`
>ejemplo 
>```json
>{
>  "headers": {
>    "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjYxNzQ2MDUsImV4cCI6MTU2Njg2NTgwNX0.cqJ50JYUJ3s4iWre76zCat9E5yqYrryp-OUZLezWnjI"
>  }
>}
>```
> Siguiente Paso.
> `localhost:3000/api/product/:product_id`

### Pendientes
*  Integrar servicio de Amazon Web Services (AWS) S3 para el almacenamiento de las imagenes
*  Guardar el log de cada petición, este registro debe quedar guardado en una carpeta de
   Nombre logs y solo debe guardar los 5 últimos archivos con un peso maximo de 5 MB
*  Integrar Apollo en el cliente
*  Crear front-end para consumir el API/GraphQL
*  Crear version mobile/android para consumir el API/GraphQL
*  Desplegar en Heroku todos los proyectos
*  Desplegar la base de datos en Mongo Atlas o en Mlab
