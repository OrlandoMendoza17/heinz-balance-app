type Action = 1 | 2 | 3 | 4 // Carga (1), Descarga (2), Devolución (3), Ticket de salida (4)
type DES_COD = "D01" | "D02" | "D03" | "D04" | "D05" | "D07"
type PROCEDENCE = "ENT_DI_PRO" | "ENT_MP_PRO" | "ENT_SG_PRO" | "ENT_ALM_PRO" | "ENT_PRO" | "ENT_OS_PRO"

// H025_P_ENT -> Entrada
type P_ENT = {
  ENT_NUM: string;            // Numero de Entrada
  ENT_FEC: string;            // Fecha de Entrada
  USU_LOG: string;            // Usuario
  VEH_ID: string;             // Esto viene de los conductores
  CON_COD: string;            // Codigo de conductor
  DES_COD: DES_COD;           // Código de destino dentro de planta
  OPE_COD: string;            // Código de operación dentro de planta
  ENT_PES_TAR: number;        // Peso de entrada de la TARA
  EMP_ID: null;               // Todos los valores vacios- Posible relacion con el empleado encargado de verificar la entrada y la salida
  ENT_OBS: string | null;     // Observaciones
  ENT_FLW: 1 | 2;             // 1 = No está listo para salir (SOLO DISTRIBUCIÓN) | 2 = Por salir
  ENT_FEC_COL: string | null; // Preguntarle a yamileth - Posible hora de llegada a la romana 
  ENT_FLW_ACC: ACTION;        // Carga (1), Descarga (2), Devolución (3), Ticket de salida (4)
}

// H025_P_ENT_DI -> Entrada a Distribución
type P_ENT_DI = {
  ENT_NUM: string;            // Numero de Entrada
  USU_LOG: string;            // Usuario
  ENT_DI_FEC: string;         // Fecha de entrada a distribución
  ENT_DI_PRO: string;         // Procedencia
  ENT_DI_GUI: string | null;  // Plan de carga | NULL
  ENT_DI_PLA: string | null;  // Plan de carga | NULL
  ENT_DI_NDE: string | null;  // Plan de carga | NULL
  ENT_DI_PAL: string | null;  // Plan de carga con paletas (si colocan cantidad de paletas deja de ser null) | NULL
  ENT_DI_PNC: number | null;  // Peso neto calculado
  ENT_DI_CPA: number;         // Cantidad de Paletas
  ENT_DI_PPA: number | null;  // Peso de la paleta (30 | 0)
  ENT_DI_DES: string | null;  // Destino
  ENT_DI_PAD: number;         // Siempre es 0 -- Peso adicional corregido 
  ENT_DI_DPA: string | null;  // Descripciones -> Se pone en distribución preguntar a yamileth de donde salen ❓
  ENT_DI_STA: 1 | null;       // status de vehiculo 
  ENT_DI_AUT: string | null;  // Esta relacionado a ENT_DI_PAL-> aunque no en todos los casos son iguales  
  ENT_DI_OBS: string | null;  // Observaciones
  ENT_DI_REV: boolean;        // Aparentemente siempre es 0, volver a revisar-> siempre es 0
}

// H025_P_ENT_DI -> Entrada a Almacén no esta en el diagrama de flujo posible desuso 
type P_ENT_ALM = {
  ENT_NUM: string;     // Numero de Entrada
  ENT_ALM_PRO: string; // Procedencia
  ENT_ALM_FAC: string | null; // Preguntar en balanza ❓ -Datos muy aleatorios es un input (numeros descripciones)
}

// H025_P_ENT_DIF -> Diferencia de Peso
type P_ENT_DIF = {
  ENT_DIF_NUM: string;                 // id de la diferencia 
  ENT_NUM: P_ENT["ENT_NUM"];           // numero de la entrada 
  ENT_DIF_FEC: string;                 // Fecha en la que ocurre la diferencia 
  ENT_PES_TAR: P_ENT["ENT_PES_TAR"];   // Tara- peso de entrada 
  ENT_DI_PNC: P_ENT_DI["ENT_DI_PNC"];  // peso del plan de carga (verificar )
  ENT_DI_PAD: P_ENT_DI["ENT_DI_PAD"];  // Peso adicional 
  ENT_DI_PPA: P_ENT_DI["ENT_DI_PPA"];  // Peso de las paletas 
  SAL_PES_BRU: P_SAL["SAL_PES_BRU"];   // Peso bruto de la salida 
  DIF_PES: number;                     // diferencia de peso 
  USU_LOG: string;                     // Usuario que la registro
}

// H025_P_ENT_MAT -> Entrada a Materiales
type P_ENT_MAT = {
  ENT_NUM: string; // Numero de entrada
  ENT_PRO: string; // Lugar de procedencia 
  OPE_COD: string; // Codigo de la operacion materiales 
  MAT_COD: string | null; // Codigo de material
}

// H025_P_ENT_MP -> Entrada a Materia Prima
type P_ENT_MP = {
  ENT_NUM: string;            // Numero de entrada
  ENT_MP_PRO: string;         // lugar de procedencia 
  ENT_MP_FAC: string | null;  // Facturas Externas 
  ENT_MP_NOT: null;           // Posible espacio para notas -> Completamente en desuso ❌
  ENT_MP_PAL: null;           // -> Completamente en desuso ❌
}

// H025_P_ENT_OS -> Entrada a Otros Servicios
type P_ENT_OS = {
  ENT_NUM: string;            // Numero de entrada
  ENT_OS_PRO: string;         // Lugar de procedencia
  ENT_OS_AUT: null | string;  // Autorización - input del usuario(null cuando se da la entrada, el valor se pone o no en la salida)
}

// H025_P_ENT_SG -> Entrada a Servicios Generales
type P_ENT_SG = {
  ENT_NUM: string;           // Numero de entrada
  ENT_SG_PRO: string;        // Lugar de procedencia 
  ENT_SG_FAC: null | string; // Facturas -> con algunas incoherencias problemas de input
  ENT_SG_NOT: null;          // Posible notas -input de usuario -> Completamente en desuso ❌
  ENT_SG_AUT: null;          // Posible observaciones  - input de usuario -> Completamente en desuso ❌
  ENT_SG_NDE: null;          // Nota De Entrada ❓ -> Completamente en desuso ❌
}

// H025_P_SAL -> Salida de planta
type P_SAL = {
  ENT_NUM: string;            // Numero de entrada
  USU_LOG: string;            // Usuario que registra la salida 
  SAL_FEC: string;            // Fecha de salida 
  ENT_PES_TAR: number;        // Peso de entrada en la tara
  ENT_PES_NET: number;        // Peso neto  (peso bruto - peso de la tara)
  SAL_PES_BRU: number;        // Peso bruto en la salida
  DEN_COD: null;              // Codigo de densidad 
  SAL_DEN_LIT: number | null; // Relacionado a los liquidos , vinagre  o alcohol 
  SAL_OBS: string | null;     // Observaciones - nota de texto
}

// H025_T_CON -> Conductores
type T_CON = {
  CON_COD: string; // Código de conductor
  CON_CED: string; // Cédula de conductor
  CON_NOM: string; // Nombre de conductor
  ORI_ID: number;  // Origen del dato jde o balanzas
}

// H025_T_CON_VEH -> Tiene que ver con los Conductores 
type T_CON_VEH = {
  CON_COD: string; // Código de conductor
  VEH_ID: string;  // ID de Vehículo
}


/**
 * The type `T_DEN` H025_T_DEN -> Tabla de densidad del alcohol y vinagre
 * @property {string} DEN_COD La propiedad `DEN_COD` representa el Codigo de densidad.
 * @property {string} DEN_DES La propiedad `DEN_DES` representa el Nombre del liquido.
 * @property {number} DEN_DEN La propiedad `DEN_DEN` representa el Numero de la densidad Densidad. 
 */
type T_DEN = {
  DEN_COD: string;  
  DEN_DES: string; 
  DEN_DEN: number; 
}

// H025_T_DES -> Destino dentro de Planta
/**
 * El tipo T_DES representa un código de destino y una descripción dentro de una planta.
 * @property {DES_COD} DES_COD - DES_COD es una propiedad que representa el código del destino
 * dentro de la planta. Se utiliza para identificar de forma única diferentes destinos dentro de la planta.
 * @property {string} DES_DES - La propiedad `DES_DES` en el tipo `T_DES` representa la descripción
 * del destino dentro de la planta. 
 **/
type T_DES = {
  DES_COD: DES_COD;  // Código de Destino dentro de planta
  DES_DES: string;  // Descripción de Destino dentro de planta
}

// H025_T_EMP -> Empleados dentro de la planta 
type T_EMP = {
  EMP_ID: number;  // ID
  EMP_CED: string; // Cedula o ficha del empleado
  EMP_NOM: string; // Nombre del empleado
}

// H025_T_F0101 -> Registro general de personas
type T_F0101 = {
  ABAN8: number;  // ficha o codigo 
  ABTAXC: string; // only gods know  ❓ // Valores posibles J, V, 6, 7, E, G, P
  ABALKY: string; // cedula o ficha 
  ABALPH: string; // Nombre
  ABAT1: string;  // only gods know ❓ // Valores posibles H, Y, E - Hay otros en produccion 
}

// H025_T_F49041 Relacion entre el codigo del conductor y la placa del vehiculo que maneja
type T_F49041 = {
  VSSTFN: number; // Codigo de conductor
  VSVEHI: string; // Placa 
}

// H025_T_F4930 Datos del vehiculo 
type T_F4930 = {
  VMVEHI: string; // Placas de vehiculos
  VMDL01: string; // Modelo del vehiculo
  VMVTYP: string; // Tipo del vehiculo 
  VMVOWN: number; // Codigo del trasporte 
  VMWTCA: number; // Capacidad de carga del vehiculo 
  VMWTUM: string; // Unidad de medida KG
}


/**
 * El tipo T_MAT representa materiales con propiedades MAT_COD para código de material y MAT_DES para
 * Descripción del material.
 * @property {string} MAT_COD - MAT_COD es una propiedad del tipo T_MAT que representa el código de un
 * material. Es un tipo de cadena.
 * @property {string} MAT_DES - MAT_DES es una propiedad del tipo T_MAT que representa la descripción
 * de materiales. Es un tipo de cadena que proporciona una breve explicación o nombre del material.
 * especificado por MAT_COD.
 */
type T_MAT = {
  MAT_COD: string; // Código de Materiales
  MAT_DES: string; // Descripción de Materiales
}

// H025_T_OPE -> Operación dentro de Planta
/**
 * El tipo `T_OPE` define propiedades relacionadas con la operación de una planta, incluido el código de operación,
 * descripción, estado de autorización, estado de notificación, estado de palet y código de destino.
 * @property {string} OPE_COD - La propiedad `OPE_COD` representa el código de operación dentro de la planta.
 * Es de tipo cadena.
 * @property {string} OPE_DES - La propiedad `OPE_DES` representa la descripción de una operación
 *dentro de una planta. Es un tipo de cadena que proporciona una breve explicación o nombre de la operación.
 * en ejecución.
 * @property {boolean} OPE_AUT: No se usa actualmente.
 * @property {boolean} OPE_NOT No se usa actualmente. 
 * @property {boolean} OPE_PAL: No se usa actualmente.
 * @property {DES_COD} DES_COD - DES_COD es una propiedad que representa el código del destino
 * dentro de la planta.
 */
type T_OPE = {
  OPE_COD: string;  // Código de Operación dentro de planta
  OPE_DES: string;  // Descripción de Operación dentro de planta
  OPE_AUT: boolean;
  OPE_NOT: boolean;
  OPE_PAL: boolean;
  DES_COD: DES_COD;  // Código de Destino dentro de planta
}

// Relacion entre las operaciones y los materiales 
type T_OPE_MAT = {
  OPE_COD: string; // Codigo de la operacion 
  MAT_COD: string; // Codigo del material 
}

// Origen de la informacion - De que app viene 
type T_ORI = {
  ORI_ID: number; // Id de la descripcion 
  ORI_DES: string; // Descripcion de donde viene 
}

// H025_T_PRO Tabla vacia 

// H025_T_PROD Tabla vacia 


// H025_T_TRA Tabla de los trasportes 
type T_TRA = {
  TRA_COD: string; // Codigo del trasporte 
  TRA_RIF: string; // Rif del trasporte 
  TRA_NOM: string; // Nombre del trasporte 
  ORI_ID: number;  // Origen de la informacion 
}


/**
  * El tipo T_VEH define propiedades para un vehículo incluyendo ID, placa, modelo, tipo, capacidad,
  * código de transporte y origen.
  * @property {string} VEH_ID - La propiedad `VEH_ID` en el tipo `T_VEH` representa el ID del
  * vehículo. Es un campo de tipo cadena que se utiliza para identificar de forma única cada vehículo en el sistema.
  * @property {string} VEH_PLA - La propiedad `VEH_PLA` representa la placa del vehículo.
  * @property {string} VEH_MOD - La propiedad `VEH_MOD` en el tipo `T_VEH` representa el modelo del
  * vehículo. Es un tipo de cadena que contiene información sobre el modelo del vehículo.
  * @property {string} VEH_TIP: la propiedad `VEH_TIP` representa el tipo de vehículo. 
  * @property {número} VEH_CAP - La propiedad `VEH_CAP` en el tipo `T_VEH` representa la capacidad de
  * el vehículo. Es una propiedad de tipo numérico que indica cuánto peso el vehículo puede transportar.
  * @property {string} TRA_COD - La propiedad `TRA_COD` representa el código del transporte al que el vehículo pertenece.
  * @property {number} ORI_ID - La propiedad `ORI_ID` en el tipo `T_VEH` representa el origen del
  * vehículo. 0-Balanzas 1-JDE.
  */
type T_VEH = {
  VEH_ID: string;  // Id del vehiculo 
  VEH_PLA: string; // Placa del vehiculo
  VEH_MOD: string; // Modelo del vehiculo 
  VEH_TIP: string; // Tipo del vehiculo 
  VEH_CAP: number; // Capacidad del vehiculo 
  TRA_COD: string; // Codigo del trasporte al que pertenece 
  ORI_ID: number;  // Origen del vehiculo 
}

// Modulos de la app
type S_MOD = {
  MOD_COD: string; //CN01-CN07        PR01-PR03      SG01-SG03
  MOD_DES: string; //Destinos en fase 
  MOD_MEN: string; //Configuracion    Procesos       Seguridad  
}
// Roles de cada usuario 
type S_ROL = {
  ROL_COD: string; //01-04
  ROL_DES: string; //Administrador, Supervisor de balanza, Usuario de balanza, usuario de vigilancia
}
// Relacion entre los modulos y los roles 
type S_ROL_MOD = {
  ROL_COD: string; // Relacion entre rol y mod
  ROL_DES: string;
}
// Tabla de usuarios 
/**
 * Tipo que representa un usuario del sistema.
 * 
 * @property {string} USU_LOG - Nombre de usuario para iniciar sesión.
 * @property {null | string} USU_CLA - Clave de usuario.
 * @property {null | number  } USU_FIC - Ficha del trabajador.
 * @property {null | string} USU_CED - Cédula del usuario (algunos tienen su ficha repetida).
 * @property {null | string} USU_NOM - Nombre del usuario.
 * @property {null | boolean} USU_STA - Estado del usuario (siempre es true, indica que el usuario está activo).
 * @property {null | string} ROL_COD - Código del rol del usuario (llave foránea).
 * @property {null | string} USU_MAI - Correo electrónico del usuario.
 */
type S_USU = {
  USU_LOG: string;         // Nombre de usuario para iniciar sesion 
  USU_CLA: null | string;  // Clave de usuario 
  USU_FIC: null | number ;  // Ficha del trabajador 
  USU_CED: null | string;  // Cedula aunque algunos tienen su ficha repetida 
  USU_NOM: null | string;  // Nombre del usuario 
  USU_STA: null | boolean; // Siempre es uno -> status de usuario activo
  ROL_COD: null | string;  // Llave foranea del codigo del rol 
  USU_MAI: null | string;  // Correo del usuario 
}

// Plan de carga y su peso asignado
type F4961 = {
  LLLDNM: number, // Plan de carga
  LLSCWT: number, // Peso
}

// Plan de carga y su destino asignado
type F4960 = {
  TMLDNM: number, // Plan de carga
  TMCTY1: string, // Destino
}

type JDEDriver = {
  ABALKY: string; // Driver Personal ID
  ABALPH: string; // Driver name
  ABAN8: number;  // Driver Code
  ABTAXC: string;
  ABAT1: string;
}