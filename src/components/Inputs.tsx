/* LIBRAIRIES */
import React from "react";
import { useFormContext } from "react-hook-form";
import { getNestedValue } from "@/utils/customLodash";

type InputProps = {
  name: string;
  type: string;
  checked?: boolean;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorsName?: string;
  defaultValue?: string | number ;
};

/**
 * Input Component
 * @param name: string
 * @param type: string
 * @param placeholder: string
 * @param label: string
 * @param className: string
 * @param onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
 * @param errorsName: string
 */
export const Input = ({
  name,
  type,
  disabled = false,
  placeholder,
  label,
  className,
  onChange,
  defaultValue,
  errorsName = name,
}: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext(); // Utiliser useFormContext pour accéder à register et errors

  const errorMessage = getNestedValue(errors, errorsName)?.message as string;

  return (
      <div className={`flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-2  ${className && className}`}>
        {label && (
          <label htmlFor={name} className="text-sm font-light opacity-70 min-w-28 md:text-right ">
            {label}
          </label>
        )}
        <div className="flex flex-col gap-0 w-full">
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(name)}
            onChange={onChange}
            className={` rounded-md border border-gray-300 bg-white py-2 px-2 md:px-6  text-base font-medium text-gray-700 outline-none transition-all duration-200 ${
              errorMessage
                ? "border-red-500 shadow-md shadow-red-500"
                : "focus:border-sky-500 focus:shadow-md focus:shadow-sky-500"
            } ${disabled ? "opacity-50" : ""}  ${type === "number" ? "max-w-40" : ""}`}
            aria-invalid={errorMessage ? "true" : "false"}
            disabled={disabled}
            defaultValue={defaultValue}
          />
          {errorMessage && (
            <span
              role="alert"
              className="text-red-500 text-sm min-h-3 text-center"
            >
              {errorMessage}
            </span>
          )}
        </div>
      </div>

  );
};

/*
 * SelectInput Component
 * @param name: string
 * @param options: { id: string; name: string }[]
 * @param label: string
 * @param className: string
 * @param errorsName: string
 */
export const SelectInput = ({
  name,
  options,
  label,
  className,
  errorsName = name,
  disabled = false,
}: {
  name: string;
  options: { id: string; name: string }[];
  label?: string;
  className?: string;
  errorsName?: string;
  disabled?: boolean;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getNestedValue(errors, errorsName)?.message as string;

  return (
      <div className={`flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-2  ${className && className}`}>
        {label && (
          <label htmlFor={name} className="font-light text-sm opacity-70">
            {label}
          </label>
        )}
        <div className="flex flex-col gap-0 w-full">
          <select
            id={name}
            {...register(name)}
            className={`border border-none rounded-md p-1 dark:text-black focus-visible:outline-none
        ${
          errorMessage
            ? "border-red-500 shadow-md shadow-red-500"
            : "focus:border-sky-500 focus:shadow-md focus:shadow-sky-500"
        } ${disabled ? "bg-gray-100" : ""}`}
          disabled={disabled}
          >
            <option value="">Sélectionnez une option</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {errorMessage && (
            <span
              role="alert"
              className="text-red-500 text-sm min-h-3 text-center"
            >
              {errorMessage}
            </span>
          )}
        </div>
      </div>
  );
};

/*
 * CheckboxInput Component
 * @param name: string
 * @param value: string
 * @param label: string
 * @param checked: boolean
 * @param onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
 * @param className: string
 * @param errorsName: string
 */
export const CheckboxInput = ({
  name,
  value,
  label,
  className,
  errorsName = name,
  checked,
  onChange,
}: {
  name: string;
  value?: string;
  label?: string;
  className?: string;
  errorsName?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getNestedValue(errors, errorsName)?.message as string;

  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={name}
        type="checkbox"
        value={value}
        {...register(name)}
        checked={checked}
        onChange={onChange}
        className={`mr-2 ${
          errorMessage
            ? "border-red-500 shadow-md shadow-red-500"
            : "focus:border-sky-500 focus:shadow-md focus:shadow-sky-500"
        }`}
        aria-invalid={errorMessage ? "true" : "false"}
      />
      {label && (
        <label htmlFor={name} className="text-sm font-light opacity-70">
          {label}
        </label>
      )}
      {errorMessage && (
        <span role="alert" className="text-red-500 text-sm min-h-3 text-center">
          {errorMessage}
        </span>
      )}
    </div>
  );
};




export const SimpleCheckboxInput = ({
  name,
  value,
  label,
  className,
  errorsName = name,
}: {
  name: string;
  value?: string;
  label?: string;
  className?: string;
  errorsName?: string;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getNestedValue(errors, errorsName)?.message as string;

  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={name}
        type="checkbox"
        value={value}
        {...register(name)}
        className={`mr-2 ${
          errorMessage
            ? "border-red-500 shadow-md shadow-red-500"
            : "focus:border-sky-500 focus:shadow-md focus:shadow-sky-500"
        }`}
        aria-invalid={errorMessage ? "true" : "false"}
      />
      {label && (
        <label htmlFor={name} className="text-sm font-light opacity-70">
          {label}
        </label>
      )}
      {errorMessage && (
        <span role="alert" className="text-red-500 text-sm min-h-3 text-center">
          {errorMessage}
        </span>
      )}
    </div>
  );
};



export const Textarea = ({
  name,
  label,
  className,
  placeholder,
  errorsName = name,
  rows = 3,
  cols = 30,
}: {
  name: string;
  label?: string;
  className?: string;
  placeholder?: string;
  errorsName?: string; 
  rows?: number;
  cols?: number;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getNestedValue(errors, errorsName)?.message as string;

  return (
      <div className={`flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-2 w-full ${className && className}`}>
        {label && (
          <label htmlFor={name} className="text-sm font-light opacity-70 min-w-28">
            {label}
          </label>
        )}

          <textarea
            id={name}
            placeholder={placeholder}
            {...register(name)}
            className={`min-w-60 w-full rounded-md border border-gray-300 bg-white py-2 px-2 md:px-6  text-base font-medium text-gray-700 outline-none transition-all duration-200 ${
              errorMessage
                ? "border-red-500 shadow-md shadow-red-500"
                : "focus:border-sky-500 focus:shadow-md focus:shadow-sky-500"
            }`}
            aria-invalid={errorMessage ? "true" : "false"}
            rows={rows}
            cols={cols}
          />

        {errorMessage && (
        <span role="alert" className="text-red-500 text-sm min-h-3 text-center">
          {errorMessage}
        </span>
      )}
      </div>

  );
};
