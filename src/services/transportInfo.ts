import axios from "axios"

export const getDriver = async (driverPersonalID: string) => {
  debugger
  const { data } = await axios.post<Driver>("/api/drivers", { driverPersonalID })
  return data;
}

export const getVehicule = async (vehiculePlate: string) => {
  const { data } = await axios.post<Vehicule>("/api/vehicules", { vehiculePlate })
  return data;
}