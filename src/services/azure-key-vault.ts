import { DefaultAzureCredential } from "@azure/identity"

import { SecretClient } from "@azure/keyvault-secrets";

const KEY_VAULT_URI = process.env.KEY_VAULT_URI || ""
/**
 * Función que obtiene los secretos de la vault de Azure Key Vault.
 * @returns {Promise<Secret>} Promesa que se resuelve con el secreto obtenido.
 */
const getSecrets = async () =>{

  //Se crea una instancia de la clase DefaultAzureCredential para autenticar con Azure
  const credential = new DefaultAzureCredential()
  // Se crea una instancia de la clase SecretClient para interactuar con la vault de Azure Key Vault.
  // La URI de la vault se pasa como parámetro.
  const client = new SecretClient(KEY_VAULT_URI, credential)
  // Se utiliza el método getSecret para obtener el secreto con el nombre "DB-CREDENTIALS-SIPVEH".
  // La respuesta se almacena en la variable "value".
  const { value } = await client.getSecret("DB-CREDENTIALS-SIPVEH")
  //Se devuelve el secreto obtenido.
  return value
}

export default getSecrets;