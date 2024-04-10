const readWeightFromBalance = async () => {

  // Solicita permiso al usuario para acceder a los puertos COM.

  // const port = await navigator.serial.requestPort();

  // Enumera los puertos COM disponibles.

  const ports = await navigator.serial.getPorts();

  const port = ports[0]

  // Si no se encuentra ningún puerto COM, muestra un mensaje de error.

  if (!ports.length) {
    console.error('No se encontraron puertos COM disponibles.');
    return;
  }

  // Abre el puerto COM que deseas usar.

  await port.open({ baudRate: 9600 });

  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  // Crea un lector para el puerto COM.

  // const reader = port.readable.getReader();

  // Lee datos del puerto COM en un bucle.

  const array = []

  for (let index = 1; index <= 20; index++) {

    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    // Convierte los datos leídos en una cadena.

    // const data = new TextDecoder().decode(value);

    // Muestra los datos leídos en la consola.

    array.push(value)
    // console.log(value);
  }

  const values = [...new Set(array.filter((item) => {
    const number = parseInt(item)

    return number >= 0

  }).map((item) => parseInt(item)))];

  let largestNumber = 0

  values.forEach(number => {
    largestNumber = (number > largestNumber) ? number : largestNumber
  })

  // reader.releaseLock()

  const textEncoder = new TextEncoderStream();
  const writer = textEncoder.writable.getWriter();
  const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

  reader.cancel();

  await readableStreamClosed.catch(() => { /* Ignore the error */ });

  writer.close();

  await writableStreamClosed;

  // Cierra el puerto COM.

  await port.close();

  // console.log("Se cerró el puerto")
  console.log("Peso: ", largestNumber)

  return largestNumber;
};

export default readWeightFromBalance;