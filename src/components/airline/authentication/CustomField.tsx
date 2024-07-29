import React, { useState } from 'react';
import { Field, useField, FieldAttributes } from 'formik';

interface CustomFieldProps extends FieldAttributes<any> {
  label: string;
}

const CustomField: React.FC<CustomFieldProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`relative w-full rounded-lg overflow-hidden p-[0.1rem]  ${isFocused && 'bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600'}`}>
      <Field
        {...field}
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full p-5 border-2 bg-white rounded-lg focus:outline-none placeholder-black ${
          isFocused
            ? 'border-transparent' // The border is hidden by the gradient background
            : meta.touched && meta.error
            ? 'border-red-500'
            : 'border-white bg-gray-300 '
        }`}
        placeholder={label}
      />
    </div>
  );
};

export default CustomField;
