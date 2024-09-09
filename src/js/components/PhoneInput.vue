<script lang="ts" setup>
import { AsYouType, parsePhoneNumber } from "libphonenumber-js";
import { ref, watch } from "vue";
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
    modelValue: {
        type: String,
        default: ""
    },
    defaultCountry: {
        type: String,
        default: "NG"
    },
    selectClasses: {
        type: String,
        default: ""
    },
    inputClasses: {
        type: String,
        default: ""
    }
});

const emit = defineEmits([
    "update:modelValue",
    "update:dialCode",
    "update:fullPhoneNumber"
]);

const selectedCountry = ref<CountryType>(countries.find(c => c.code === props.defaultCountry) || defaultCountry);

const rawPhone = ref(props.modelValue);
const formattedPhone = ref("");

watch(selectedCountry, (newCountryCode: CountryType) => {
    formattedPhone.value = new AsYouType(
        newCountryCode.code as CountryCode
    ).input(rawPhone.value);
    emitUpdates();
});

const handleInput = (event: Event) => {
    rawPhone.value = (event.target as HTMLInputElement).value;
    formattedPhone.value = new AsYouType(
        selectedCountry.value.code as CountryCode
    ).input(rawPhone.value);
    emitUpdates();
};

const emitUpdates = () => {
    emit("update:modelValue", formattedPhone.value);
    emit("update:dialCode", selectedCountry.value.code);
    try {
        emit(
            "update:fullPhoneNumber",
            parsePhoneNumber(
                rawPhone.value,
                selectedCountry.value.code as CountryCode
            ).formatInternational()
        );
    } catch (error) {
        // If parsing fails, emit the raw input
        emit("update:fullPhoneNumber", rawPhone.value);
    }
};

// dropdown
const isOpen = ref(false);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const selectCountry = (country: CountryType) => {
    selectedCountry.value = country;
    isOpen.value = false;
    formattedPhone.value = new AsYouType(
        selectedCountry.value.code as CountryCode
    ).input(rawPhone.value);
    emitUpdates();
};
</script>

<template>
    <div>
        <label for="mobile" class="form-label">Phone number:</label>
        <div class="flex gap-x-6 items-center mt-2">
            <div class="relative">
                <button
                    type="button"
                    @click.prevent="toggleDropdown"
                    class="appearance-none w-24 px-2 py-3 text-2xl bg-slate-100 rounded shadow-sm focus:ring-0 sm:text-sm sm:leading-6 flex items-center"
                    :class="selectClasses"
                >
                    <img
                        :src="`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`"
                        :alt="selectedCountry.name"
                        class="w-6 h-6 rounded-full"
                    />
                    <span class="text-lg ml-2">{{ selectedCountry.dial_code }}</span>
                </button>
                <div
                    v-if="isOpen"
                    class="absolute z-50 mt-2 w-[380px] bg-white border border-gray-200 rounded shadow-xl max-h-44 overflow-scroll"
                >
                    <div
                        v-for="country in countries"
                        :key="country.code"
                        @click="selectCountry(country)"
                        class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                        <img
                            :src="`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`"
                            :alt="country.name"
                            class="w-6 h-6 rounded-full mr-2"
                        />
                        {{ country.name }} ({{ country.dial_code }})
                    </div>
                </div>
            </div>
            <input
                id="mobile"
                type="text"
                class="form-input w-full"
                :class="inputClasses"
                :value="formattedPhone"
                autocomplete="tel"
                placeholder="Enter phone number"
                @input="handleInput"
            />
        </div>
    </div>
</template>

<style>
</style>
