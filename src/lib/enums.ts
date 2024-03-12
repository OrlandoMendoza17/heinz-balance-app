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

// Esto en realidad tendría que un booleano pero los enum no dejar poner tipo Boolean
export enum INVOICE_BY_CODE {
  "D01" = 0,
  "D02" = 1,
  "D03" = 1,
  "D04" = 1,
  "D05" = 0,
  "D07" = 0,
}