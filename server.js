require('dotenv').config()

//Imports

/* The line `const { createServer } = require('http')` is importing the `createServer` function from
the Node.js core module `http`. This function is used to create an HTTP server that can listen for
incoming requests and handle them accordingly. In this context, it is being used to create a server
for the application to handle HTTP requests in the Node.js and Next.js setup. */

/* La línea `const { createServer } = require('http')` está importando la función `createServer` desde
el módulo principal de Node.js `http`. Esta función se utiliza para crear un servidor HTTP que puede escuchar
solicitudes entrantes y manejarlas en consecuencia. En este contexto, se está utilizando para crear un servidor.
para que la aplicación maneje solicitudes HTTP en la configuración de Node.js y Next.js. */
const { createServer } = require('http')


/* `const { parse } = require('url')` is importing the `parse` function from the Node.js core module
`url`. This function is used to parse URL strings into components like the protocol, hostname, port,
pathname, query parameters, etc. In this context, it allows the code to extract and work with
different parts of the URL in the HTTP requests handled by the server. */

/* `const { parse } = require('url')` está importando la función `parse` desde el módulo principal de Node.js
"URL". Esta función se utiliza para analizar cadenas de URL en componentes como el protocolo, el nombre de host, el puerto,
nombre de ruta, parámetros de consulta, etc. En este contexto, permite que el código extraiga y trabaje con
diferentes partes de la URL en las solicitudes HTTP manejadas por el servidor. */
const { parse } = require('url')


/* `const next = require('next')` is importing the `next` module in the Node.js application. The `next`
module is typically used in Next.js applications to handle server-side rendering, routing, and other
functionalities provided by the Next.js framework. By requiring the `next` module, the code can
access the functionalities and APIs provided by Next.js to build and manage the application's
frontend logic and behavior. */

/* `const next = require('next')` está importando el módulo `next` en la aplicación Node.js. El "siguiente"
El módulo se utiliza normalmente en aplicaciones Next.js para manejar la representación, el enrutamiento y otros aspectos del lado del servidor.
funcionalidades proporcionadas por el marco Next.js. Al requerir el módulo "siguiente", el código puede
acceder a las funcionalidades y API proporcionadas por Next.js para construir y administrar la aplicación
Lógica y comportamiento del frontend. */
const next = require('next')

//Constantes

/* The line `const NODE_ENV = process.env.NODE_ENV || ""` is setting up a constant variable `NODE_ENV`
that will store the value of the environment variable `NODE_ENV` if it is defined. */

/* La línea `const NODE_ENV = proceso.env.NODE_ENV || ""` está configurando una variable constante `NODE_ENV`
que almacenará el valor de la variable de entorno `NODE_ENV` si está definida. */
const NODE_ENV = process.env.NODE_ENV || ""


/* `const dev = process.env.NODE_ENV !== 'production'` is setting up a constant variable `dev` that
will be `true` if the value of the environment variable `NODE_ENV` is not equal to `'production'`.
This check is commonly used to determine if the application is running in a development environment
(`dev` mode) or in a production environment. In development mode, additional features like debugging
tools, logging, and hot reloading may be enabled to aid in the development process. */

/* `const dev = process.env.NODE_ENV !== 'producción'` está configurando una variable constante `dev` que
será "verdadero" si el valor de la variable de entorno "NODE_ENV" no es igual a "producción".
Esta verificación se usa comúnmente para determinar si la aplicación se está ejecutando en un entorno de desarrollo.
(modo `dev`) o en un entorno de producción. En modo de desarrollo, funciones adicionales como depuración.
Se pueden habilitar herramientas, registro y recarga en caliente para ayudar en el proceso de desarrollo. */
const dev = process.env.NODE_ENV !== 'production'

/* `const hostname = 'localhost'` is setting up a constant variable `hostname` with the value
`'localhost'`. In this context, it specifies the hostname or domain name that the server will be
listening on. By setting it to `'localhost'`, the server will be accessible only on the local
machine where it is running. This means that the server will only respond to requests made to
`http://localhost:<port>` where `<port>` is the specified port number. */

/* `const hostname = 'localhost'` está configurando una variable constante `hostname` con el valor
``host local''. En este contexto, especifica el nombre de host o nombre de dominio que será el servidor.
escuchando. Al configurarlo en `'localhost'`, el servidor será accesible sólo en el local
máquina donde está funcionando. Esto significa que el servidor sólo responderá a las solicitudes realizadas a
`http://localhost:<puerto>` donde `<puerto>` es el número de puerto especificado. */
const hostname = 'localhost'

/* The line `const port = process.env.PORT || 5000` is setting up a constant variable `port` that will
store the value of the environment variable `PORT` if it is defined. If the environment variable
`PORT` is not defined, the variable `port` will default to the value `5000`. */

/* La línea `const puerto = proceso.env.PORT || 5000` está configurando un `puerto` variable constante que
almacene el valor de la variable de entorno `PORT` si está definida. Si la variable de entorno
`PORT` no está definido, la variable `port` tendrá por defecto el valor `5000`. */
const port = process.env.PORT || 5000

console.log("NODE_ENV ->", NODE_ENV);
console.log("Development Build ->", dev);
console.log("PORT ->", port);

// const dbHost = process.env.DB_HOST
// const dbUser = process.env.DB_USER
// const dbName = process.env.DB_NAME
// const dbPassword = process.env.DB_PASSWORD
// const dbInstance = process.env.DB_INSTANCE

// console.log("dbHost: ", dbHost)
// console.log("dbUser: ", dbUser)
// console.log("dbName: ", dbName)
// console.log("dbPassword: ", dbPassword)
// console.log("dbInstance: ", dbInstance)


// when using middleware `hostname` and `port` must be provided below
const app = next({ dev: dev, hostname, port })
const handle = app.getRequestHandler()

/* This code block is setting up a server using Node.js and Next.js. Here's a breakdown of what it
does: */


/* The code block `app.prepare().then(() => { ... })` is setting up a server using Node.js and Next.js.*/

/* El bloque de código `app.prepare().then(() => { ... })` está configurando un servidor usando Node.js y Next.js. */
app.prepare().then(() => {

  /* The `createServer` function in the provided code block is setting up a server using Node.js to
  handle incoming HTTP requests. Here's a breakdown of what the code inside the `createServer`
  function is doing: */

  /* La función `createServer` en el bloque de código proporcionado configura un servidor usando Node.js para
  manejar solicitudes HTTP entrantes. Aquí hay un desglose del código dentro de `createServer`
  la función está haciendo: */
  createServer(async (req, res) => {

    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.

      // Asegúrese de pasar `true` como segundo argumento de `url.parse`.
      // Esto le indica que analice la parte de consulta de la URL.

      /* `const parsedUrl = parse(req.url, true)` is a line of code that is parsing the URL of the
      incoming HTTP request. */

      /* `const parsedUrl = parse(req.url, true)` es una línea de código que analiza la URL del
      Solicitud HTTP entrante. */
      const parsedUrl = parse(req.url, true)

      /* The line `const { pathname, query } = parsedUrl` is destructuring the `parsedUrl` object returned by
      the `parse` function. */

      /* La línea `const { nombre de ruta, consulta } = parsedUrl` está desestructurando el objeto `parsedUrl` devuelto por
      la función "parse". */
      const { pathname, query } = parsedUrl

      /* The code block you provided is handling different routes based on the `pathname` extracted from the
      incoming HTTP request URL. Here's a breakdown of what it's doing: */

      /* El bloque de código que proporcionaste maneja diferentes rutas según el `nombre de ruta` extraído del
      URL de solicitud HTTP entrante. Aquí hay un desglose de lo que está haciendo: */

      if (pathname === '/a') {

        /* The line `await app.render(req, res, '/a', query)` is a part of server-side rendering in a
        Node.js and Next.js application. Here's what it does: */

        /* La línea `await app.render(req, res, '/a', query)` es parte de la representación del lado del servidor en un
        Aplicación Node.js y Next.js. Esto es lo que hace: */
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        /* The line `await app.render(req, res, '/b', query)` is responsible for rendering the Next.js
        page associated with the route '/b' in a Node.js and Next.js application. Here's a breakdown
        of what it does: */

        /* La línea `await app.render(req, res, '/b', query)` es responsable de renderizar Next.js
        página asociada con la ruta '/b' en una aplicación Node.js y Next.js. Aquí hay un desglose
        de lo que hace: */
        await app.render(req, res, '/b', query)
      } else {

        /* The line `await handle(req, res, parsedUrl)` is responsible for handling the HTTP request
        using the Next.js request handler. */

        /* La línea `await handle(req, res, parsedUrl)` es responsable de manejar la solicitud HTTP
        utilizando el controlador de solicitudes Next.js. */

        await handle(req, res, parsedUrl)
      }

    } 
    /* The code block `catch (err) { console.error('Error occurred handling', req.url, err)
    res.statusCode = 500 res.end('internal server error')` is a part of error handling in the
    server setup. */

    /* El bloque de código `catch (err) { console.error('Se produjo un error al manejar', req.url, err)
    res.statusCode = 500 res.end('error interno del servidor')` es parte del manejo de errores en el
    configuración del servidor. */
    catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
/* The code snippet `    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })` is setting up an event listener for the 'error' event on the server. */

/* El fragmento de código ` .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })` está configurando un detector de eventos para el evento 'error' en el servidor. */
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
/* The code snippet `    .listen(port, () => {
      console.log(`> Ready on http://:`)
    })` is setting up the server to listen for incoming HTTP requests on a specific port. */

/* El fragmento de código ` .listen(puerto, () => {
      console.log(`> Listo en http://:`)
})` está configurando el servidor para escuchar las solicitudes HTTP entrantes en un puerto específico. */
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})