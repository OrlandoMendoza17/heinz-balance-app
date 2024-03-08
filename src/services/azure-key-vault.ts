import { DefaultAzureCredential } from "@azure/identity"

import { SecretClient } from "@azure/keyvault-secrets";

const KEY_VAULT_URI = process.env.KEY_VAULT_URI || ""

const getSecrets = async () =>{
  
  const credential = new DefaultAzureCredential()
  const client = new SecretClient(KEY_VAULT_URI, credential)
  
  const { value } = await client.getSecret("DB-CREDENTIALS-SIPVEH")
  return value
}

export default getSecrets;