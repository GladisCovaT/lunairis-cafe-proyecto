import { useState } from 'react';

// Maneja los valores de un formulario. Cada input se enlaza por su atributo "name".
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const reset = () => setValues(initialValues);

  return { values, setValues, handleChange, reset };
}
