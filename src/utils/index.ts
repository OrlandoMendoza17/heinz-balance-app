export const getTransports = () => {
  const getPlate = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
    const getLetter = () => letters[Math.floor(Math.random() * letters.length)]
    const getNumber = () => Math.ceil(Math.random() * 100)

    const plate = `${getLetter()}${getNumber()}${getLetter()}${getNumber()}${getLetter()}`
    return plate;
  }

  const getDestination = () => {
    const destinationList = [
      "DISTIBRUCIÓN",
      "MATERIA PRIMA",
      "SERVICIOS GENERALES",
      "ALMACÉN",
      "MATERIALES",
      "OTROS SERVICIOS",
    ]
    return destinationList[Math.floor(Math.random() * destinationList.length)]
  }

  const transports: Transport[] = [
    {
      driver: {
        cedula: '27313279',
        name: 'Orlando Mendoza',
        code: '012313',
      },
      truckPlate: 'Z59Z75Y',
      destination: 'DISTIBRUCIÓN',
      entryDate: '2024-02-29',
    },
    {
      driver: {
        cedula: '27313279',
        name: 'Yamileth Mujica',
        code: '012313',
      },
      truckPlate: 'Q3N33G',
      destination: 'ALMACÉN',
      entryDate: '2024-02-29',
    },
    {
      driver: {
        cedula: '27313279',
        name: 'Eduardo Leon',
        code: '012313',
      },
      truckPlate: 'U30M7A',
      destination: 'OTROS SERVICIOS',
      entryDate: '2024-02-29',
    },
    {
      driver: {
        cedula: '27313279',
        name: 'Mariangel Nuñez',
        code: '012313',
      },
      truckPlate: 'V100Z94T',
      destination: 'MATERIALES',
      entryDate: '2024-02-29',
    },
    {
      driver: {
        cedula: '27313279',
        name: 'Juan Mendez',
        code: '012313',
      },
      truckPlate: 'U98L54D',
      destination: 'MATERIALES',
      entryDate: '2024-02-29',
    },
  ]

  return transports;
}