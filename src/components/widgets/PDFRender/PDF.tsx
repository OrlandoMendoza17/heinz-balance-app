import React, { useEffect } from 'react'
import { Document, Text, Page, StyleSheet, View, PDFDownloadLink } from '@react-pdf/renderer'
import { getCuteFullDate } from '@/utils/parseDate'
import { PDFProps } from './types/PDFRendeType'

const utils = {
  flexGrow2: {
    left: {
      flexGrow: 1,
    },
    right: {
      flexGrow: 1,
    }
  },

  flexGrow3: {
    left: {
      flexGrow: 1,
    },
    middle: {
      flexGrow: 1,
    },
    right: {
      flexGrow: 1,
    }
  },
}

const classes = {
  header: StyleSheet.create({
    styles: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: "10px",
      borderBottom: "2px solid black",
      paddingBottom: "5px",
      marginBottom: "5px"
    },
    ...utils.flexGrow3
  }),

  dates: StyleSheet.create({
    styles: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: "20px",
      paddingBottom: "5px",
    },
    ...utils.flexGrow2
  }),

  weights: StyleSheet.create({
    styles: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: "20px"
    },
    ...utils.flexGrow3
  }),

  details: StyleSheet.create({
    styles: {
      display: "flex",
      flexDirection: "row",
    },
    text:{
      flexGrow: 1,
      display: "flex",
      gap: "5px"
    }
  }),

  signatures: StyleSheet.create({
    styles: {
      padding: "200px 100px 0px",
      display: "flex",
      flexDirection: "row",
      gap: "20px",
    },
    border: {
      borderTop: "1px solid black",
      paddingTop: "5px",
      display: "flex",
      justifyContent: "center",
      flexDirection: "row",
      flexGrow: 1,
    },
  })
}

const styles = StyleSheet.create({
  page: {
    // display: "flex",
    padding: "10px"
  },
  title: {
    fontSize: "14px",
    fontWeight: "extrabold"
  },
  container: {
    display: "flex",
    gap: "5px",
  },
  indent: {
    paddingLeft: "10px"
  },
  subtitle: {
    fontSize: "12px",
    fontWeight: "extrabold",
    paddingBottom: "5px",
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
  },
  text: {
    fontSize: "12px",
  },
  textCenter: {
    fontSize: "12px",
    textAlign: "center",
  },
  small: {
    paddingLeft: "10px",
    fontSize: "10px",
  },
})

const { header, dates, weights, details, signatures } = classes

const PDF = ({ exit }: PDFProps) => {

  const { entryNumber, vehicule, driver, entryDate, exitDate} = exit
  const { truckWeight, netWeight, grossWeight, entryDetails, exitDetails } = exit
  
  return (
    <Document>
      <Page>

        <View style={styles.page}>
          <View style={header.styles}>
            <View style={header.left}>
              <Text style={styles.text}>Alimentos Heinz C.A.</Text>
              <Text style={styles.small}>Planta San Joaquín</Text>
            </View>

            <View style={header.middle}>
              <Text style={styles.title}>Nota de Salida del Vehículo</Text>
            </View>

            <View style={header.right}>
              <Text style={styles.small}>Fecha:</Text>
              <Text style={styles.small}>Hora:</Text>
            </View>
          </View>

          <View>
            <Text style={styles.subtitle}>Datos de la Nota de Salida:</Text>
            <View style={styles.indent}>

              <View style={styles.container}>
                <View style={styles.listItem}>
                  <Text style={styles.text}>Código de Entrada:</Text>
                  <Text style={styles.text}>{entryNumber}</Text>
                </View>

                <View style={styles.listItem}>
                  <Text style={styles.text}>Placa:</Text>
                  <Text style={styles.text}>{vehicule.plate}</Text>
                </View>

                <View style={styles.listItem}>
                  <Text style={styles.text}>Transporte:</Text>
                  <Text style={styles.text}>{vehicule.company}</Text>
                </View>

                <View style={styles.listItem}>
                  <Text style={styles.text}>Cedula del Conductor:</Text>
                  <Text style={styles.text}>{driver.cedula}</Text>
                </View>

                <View style={styles.listItem}>
                  <Text style={styles.text}>Nombre del Conductor:</Text>
                  <Text style={styles.text}>{driver.name}</Text>
                </View>
              </View>

              <View>
                <View style={dates.styles}>
                  <Text style={{ ...styles.text, ...dates.left }}>Fecha de Entrada: {getCuteFullDate(entryDate)}</Text>
                  <Text style={{ ...styles.text, ...dates.right }}>Fecha de Salida: {getCuteFullDate(exitDate)}</Text>
                </View>

                <View style={weights.styles}>
                  <Text style={{ ...styles.text, ...weights.left }}>Peso de Entrada: {truckWeight}</Text>
                  <Text style={{ ...styles.text, ...weights.middle }}>Peso Neto: {netWeight}</Text>
                  <Text style={{ ...styles.text, ...weights.right }}>Peso de Salida: {grossWeight}</Text>
                </View>
              </View>

              <View style={details.styles}>
                <View style={details.text}>
                  <Text style={styles.text}>Observaciones de Entrada:</Text>
                  <Text style={styles.text}>{entryDetails}</Text>
                </View>
                <View style={details.text}>
                  <Text style={styles.text}>Observaciones de Salida:</Text>
                  <Text style={styles.text}>{exitDetails}</Text>
                </View>
              </View>

            </View>
            <View style={signatures.styles}>
              <View style={signatures.border}>
                <Text style={styles.textCenter}>Romana</Text>
              </View>
              <View style={signatures.border}>
                <Text style={styles.textCenter}>Chofer</Text>
              </View>
            </View>
          </View>
        </View>

      </Page>
    </Document>
  )
}

export default PDF;