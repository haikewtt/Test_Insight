// Question 1.3
// Create a custom hook called useToggle that:
// - Takes an initial boolean value as parameter
// - Returns the current state and a function to toggle it
// - Include a reset function that sets it back to the initial value

import { useState, useCallback, useRef } from 'react';

export function useToggle(initialValue = false) {
  const initialRef = useRef(Boolean(initialValue));
  const [value, setValue] = useState(initialRef.current);

  const toggle = useCallback((nextValue) => {
    if (typeof nextValue === 'boolean') {
      setValue(nextValue);
    } else {
      setValue((prev) => !prev);
    }
  }, []);

  const reset = useCallback(() => {
    setValue(initialRef.current);
  }, []);

  return [value, toggle, reset];
}

