import { useState, useCallback, useMemo } from "react";

type ValidationRule<T> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T[keyof T]) => string | null;
  email?: boolean;
  url?: boolean;
  numeric?: boolean;
  positive?: boolean;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>;
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

type TouchedFields<T> = {
  [K in keyof T]?: boolean;
};

type FormState<T> = {
  values: T;
  errors: ValidationErrors<T>;
  touched: TouchedFields<T>;
  isValid: boolean;
  isDirty: boolean;
};

type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

const validators = {
  required: (value: unknown): string | null => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return "This field is required";
    }
    return null;
  },

  minLength: (value: string, min: number): string | null => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value: string, max: number): string | null => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },

  pattern: (value: string, pattern: RegExp): string | null => {
    if (value && !pattern.test(value)) {
      return "Invalid format";
    }
    return null;
  },

  email: (value: string): string | null => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailPattern.test(value)) {
      return "Invalid email format";
    }
    return null;
  },

  url: (value: string): string | null => {
    try {
      if (value && new URL(value)) return null;
    } catch {
      return "Invalid URL format";
    }
    return null;
  },

  numeric: (value: unknown): string | null => {
    if (value && isNaN(Number(value))) {
      return "Must be a number";
    }
    return null;
  },

  positive: (value: unknown): string | null => {
    const num = Number(value);
    if (value && (isNaN(num) || num <= 0)) {
      return "Must be a positive number";
    }
    return null;
  },
};

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {},
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<TouchedFields<T>>({});

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | null => {
      const rule = validationRules[name];
      if (!rule) return null;

      if (rule.required) {
        const requiredError = validators.required(value);
        if (requiredError) return requiredError;
      }

      if (!value || (typeof value === "string" && value.trim() === "")) {
        return null;
      }

      if (typeof value === "string") {
        if (rule.minLength) {
          const minError = validators.minLength(value, rule.minLength);
          if (minError) return minError;
        }

        if (rule.maxLength) {
          const maxError = validators.maxLength(value, rule.maxLength);
          if (maxError) return maxError;
        }

        if (rule.pattern) {
          const patternError = validators.pattern(value, rule.pattern);
          if (patternError) return patternError;
        }

        if (rule.email) {
          const emailError = validators.email(value);
          if (emailError) return emailError;
        }

        if (rule.url) {
          const urlError = validators.url(value);
          if (urlError) return urlError;
        }
      }

      if (rule.numeric) {
        const numericError = validators.numeric(value);
        if (numericError) return numericError;
      }

      if (rule.positive) {
        const positiveError = validators.positive(value);
        if (positiveError) return positiveError;
      }

      if (rule.custom) {
        return rule.custom(value);
      }

      return null;
    },
    [validationRules],
  );

  const validateForm = useCallback((): ValidationResult => {
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const key = fieldName as keyof T;
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return { isValid, errors: newErrors as Record<string, string> };
  }, [values, validationRules, validateField]);

  const handleChange = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error || undefined,
        }));
      }
    },
    [errors, validateField],
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name, values[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
      }));
    },
    [values, validateField],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  const getFieldError = useCallback(
    (name: keyof T): string => {
      return touched[name] ? errors[name] || "" : "";
    },
    [errors, touched],
  );

  const hasFieldError = useCallback(
    (name: keyof T): boolean => {
      return touched[name] && !!errors[name];
    },
    [errors, touched],
  );

  const isFieldTouched = useCallback(
    (name: keyof T): boolean => {
      return !!touched[name];
    },
    [touched],
  );

  const formState = useMemo((): FormState<T> => {
    const hasErrors = Object.keys(errors).length > 0;
    const hasTouchedFields = Object.keys(touched).length > 0;
    const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

    return {
      values,
      errors,
      touched,
      isValid: !hasErrors,
      isDirty,
    };
  }, [values, errors, touched, initialValues]);

  return {
    values,
    errors,
    touched,
    isValid: formState.isValid,
    isDirty: formState.isDirty,

    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldValue,
    setFieldValues,

    getFieldError,
    hasFieldError,
    isFieldTouched,

    formState,
  };
};

export const useSimpleForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {},
) => {
  const form = useFormValidation(initialValues, validationRules);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value, type } = e.target;
      const fieldName = name as keyof T;

      let finalValue: unknown = value;
      if (type === "number") {
        finalValue = value === "" ? "" : Number(value);
      } else if (type === "checkbox") {
        finalValue = (e.target as HTMLInputElement).checked;
      }

      form.handleChange(fieldName, finalValue as T[keyof T]);
    },
    [form],
  );

  const handleInputBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name } = e.target;
      const fieldName = name as keyof T;
      form.handleBlur(fieldName);
    },
    [form],
  );

  return {
    ...form,
    handleInputChange,
    handleInputBlur,
  };
};
