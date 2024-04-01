export enum DESTINATION_TABLES {
  "D01" = "ENT_DI",
  "D02" = "ENT_MP",
  "D03" = "ENT_SG",
  "D04" = "ENT_ALM",
  "D05" = "ENT_MAT",
  "D07" = "ENT_OS",
}

export enum ORIGIN_BY_DESTINATION {
  "D01" = "ENT_DI_PRO",
  "D02" = "ENT_MP_PRO",
  "D03" = "ENT_SG_PRO",
  "D04" = "ENT_ALM_PRO",
  "D05" = "ENT_PRO",
  "D07" = "ENT_OS_PRO",
}

export enum DESTINATION_BY_CODE {
  "D01" = "DISTRIBUCIÓN",
  "D02" = "MATERIA PRIMA",
  "D03" = "SERVICIOS GENERALES",
  "D04" = "ALMACEN",
  "D05" = "MATERIALES",
  "D07" = "OTROS SERVICIOS",
}

export enum OPERATION_BY_DESTINATION {
  "D01" = "OO9",
  "D02" = "OO1",
  "D03" = "OO2",
  "D04" = "OO4",
  "D05" = "OO5",
  "D07" = "O10",
}

// Esto en realidad tendría que un booleano pero los enum no dejar poner tipo Boolean
export enum INVOICE_BY_CODE {
  "D01" = 0,
  "D02" = 1,
  "D03" = 1,
  "D04" = 1,
  "D05" = 0,
  "D07" = 0,
}

export enum ACTION {
  CARGA = 1,
  DESCARGA = 2,
  DEVOLUCION = 3,
  TICKET_DE_SALIDA = 4,
}

export const ACTION_BY_NAME = {
  "1": "CARGA",
  "2": "DESCARGA",
  "3": "DEVOLUCIÓN",
  "4": "TICKET_DE_SALIDA",
}

export enum STATUS {
  DISTRIBUTION = 1,
  ABOUT_TO_LEAVE = 2,
}
