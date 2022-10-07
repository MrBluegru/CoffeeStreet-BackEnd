# CoffeeStreet-back-end

<p align="center">
  <img height="350" src="./img/coffeeStreet.png" />
</p>

Api de proyecto final para Soy Henry - FT-29a

# Arrancar el proyecto de manera local

1. Crear una base de datos en PostgreSQL "coffee"

2. Instalar las dependencias necesarias para el correcto funcionamiento, ejecuta el comando `npm install`

3. Clonar el archivo `.env.template` y renombrarlo a `.env`

4. Una vez instalada las dependencias, se realiza la creación de las entidades con prisma. Ejecuta el siguiente comando
   `npx prisma migrate dev --name init`

\*\*\* En el caso de querer hacer un vaciado de la base de datos (borrar la carpeta de migrations), ejecuta el comando `npm run prisma-d`, para después crear ejecutar `npx prisma migrate dev --name init` (crearla de nuevo).

## Entity Relationship Diagram 📊

## Construido con:

1. Node.js, Express, Prisma

### Rutas
----------------------
|Método/Ruta|Necesitas|Propósito|Status|
|--|--|--|--|
| ************************ |        **START SPRINT 1**            |     ************************          |************************|
|GET /products             | N / a                       |Conseguir info de todos los  productos                                       | pending |
|GET /products?name=value  | name of product             |Conseguir info de productos que coincidan con el name buscado                | pending |
|GET /products/:id         | idProduct                   |Encuentra un producto por su id                                              | pending |
|POST /products/           | info by body                |Creacion de nuevo producto                                                   | pending |
|PUT /products/:id         | idProduct                   |Actualización de la data del producto segun su Id                            | pending |
|DELETE /products/:id      | idProduct                   |Elimina un producto por su id                                                | pending |  
|GET /users                | N / a                       |Consigue todos los Clients.                                                  | pending |
|PUT /users                | idUser                      |Actualiza el rol de un Cliente en especifico                                 | pending |
|GET /register/mail        | email                       |Ruta para verificación de existencia de email, requiere email                | pending |
|************************ |   ************************                |      **END SPRINT 1**           |************************|************************ |
| ************************ |        **START SPRINT 2**            |     ************************          |************************|
|DELETE /users/delete | email | Elimina usuario| pending |
|POST /login | info by body | Loguea a usuario creando token| pending |
|POST /login/refresh | token | Crea un nuevo token para ampliar sesión| pending |
|POST /login/remove  | token | Destruye sesión eliminando token| pending |
|POST /login/forgot-pass | email | Envía correo para cambiar pass| pending |
|POST /login/reset-pass | info by body | Cambia password| pending |
|GET  /order/get-all  | N/A | Consigue todas las órdenes| pending |
|GET  /order/get-by-id  | idOrder | Consigue los detalles de una| pending | 
|GET  /order/get-by-user  | idUser | Consigue todas las órdenes de cada usuario| pending |
|POST /order/create  | info by body | Crea una nueva órden| pending |
|PUT  /change-status | idOrder | Cambia el status de una órden| pending |
|GET /product/discount | N/A | Consigue todos los productos que tengan discount| pending |
|PUT /product/discount | idProduct | Cambia descuento o lo elimina seteandolo a null| pending |
|PUT /product/stock | idProduct | Cambia stock, true o false| pending |
|GET  /users/favorite | idUser | Consigue todos los productos favoritos de un user| pending |
|POST /users/favorite | idUser, idProduct | Anade un producto a favoritos de un usuario| pending |
|DELETE /users/favorite | idUser, idProduct | Elimina un producto de la lista de favoritos de un usuario| pending | 
|************************ |   ************************                |      **END SPRINT 2**           |************************|************************ |
| ************************ |        **START SPRINT 3**            |     ************************          |************************|
GET  /mercadopago |                   |                | pending |
POST /mercadopago |                   |                | pending |
GET  /review  | N/A | Consigue todos los reviews | pending | 
POST /review/create | info by body | Crea un review | pending |
PUT  /review/update | idReview, info by body | Cambia un review | pending |
DELETE /review/remove | idReview | Elimina review | pending |
POST  /newsletter | email | Anade email en la tabla de newsletter | pending |
POST /newsletter/create | info by body | Crea y envía newsletter | pending |
DELETE /newsletter/remove | email | Eliminar email de la tabla de Newsletter | pending |
|************************ |   ************************                |      **END SPRINT 3**           |************************|************************ |
----------------------
