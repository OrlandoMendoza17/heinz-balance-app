export type TargetProps = EventTarget & HTMLElement

const getDataAttribute = (target: TargetProps, attribute: string): boolean => {
  const dataModal = (target.dataset[attribute] as (string | undefined))
  return (dataModal !== undefined) ? Boolean(JSON.parse(dataModal)) : false;
}

export default getDataAttribute;