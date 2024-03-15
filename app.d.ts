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
  grossWeight: number | null,
  netWeight: number | null,
  details: string,
  aboutToLeave: boolean,
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