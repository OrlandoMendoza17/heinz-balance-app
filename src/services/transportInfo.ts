import axios from "axios"
import { ModelTypesOptions } from "@/pages/api/models";
import base_url from ".";

export const getDriver = async (driverID: string, field: "CON_COD" | "CON_CED") => {
  const { data } = await axios.post<Driver>(`${base_url}/api/drivers`, { driverID, field })
  return data;
}

export const createDriver = async (driver: T_CON) => {
  const { data } = await axios.post<Vehicule>(`${base_url}/api/newDriver`, { driver })
  return data;
}

export const getVehicule = async (vehiculeID: string, field: "VEH_ID" | "VEH_PLA") => {
  const { data } = await axios.post<Vehicule>(`${base_url}/api/vehicules`, { vehiculeID, field })
  return data;
}

export const getTransports = async (name: T_TRA["TRA_NOM"]) =>{
  const { data } = await axios.post<Transport[]>(`${base_url}/api/transports`, { name })
  return data;
}

export const createVehicule = async (vehicule: Omit<T_VEH, "VEH_ID">, ORI_ID: number = 0) => {
  const { data } = await axios.post<Vehicule>(`${base_url}/api/newVehicule`, { vehicule, ORI_ID})
  return data;
}

export const getDriverFromVehicule = async (vehicule: Vehicule) => {
  const { data } = await axios.post<Driver>(`${base_url}/api/drivers-vehicules-relation`, { vehicule })
  return data;
}

export const getVehiculeModels = async () => {
  const { data } = await axios.post<ModelTypesOptions>(`${base_url}/api/models`)
  return data;
}