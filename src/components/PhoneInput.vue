<script lang="ts">
export interface PhoneInputProps {
    modelValue?: string
    defaultCountry?: string
    containerClasses?: string
    selectClasses?: string
    inputClasses?: string
    dropdownClasses?: string
    dropdownItemClasses?: string
    countryNameClasses?: string
    countryCodeClasses?: string
    gap?: string
}
</script>

<script lang="ts" setup>
import { AsYouType, parsePhoneNumber } from "libphonenumber-js";
import { ref, watch, computed } from "vue";
import allCountries from "../utils/allcountries.json";
import type { CountryCode } from "libphonenumber-js/types";
import type { CountryType } from "../utils/types";

const defaultCountry: CountryType = {
    name: "Nigeria",
    code: "NG",
    dial_code: "+234"
};

const countries: CountryType[] = allCountries as CountryType[];

const props = defineProps({
    modelValue: { type: String, default: "" },
    defaultCountry: { type: String, default: "NG" },
    containerClasses: { type: String, default: "" },
    selectClasses: { type: String, default: "" },
    inputClasses: { type: String, default: "" },
    dropdownClasses: { type: String, default: "" },
    dropdownItemClasses: { type: String, default: "" },
    countryNameClasses: { type: String, default: "" },
    countryCodeClasses: { type: String, default: "" },
    gap: { type: String, default: "gap-x-2" }
});

const emit = defineEmits([
    "update:modelValue",
    "update:dialCode",
    "update:fullPhoneNumber"
]);

const selectedCountry = ref<CountryType>(countries.find(c => c.code === props.defaultCountry) || defaultCountry);
const rawPhone = ref(props.modelValue);
const formattedPhone = ref("");
const isOpen = ref(false);

const containerStyle = computed(() => `flex items-center ${props.gap} ${props.containerClasses}`);
const selectStyle = computed(() => `appearance-none w-24 px-2 py-3 text-sm bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center ${props.selectClasses}`);
const inputStyle = computed(() => `form-input w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 ${props.inputClasses}`);
const dropdownStyle = computed(() => `absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded shadow-xl max-h-60 overflow-y-auto ${props.dropdownClasses}`);
const dropdownItemStyle = computed(() => `flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer ${props.dropdownItemClasses}`);
const countryNameStyle = computed(() => `text-sm text-gray-700 ${props.countryNameClasses}`);
const countryCodeStyle = computed(() => `text-sm text-gray-500 ${props.countryCodeClasses}`);

watch(selectedCountry, (newCountryCode: CountryType) => {
    formattedPhone.value = new AsYouType(newCountryCode.code as CountryCode).input(rawPhone.value);
    emitUpdates();
});

const handleInput = (event: Event) => {
    rawPhone.value = (event.target as HTMLInputElement).value;
    formattedPhone.value = new AsYouType(selectedCountry.value.code as CountryCode).input(rawPhone.value);
    emitUpdates();
};

const emitUpdates = () => {
    emit("update:modelValue", formattedPhone.value);
    emit("update:dialCode", selectedCountry.value.code);
    try {
        emit("update:fullPhoneNumber", parsePhoneNumber(rawPhone.value, selectedCountry.value.code as CountryCode).formatInternational());
    } catch (error) {
        emit("update:fullPhoneNumber", rawPhone.value);
    }
};

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const selectCountry = (country: CountryType) => {
    selectedCountry.value = country;
    isOpen.value = false;
    formattedPhone.value = new AsYouType(selectedCountry.value.code as CountryCode).input(rawPhone.value);
    emitUpdates();
};
</script>

<template>
    <div>
        <div :class="containerStyle">
            <div class="relative">
                <button type="button" @click.prevent="toggleDropdown" :class="selectStyle">
                    <img :src="`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`" :alt="selectedCountry.name" class="w-5 h-5 rounded-full mr-2" />
                    <span :class="countryCodeStyle">{{ selectedCountry.dial_code }}</span>
                </button>
                <div v-if="isOpen" :class="dropdownStyle">
                    <div v-for="country in countries" :key="country.code" @click="selectCountry(country)" :class="dropdownItemStyle">
                        <img :src="`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`" :alt="country.name" class="w-5 h-5 rounded-full mr-2" />
                        <span :class="countryNameStyle">{{ country.name }}</span>
                        <span :class="countryCodeStyle" class="ml-auto">{{ country.dial_code }}</span>
                    </div>
                </div>
            </div>
            <input type="tel" :class="inputStyle" :value="formattedPhone" autocomplete="tel" placeholder="Enter phone number" @input="handleInput" />
        </div>
    </div>
</template>
