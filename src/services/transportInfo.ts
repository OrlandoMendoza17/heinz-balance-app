import axios from "axios"
import { ModelTypesOptions } from "@/pages/api/models";
import base_url from ".";



/**
 * Esta función de TypeScript recupera información del conductor según la ID del conductor y el campo especificado.
 * @param {string} driverID - El parámetro `driverID` es una cadena que representa el único
 * identificador de un conductor.
 * @param {"CON_COD" | "CON_CED"} field - El parámetro `field` en la función `getDriver` especifica
 * qué campo de los datos del conductor recuperar. Puede tener uno de dos valores posibles: "CON_COD" o
 * "CON_CED". Este parámetro se utiliza para determinar si se recupera el código de identificación del conductor.
 * o su número de identificación.
 *  @returns - La función `getDriver` devuelve una Promesa que se resuelve en un objeto `Driver`.
 */
export const getDriver = async (driverID: string, field: "CON_COD" | "CON_CED") => {
  const { data } = await axios.post<Driver>(`${base_url}/api/drivers`, { driverID, field })
  return data;
}

/**
 * Esta función crea un nuevo controlador enviando una solicitud POST a un punto final API específico y devuelve
 * los datos del controlador recién creado.
 * @param {T_CON} driver  : el parámetro `driver` es del tipo `T_CON`, que probablemente sea un tipo genérico.
 * que representa algún tipo de objeto o dato del controlador. Se envía en el cuerpo de una solicitud POST a
 * el punto final `/api/newDriver` usando axios. Se espera que los datos de respuesta sean de
 *  @returns eturn La función `createDriver` devuelve los datos recibidos de la solicitud POST realizada a
 * Punto final `/api/newDriver` con el objeto `driver` proporcionado.
 */
export const createDriver = async (driver: T_CON) => {
  const { data } = await axios.post<Vehicule>(`${base_url}/api/newDriver`, { driver })
  return data;
}



/**
 * Esta función de TypeScript recupera información del vehículo según la identificación del vehículo o la matrícula.
 *  @param {string} vehiculeID - El parámetro `vehiculeID` es una cadena que representa el ID de un
 * vehículo. Se utiliza para identificar un vehículo específico en el sistema.
 *  @param {"VEH_ID" | "VEH_PLA"} field: el parámetro `field` en la función `getVehicule` especifica
 * qué campo recuperar para un vehículo. Puede tener uno de dos valores: "VEH_ID" o "VEH_PLA".
 * Dependiendo del valor proporcionado, la función devolverá el ID del vehículo o el
 * @returns La función `getVehicule` devuelve datos de tipo `Vehicule` obtenidos de la API
 * punto final `/api/vehicules` basado en los parámetros `vehiculeID` y `field` proporcionados.
 */
export const getVehicule = async (vehiculeID: string, field: "VEH_ID" | "VEH_PLA") => {
  const { data } = await axios.post<Vehicule>(`${base_url}/api/vehicules`, { vehiculeID, field })
  return data;
}

/**
 * Esta función recupera una lista de transportes basados ​​en un nombre determinado mediante una solicitud asincrónica.
 * @param name - El parámetro `name` en la función `getTransports` es de tipo `T_TRA["TRA_NOM"]`,
 * lo que significa que debe ser un tipo específico definido en el tipo `T_TRA`. Este tipo representa
 * el nombre de una entidad de transporte.
 * @returns La función `getTransports` devuelve una Promesa que se resuelve en una matriz de
 * Objetos `Transport` obtenidos del punto final API `/api/transports` según lo proporcionado
 * parámetro `nombre`.
 */

export const getTransports = async (name: T_TRA["TRA_NOM"]) =>{
  const { data } = await axios.post<Transport[]>(`${base_url}/api/transports`, { name })
  return data;
}


/**
 * La función crea un nuevo vehículo enviando una solicitud POST a un punto final API específico con el
 * datos del vehículo y DNI de origen.
 * @param vehicule - El parámetro `vehicule` es un objeto que representa un vehículo, con propiedades
 * como `VEH_NAME`, `VEH_TYPE`,, etc. Es de tipo `Omitir<T_VEH, "VEH_ID">`, lo que significa
 * es un objeto que
 * @param {número} [ORI_ID=0] - El parámetro `ORI_ID` en la función `createVehicule` es un número
 * que representa el ID de origen del vehículo. Es un parámetro predeterminado con un valor de 0 si no
 * proporcionado al llamar a la función.
 * @returns La función `createVehicule` devuelve los datos recibidos de la solicitud POST realizada a
 * `/api/nuevoVehículo`.
 */
export const createVehicule = async (vehicule: Omit<T_VEH, "VEH_ID">, ORI_ID: number = 0) => {
  const { data } = await axios.post<Vehicule>(`${base_url}/api/newVehicule`, { vehicule, ORI_ID})
  return data;
}



/**
 * Esta función recupera el conductor asociado a un vehículo realizando una solicitud POST a un determinado
 * End Point API.
 * @param {Vehicule} vehículo: el parámetro `vehicule` es un objeto que representa un vehículo. Es
 * pasado a la función `getDriverFromVehicule` para recuperar el conductor asociado con ese vehículo.
 * @returns La función `getDriverFromVehicule` devuelve los datos del conductor asociado con
 * el vehículo proporcionado.
 */
export const getDriverFromVehicule = async (vehicule: Vehicule) => {
  const { data } = await axios.post<Driver>(`${base_url}/api/drivers-vehicules-relation`, { vehicule })
  return data;
}


/**
 * Esta función recupera de forma asincrónica datos de modelos de vehículos desde un punto final API específico y devuelve
 * los datos recuperados.
 * @returns La función `getVehiculeModels` devuelve los datos recibidos de una solicitud POST a
 * `/api/modelos`.
 */
export const getVehiculeModels = async () => {
  const { data } = await axios.post<ModelTypesOptions>(`${base_url}/api/models`)
  return data;
}