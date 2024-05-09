import React, { SelectHTMLAttributes } from 'react';

export type SelectOptions = {
  name: string,
  value: string | number,
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  selectTitle?: string | JSX.Element,
  titleStyle?: string,
  className?: string,
  options: SelectOptions[],
  defaultOption: string,
  defaultFirst?: boolean,
  objectString?: boolean,
}

const Select = (props: Props) => {

  const { selectTitle = "", titleStyle = "", className = "", defaultFirst = false, options, name = "", defaultOption = "", required = true, defaultValue, objectString = false, ...rest } = props

  const selectsOptions = [...options]

  return (
    <label htmlFor={name} className={`Input ${className}`}>
      {
        selectTitle &&
        <span className={titleStyle}>
          {selectTitle}
        </span>
      }
      <select name={name} id={name} required={required} {...rest}>
        <option disabled className="bg-slate-200 text-slate-600 font-semibold">
          {defaultOption}
        </option>
        {
          selectsOptions.map(({ name, value }, index) => {
            const selected = objectString ? (defaultValue === (value as string).slice(12, 15)) : (defaultValue === value)
            return (
              <option selected={selected} value={value} key={`name-${index}`}>
                {name}
              </option>
            )
          })
        }
      </select>
    </label>
  );
};

export default Select;
