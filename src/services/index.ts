/**
 * URL base de la aplicación, obtenida desde la variable de entorno NEXT_PUBLIC_AAD_REDIRECT_ID.
 * @type {string}
 */
const base_url = process.env.NEXT_PUBLIC_AAD_REDIRECT_ID
/**
 * Exporta la URL base de la aplicación como valor predeterminado.
 */
export default base_url;
