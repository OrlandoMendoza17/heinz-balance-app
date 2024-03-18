type Driver =  {
  name: T_CON["CON_NOM"],
  cedula: T_CON["CON_CED"],
  code: T_CON["CON_COD"],
}

type Vehicule = {
  id: T_VEH["VEH_ID"],
  plate: T_VEH["VEH_PLA"],
  model: T_VEH["VEH_MOD"],
  type: T_VEH["VEH_TIP"],
  capacity: T_VEH["VEH_CAP"],
  company: T_TRA["TRA_COD"],
}

type Entry = {
  entryNumber: T_ENT["ENT_NUM"],
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

type NewEntryDto = Omit<Entry, "entryNumber" | "entryDate" | "vehicule" | "driver" | "grossWeight" | "netWeight" | "destination"> & {
  destination: string;
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