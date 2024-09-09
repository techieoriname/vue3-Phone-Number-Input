# Vue 3 Phone Number Input

A customizable phone number input component for Vue 3 with country selection.

## Features

- Country selection dropdown
- Automatic formatting based on selected country
- Validation of phone numbers
- Customizable styling

## Installation

You can install the Vue 3 Phone Number Input component using npm:

```bash
npm install @techie04/vue3-phonenumber-input
```
or
```bash
yarn add @techie04/vue3-phonenumber-input
```

## Usage

Import the component and the component and the styles in your Vue file:

```ts
import PhoneInput from '@techie04/vue3-phonenumber-input';
import '@techie04/vue3-phonenumber-input/dist/css/vue3-phone-input.css';
```

```text
These changes will ensure that:

1. The CSS is imported in the main entry point of your package.
2. The CSS is properly built and included in the dist folder.
3. Users of your package know how to import and use both the JavaScript and CSS files.

After making these changes, rebuild your package using `yarn build:all`. The CSS should now be properly included and ready for use in your component library.
```

```vue
<template>
    <PhoneInput
        v-model="phoneNumber"
        @update:dialCode="onDialCodeUpdate"
        @update:fullPhoneNumber="onFullPhoneNumberUpdate"
        :defaultCountry="defaultCountry"
        :selectClasses="selectClasses"
        :inputClasses="inputClasses"
    />
</template>

<script setup lang="ts">import { ref } from 'vue';
import PhoneInput from '@techie04/vue3-phonenumber-input';
const phoneNumber = ref('');
const defaultCountry = ref('US');
const selectClasses = ref('custom-select-class');
const inputClasses = ref('custom-input-class');

const onDialCodeUpdate = (dialCode: string) => {
    console.log('Dial code updated:', dialCode);
};

const onFullPhoneNumberUpdate = (fullNumber: string) => {
    console.log('Full phone number updated:', fullNumber);
};
</script>
```

## Props

- `modelValue`: The v-model binding for the phone number input.
- `defaultCountry`: The default country code (e.g., 'US', 'GB', 'NG').
- `selectClasses`: Custom classes for the country select button.
- `inputClasses`: Custom classes for the phone number input field.

## Events

- `update:modelValue`: Emitted when the phone number changes.
- `update:dialCode`: Emitted when the country (and thus dial code) changes.
- `update:fullPhoneNumber`: Emitted with the full international format of the phone number.


## Customizing the Phone Input Component

The Phone Input component uses Tailwind CSS classes by default. Here's a breakdown of the default styles and how to customize them:

### Container
Default classes: `flex items-center gap-x-2`
Customize with: `:containerClasses="your-classes-here"`

### Select Button
Default classes: `appearance-none w-24 px-2 py-3 text-sm bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center`
Customize with: `:selectClasses="your-classes-here"`

### Input Field
Default classes: `form-input w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
Customize with: `:inputClasses="your-classes-here"`

### Dropdown
Default classes: `absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded shadow-xl max-h-60 overflow-y-auto`
Customize with: `:dropdownClasses="your-classes-here"`

### Dropdown Item
Default classes: `flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer`
Customize with: `:dropdownItemClasses="your-classes-here"`

### Country Name
Default classes: `text-sm text-gray-700`
Customize with: `:countryNameClasses="your-classes-here"`

### Country Code
Default classes: `text-sm text-gray-500`
Customize with: `:countryCodeClasses="your-classes-here"`

### Gap between Select and Input
Default: `gap-x-2`
Customize with: `:gap="your-gap-here"`

Example usage with custom classes:

```vue
<PhoneInput
  :containerClasses="custom-container"
  :selectClasses="custom-select"
  :inputClasses="custom-input"
  :dropdownClasses="custom-dropdown"
  :dropdownItemClasses="custom-dropdown-item"
  :countryNameClasses="custom-country-name"
  :countryCodeClasses="custom-country-code"
  gap="gap-x-4"
/>
```

You can override any of these classes to customize the appearance of the component. Remember to include the necessary Tailwind CSS classes or your own custom CSS to style the component as desired.

## License

MIT
