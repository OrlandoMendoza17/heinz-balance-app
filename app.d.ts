type Driver =  {
  name: T_CON["CON_NOM"];
  cedula: T_CON["CON_CED"];
  code: T_CON["CON_COD"],
}

type Vehicule = {
  plate: T_VEH["VEH_PLA"];
  model: T_VEH["VEH_MOD"];
  type: T_VEH["VEH_TIP"];
  capacity: T_VEH["VEH_CAP"];
  company: T_TRA["TRA_COD"];
}

type Entry = {
  entryNumber: T_ENT["ENT_NUM"],
  driver: Driver;
  vehicule: Vehicule,
  destination: T_DES["DES_COD"];
  entryDate: string;
  origin: string,
  truckWeight: number,
  grossWeight: number,
  netWeight: number,
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