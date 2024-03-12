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

  return {};
}