import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  email: string;
  pin: string;
}

interface FormErrors {
  email?: string;
  pin?: string;
}

const WalletForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    pin: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === 'pin') {
      setFormData((prev) => ({ ...prev, [name]: value.slice(0, 4) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid Gmail address';
    }

    if (!formData.pin) {
      newErrors.pin = 'PIN is required';
    } else if (formData.pin.length !== 4) {
      newErrors.pin = 'PIN must be exactly 4 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Here you would typically send the data to your backend
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white/5 bg-opacity-20 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm ml-3 font-medium text-white/75"
          >
            Gmail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your Gmail address"
            className="mt-1 block w-full px-3 py-2 bg-inherit  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="pin"
            className="block ml-3 text-sm font-medium text-white/75"
          >
            PIN
          </label>
          <input
            type="tel"
            id="pin"
            name="pin"
            value={formData.pin}
            onChange={handleInputChange}
            placeholder="Enter 4-digit PIN"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={4}
            className="mt-1 block w-full px-3 py-2 bg-inherit rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.pin && (
            <p className="mt-2 text-sm text-red-600">{errors.pin}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default WalletForm;
