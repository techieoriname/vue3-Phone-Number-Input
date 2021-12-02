import { parsePhoneNumberWithError, AsYouType, CountryCode } from 'libphonenumber-js';

export * from './components';
export { VuePhoneInput as default } from './plugin/plugin';
export { default as countries } from './utils/allcountries.json';
