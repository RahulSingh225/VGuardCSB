export const mobileNoValidation = (text: string) => {
  const txtRegex = /^[6-9][0-9]{9}$/;
  return txtRegex.test(text);
};

export const mailValidation = (text: string) => {
  const txtRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return txtRegex.test(text);
};

export const ifscValidation = (text: string) => {
  const txtRegex = /^\d{11}$/;
  return txtRegex.test(text);
};