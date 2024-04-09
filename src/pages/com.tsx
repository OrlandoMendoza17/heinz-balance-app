import React, { useEffect, useState } from 'react'
// import html2pdf from "html2pdf.js"
import Spinner from '@/components/widgets/Spinner'
import PDF from '@/components/widgets/PDF'
import { PDFDownloadLink, usePDF } from '@react-pdf/renderer'
import Button from '@/components/widgets/Button'
import PDFRender from '@/components/widgets/PDF'


const COMClient = () => {

  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)

  // const [instance, updateInstance] = usePDF({ document: PDF });

  const [rendered, setRendered] = useState<boolean>(false)

  // const createPDF = () => {

  //   console.log("Se empieza a crear");
  //   html2pdf()
  //     .set({
  //       margin: 0.5,
  //       filename: "history-points.pdf",
  //       image: {
  //         type: "jpeg",
  //         quality: 0.98,
  //       },
  //       html2canvas: {
  //         scale: 3,
  //         letterRendering: true,
  //       },
  //       jsPDF: {
  //         unit: "in",
  //         format: "letter",
  //         orientation: "portrait"
  //       }
  //     })
  //     .from(document.getElementById("invoice"))
  //     // .save()
  //     .output("dataurlnewwindow")
  //     .then(() => console.log("Guardado!!!"))
  //     .catch((error: any) => console.log(error))
  //     .finally(() => console.log("Finally!!!"))
  // }


  return (
    <div className="">
      <div id="invoice">
        <div className="bg-cyan-500 py-5 px-5">
          <span className="text-3xl font-bold block">Hola 👀</span>
        </div>
      </div>

      {/* {
        rendered &&
        <PDFRender />
      } */}

      <Button onClick={() => setRendered(true)} className="bg-secondary">
        Download Now
      </Button>

    </div>
  )
}

export const getStaticProps = async () => {
  return {
    props: {},
    // fallback: false || "blocking" || true
  }
}

export default COMClient


