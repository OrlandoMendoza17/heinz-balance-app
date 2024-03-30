import axios from "axios"
import { ModelTypesOptions } from "@/pages/api/models";

export const getDriver = async (driverPersonalID: string, field: "CON_COD" | "CON_CED") => {
  debugger
  const { data } = await axios.post<Driver>("/api/drivers", { driverPersonalID, field })
  return data;
}

export const createDriver = async (driver: T_CON) => {
  const { data } = await axios.post<Vehicule>("/api/newDriver", { driver })
  return data;
}

export const getVehicule = async (vehiculePlate: string) => {
  const { data } = await axios.post<Vehicule>("/api/vehicules", { vehiculePlate })
  return data;
}

export const createVehicule = async (vehicule: Omit<T_VEH, "VEH_ID">) => {
  const { data } = await axios.post<Vehicule>("/api/newVehicule", { vehicule })
  return data;
}

export const getDriverFromVehicule = async (vehiculeId: string) => {
  const { data } = await axios.post<Driver>("/api/drivers-vehicules-relation", { vehiculeId })
  return data;
}

export const getVehiculeModels = async () => {
  const { data } = await axios.post<ModelTypesOptions>("/api/models")
  return data;
}