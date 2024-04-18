export const VEHICULE_NOT_FOUND = "Vehicule Not Found"
export const VEHICULE_COMPANY_NOT_FOUND = "Vehicule Company Not Found"
export const DRIVER_NOT_FOUND = "Driver Not Found"
export const DRIVER_VEHICULE_RELATION_NOT_FOUND = "Driver-Vehicule Relation Not Found"
export const CHARGE_PLAN_NOT_FOUND = "CHARGE_PLAN_NOT_FOUND"

const errorMessages = {
  [VEHICULE_NOT_FOUND]: "No se ha podido encontrar el vehículo",
  [VEHICULE_COMPANY_NOT_FOUND]: "No se ha podido encontrar la compañía a la que pertenece el vehículo",
  [DRIVER_NOT_FOUND]: "No se ha podido encontrar la información del conductor",
  [DRIVER_VEHICULE_RELATION_NOT_FOUND]: "No se ha podido encontrar una relación entre el vehículo y un conductor",
  [CHARGE_PLAN_NOT_FOUND]: "El Plan de carga incresado es inválido",
}

const getErrorMessage = (responseMessage: string): string =>{
  const messages = Object.entries(errorMessages)
  const errorMessage = messages.find(([errorName]) => errorName === responseMessage)
  return errorMessage ? errorMessage[1] : "";
}

export default getErrorMessage;