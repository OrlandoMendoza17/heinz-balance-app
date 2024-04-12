import React from "react"

export type PDFProps = {
  exit: Exit
}

export type PDFRenderType = ({ exit }: PDFProps) => React.JSX.Element