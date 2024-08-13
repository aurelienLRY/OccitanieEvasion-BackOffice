import React from 'react';
import { useFormContext } from 'react-hook-form';

type InputProps = {
  name: string;
  type: string;
  placeholder?: string;
  label?: string;
  className?: string;
};

export const Input = ({ name, type, placeholder, label, className }: InputProps) => {
  const { register, formState: { errors } } = useFormContext(); // Utiliser useFormContext pour accéder à register et errors

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <label htmlFor={name} className="text-sm font-light opacity-70 ">{label}</label>}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={` rounded-md border border-gray-300 bg-white py-2 px-6 text-base font-medium text-gray-700 outline-none transition-all duration-200 ${
          errors[name] ? 'border-red-500 shadow-md shadow-red-500' : 'focus:border-emerald-600 focus:shadow-md focus:shadow-emerald-600'
        }`}
        aria-invalid={errors[name] ? 'true' : 'false'}
      />
      {errors[name] && <span role="alert" className="text-red-500 text-sm min-h-3">
        {errors[name]?.message || 'Erreur de validation'}
      </span>}
    </div>
  );
};

export const SelectInput = ({ name, options, label, className }: { name: string; options: { id: string; name: string }[]; label?: string; className?: string }) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <label htmlFor={name} className="font-light text-sm opacity-70">{label}</label>}
      <select
        id={name}
        {...register(name)}
        className={`border border-none rounded-md p-1 dark:text-black focus-visible:outline-none
        ${
          errors[name]
            ? "border-red-500 shadow-md shadow-red-500"
            : "focus:border-emerald-600 focus:shadow-md focus:shadow-emerald-600"
        }`}
      >
        <option value="">Sélectionnez une option</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {errors[name] && <span role="alert" className="text-red-500 text-sm min-h-3">
        {errors[name]?.message || 'Erreur de validation'}
      </span>}
    </div>
  );
};