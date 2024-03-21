import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Spinner from '@/components/widgets/Spinner'

const COMClient = () => {
  
  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  
  useEffect(() => {
    (async ()=>{
      try {
        
        const data = await axios.get("/api/com")
        setData(data)
        
        console.log('data', data)
        setLoading(false)
        
      } catch (error) {
        console.log(error)        
      }
    })()
  }, [])
  
  return (
    <div className="h-screen flex items-center justify-center">
      {
        !loading ?
        <span>Valor: {data}</span>
        :
        <Spinner size="normal"/>
      }
    </div>
  )
}

export default COMClient