type Driver = {
  name: T_CON["CON_NOM"],
  cedula: T_CON["CON_CED"],
  code: T_CON["CON_COD"],
}

type NewDriverDto = Omit<Driver, "code">

type Vehicule = {
  id: T_VEH["VEH_ID"],
  plate: T_VEH["VEH_PLA"],
  model: T_VEH["VEH_MOD"],
  type: T_VEH["VEH_TIP"],
  capacity: T_VEH["VEH_CAP"],
  company: T_TRA["TRA_COD"],
}

type NewVehiculeDto = Omit<Vehicule, "id">

type Entry = {
  entryNumber: P_ENT["ENT_NUM"],
  entryDate: string,
  driver: Driver,
  vehicule: Vehicule,
  destination: T_DES["DES_COD"],
  operation: string,
  invoice: string | null,
  origin: string,
  truckWeight: number,
  grossWeight: number,
  netWeight: number,
  details: string,
  aboutToLeave: boolean,
}

type Exit = {
  entryNumber: P_ENT["ENT_NUM"],
  entryDate: string,
  driver: Driver,
  vehicule: Vehicule,
  action: ACTION, // Carga (1), Descarga (2), Devolución (3), Ticket de salida (4)
  destination: T_DES["DES_COD"],
  operation: string,
  invoice: string | null,
  origin: string,
  truckWeight: number,
  grossWeight: number,
  calculatedNetWeight: number,
  netWeight: number,
  details: string,
  weightDifference: number,
  aboutToLeave: boolean,
}

type Transport = {
  name: T_TRA["TRA_NOM"],
  RIF: T_TRA["TRA_RIF"],
  code: T_TRA["TRA_COD"],
}

type DistributionEntry = {
  entryNumber: P_ENT_DI["ENT_NUM"],
  entryDate: P_ENT["ENT_FEC"],
  driver: Driver,
  vehicule: Vehicule,
  origin: P_ENT_DI["ENT_DI_PRO"],
  truckWeight: P_ENT["ENT_PES_TAR"],
  entryDetails: P_ENT["ENT_OBS"],
  calculatedNetWeight: P_ENT_DI["ENT_DI_PNC"],
  aboutToLeave: boolean,
  chargeDestination: P_ENT_DI["ENT_DI_DES"],
  vehiculeStatus: P_ENT_DI["ENT_DI_STA"],
  distDetails: P_ENT_DI["ENT_DI_OBS"],
  palletsQuatity: P_ENT_DI["ENT_DI_CPA"],
  palletChargePlan: P_ENT_DI["ENT_DI_PAL"],
  guideNumber: P_ENT_DI["ENT_DI_GUI"],
  chargePlan: P_ENT_DI["ENT_DI_PLA"],
  dispatchNote: P_ENT_DI["ENT_DI_NDE"],
  palletWeight: P_ENT_DI["ENT_DI_PPA"],
  aditionalWeight: P_ENT_DI["ENT_DI_PAD"],
  aditionalWeightDescription: P_ENT_DI["ENT_DI_DPA"],
  exitAuthorization: P_ENT_DI["ENT_DI_AUT"],
}

type EntryDif = {
  entryDifferenceNumber: P_ENT_DIF["ENT_DIF_NUM"]; // id de la diferencia 
  entryNumber: P_ENT["ENT_NUM"];               // numero de la entrada 
  entryDifferenceDate: P_ENT_DIF["ENT_DIF_FEC"];   // Fecha en la que ocurre la diferencia 
  truckWeight: P_ENT["ENT_PES_TAR"];           // Tara- peso de entrada 
  calculatedNetWeight: P_ENT_DI["ENT_DI_PNC"];    // peso del plan de carga (verificar )
  aditionalWeight: P_ENT_DI["ENT_DI_PAD"];        // Peso adicional 
  palletWeight: P_ENT_DI["ENT_DI_PPA"];           // Peso de las paletas 
  grossWeight: P_SAL["SAL_PES_BRU"];           // Peso bruto de la salida 
  weightDifference: P_ENT_DIF["DIF_PES"];          // diferencia de peso 
}

type NewEntryDto = Omit<Entry, "entryNumber" | "entryDate" | "vehicule" | "driver" | "grossWeight" | "netWeight" | "destination"> & {
  destination: string;
}

type UpdateP_ENT = Omit<P_ENT, "ENT_NUM">

type ChargePlanInfo = {
  number: F4961["LLLDNM"],
  weight: F4961["LLSCWT"],
  destination: F4960["TMCTY1"],
}

type User = {
  nombre: string,
  email: string,
  ficha: string,
  // is_admin: boolean,
  // password_login_available: boolean,
}

type AuthCredentials = {
  user: User,
  token: string,
}