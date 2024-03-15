import { format } from "date-fns"
import { es } from "date-fns/locale"

export const TODAY = new Date()

export const shortDate = (date: string | number) => {
  //En caso que llegue undefined se retorna N/A

  if (date) {
    return format(new Date(date), "dd/MM/yyyy")
  }

  return 'N/A';
  // It turns this: '2020-10-14T19:29:31Z'
  // into this: '2020-10-14'
}

export const getCuteFullDate = (date: string) => {
  debugger
  console.log('date', date)
  return date ? format(new Date(date), "dd/MM/yyyy hh:mm:ss aaaa") : ""
}

export const getDateTime = (dateString?: string) => {
  const DATE = dateString ? new Date(dateString) : new Date()
  return format(new Date(DATE), "yyyy-MM-dd HH:mm:ss.SSS")
}

export const formatDateString = (date = TODAY): string => {
  return format(date, "yyyy-MM-dd")
}