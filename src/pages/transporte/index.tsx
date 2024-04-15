import Button from '@/components/widgets/Button';
import Form from '@/components/widgets/Form';
import DistribucionHeader from '@/components/widgets/Header/DistribucionHeader';
import Input from '@/components/widgets/Input';
import useNotification from '@/hooks/useNotification';
import { getDriver, getDriverFromVehicule, getVehicule } from '@/services/transportInfo';
import getErrorMessage from '@/utils/services/errorMessages';
import { AxiosError } from 'axios';
import React, { ChangeEventHandler, FormEventHandler, useState } from 'react';

const Transport = () => {

  const [alert, handleAlert] = useNotification()
  const [loading, setLoading] = useState<boolean>(false);

  const [searched, setSearched] = useState<boolean>(false)

  const [vehicule, setVehicule] = useState<Vehicule>()
  const [driver, setDriver] = useState<Driver>()

  const [coincidence, setCoincidence] = useState<boolean>(false)

  const [state, setState] = useState({
    plate: "",
    cedula: "",
  });

  const catchError = async (callback: () => Promise<void>) => {
    try {

      await callback()

    } catch (error) {
      setLoading(false)
      console.log(error)

      let message = "Ha habido un error en la consulta"

      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message
        message = getErrorMessage(errorMessage)
      }

      handleAlert.open(({
        type: "danger",
        title: "Error ❌",
        message,
      }))
    }
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    catchError(async () => {
      setLoading(true)
      setSearched(false)

      let vehicule: Vehicule | undefined = undefined;
      let driver: Driver | undefined = undefined;

      let driverThatMatchesVehicule: Driver | undefined = undefined

      await catchError(async () => {
        vehicule = await getVehicule(plate);
      })

      await catchError(async () => {
        driver = await getDriver(cedula, "CON_CED")
      })

      // Busca un conductor a partir del vehículo si lo encuentra
      await catchError(async () => {
        if (vehicule) {
          driverThatMatchesVehicule = await getDriverFromVehicule(vehicule.id);
          debugger
        }
      })

      debugger

      // Si encontró a los dos es porque sí hay coincidencia entre ambos
      if (vehicule && driver && driverThatMatchesVehicule) {
        // Si el conductor que se encontró es el mismo que se buscaba inicialmente
        setCoincidence((driver as Driver).cedula === (driverThatMatchesVehicule as Driver).cedula)
      } else {
        setCoincidence(false)
      }

      setVehicule(vehicule)
      setDriver(driver)

      setLoading(false)
      setSearched(true)
    })
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setState({
      ...state,
      [target.name]: target.value
    });
  };

  const { cedula, plate } = state;

  return (
    <>
      <DistribucionHeader />
      <main className="p-10">
        <h1 className="text-2xl font-bold pb-20">Busqueda coincidencia de Transporte</h1>
        <div className="flex flex-col items-start gap-5">
          <Form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-5 justify-center"
          >
            <Input
              id="plate"
              value={plate}
              className="w-full"
              title="Placa de Vehículo"
              placeholder=""
              onChange={handleChange} />
            <Input
              id="cedula"
              value={cedula}
              className="w-full"
              title="Cédula de conductor"
              placeholder=""
              onChange={handleChange} />
            <Button type="submit" loading={loading} className="bg-secondary col-span-2">
              Buscar coincidencia
            </Button>
          </Form>
          {
            searched &&
            <>
              {
                vehicule &&
                <section>
                  <h2 className="font-semibold">
                    Vehículo:
                  </h2>
                  <ul>
                    <li>
                      Placa: {vehicule.plate}
                    </li>
                    <li>
                      Modelo: {vehicule.model}
                    </li>
                    <li>
                      Tipo: {vehicule.type}
                    </li>
                    <li>
                      Capacidad: {vehicule.capacity}
                    </li>
                  </ul>
                </section>
              }
              {
                driver &&
                <section>
                  <h2 className="font-semibold">
                    Conductor:
                  </h2>
                  <ul>
                    <li>
                      Nombre: {driver.name}
                    </li>
                    <li>
                      Cedula: {driver.cedula}
                    </li>
                  </ul>
                </section>
              }
              {
                coincidence ?
                  <section className="rounded-xl p-5 bg-green-500">
                    Sí existe coincidencia entre conductor y vehículo
                  </section>
                  :
                  <section className="rounded-xl p-5 bg-slate-500">
                    No existe coincidencia entre conductor y vehículo
                  </section>
              }
            </>
          }
        </div>
      </main >
    </>
  );
};

export default Transport