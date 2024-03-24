export const VEHICULE_NOT_FOUND = "Vehicule Not Found"
export const VEHICULE_COMPANY_NOT_FOUND = "Vehicule Company Not Found"
export const DRIVER_NOT_FOUND = "Driver Not Found"

const errorMessages = {
  [VEHICULE_NOT_FOUND]: "No se ha podido encontrar el vehículo",
  [VEHICULE_COMPANY_NOT_FOUND]: "No se ha podido encontrar la compañía a la que pertenece el vehículo",
  [DRIVER_NOT_FOUND]: "No se ha podido encontrar la información del conductor",
}

const getErrorMessage = (responseMessage: string): string =>{
  const messages = Object.entries(errorMessages)
  const errorMessage = messages.find(([errorName]) => errorName === responseMessage)
  return errorMessage ? errorMessage[1] : "";
}

export default getErrorMessage;