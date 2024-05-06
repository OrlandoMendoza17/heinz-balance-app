import React, { useEffect } from 'react'
import { PDFRenderType } from './types/PDFRendeType'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PDF from './PDF'

const PDFUrl = ({ url }: { url: string | null }) => {

  useEffect(() => {
    if (url)
      window.open(url, '_blank')
  }, [])

  return <></>
}

const PDFRender: PDFRenderType = ({ exit }) => {

  // useEffect(() => {
  //   console.log('props', props)
  // }, [props])

  return (
    exit &&
    <PDFDownloadLink document={<PDF {...{ exit }} />} fileName="invoice-heinz.pdf" style={{display: "none"}}>
      {
        ({ loading, url, error, blob }) =>
          loading ?
            "Loading..."
            :
            <PDFUrl url={url} />
      }
    </PDFDownloadLink>
  )
}

export default PDFRender