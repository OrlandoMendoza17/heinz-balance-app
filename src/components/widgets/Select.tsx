import React, { SelectHTMLAttributes } from 'react';

export type SelectOptions = {
  name: string,
  value: string | number,
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  title?: string,
  titleStyle?: string,
  className?: string,
  options: SelectOptions[],
  defaultOption: string,
}

const Select = (props: Props) => {

  const { title = "", titleStyle = "", className = "", options, name = "", defaultOption = "", required = true, ...rest } = props

  const selectsOptions = [...options]

  return (
    <label htmlFor={name} className={`Input ${className}`}>
      {
        title &&
        <span className={titleStyle}>
          {title}
        </span>
      }
      <select name={name} id={name} required={required} {...rest}>
        <option disabled className="bg-slate-200 text-slate-600 font-semibold">
          {defaultOption}
        </option>
        {
          selectsOptions.map(({ name, value }, i) =>
            <option value={value} key={`name-${i}`}>
              {name}
            </option>
          )
        }
      </select>
    </label>
  );
};

export default Select;
