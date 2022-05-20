<script lang="ts" setup>
import { AsYouType, CountryCode, isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { createPopper } from '@popperjs/core';
import { onClickOutside } from '@vueuse/core';
import all from '../utils/allcountries.json';
import type { CountryType } from '../utils/types';
import { computed, Ref, ref, toRefs, watch, onMounted } from 'vue';

// Define props
const props = defineProps<{
    formatted?: string;
    intlFormat?: string;
    defaultCountry: string
}>();

// Define props define and convert to refs
const { formatted, intlFormat, defaultCountry } = toRefs(props);

// event emmitter for the phone number
const emit = defineEmits(['update:formatted', 'update:intlFormat']);

const countryDropdown = ref(false);
const target = ref(null);

// search 2 way data bind
const search = ref("")

// Default country code
const selectedCountry: Ref<CountryType> = ref({} as CountryType);

onMounted(() => {
    const findCountry = all.filter(c => c.alpha2Code.toLowerCase() === defaultCountry.value.toLowerCase());
    selectedCountry.value = findCountry[0];
})

const allCountries = computed(() => {
    return all.filter((country) => {
        return country.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase());
    });
});

// Phone number validation
const schema = yup.object({
    phone: yup.string().nullable().test('test-phoneRequired', '', function (value) {
        if (value?.length) {
            if (!isValidPhoneNumber(value, selectedCountry.value.alpha2Code as CountryCode)) {
                return this.createError({ message: 'Invalid phone number' });
            } else {
                return true;
            }
        } else {
            return this.createError({ message: 'Phone number is required' });
        }
    }),
});

// Phone number input - veevalidate
const { errors, setFieldValue } = useForm({
    validationSchema: schema
});

// Phone number input - vue (data bind)
const { value: phone } = useField('phone');

// Country dropdown pop-down using popper
const countryElement = document.querySelector('#countryElement') as HTMLElement;
const dropdown = document.querySelector('#countryDropDown') as HTMLElement;
function toggleCountryDropdown() {
    if (countryDropdown.value) {
        countryDropdown.value = false;
    } else {
        countryDropdown.value = true;
        createPopper(countryElement, dropdown, {
            placement: 'bottom-start'
        });
    }
}

// On click outside - close the country dropdown
onClickOutside(target, () => {
    if (countryDropdown) countryDropdown.value = false;
});

/**
 * @params countryIndex Hide country dropdown and assign selected country index to countryIndex
 */
function onCountrySelect(country: CountryType) {
    countryDropdown.value = false;
    selectedCountry.value = country;
}

// Format number using libphonenumber and remove non numeric characters
function formatNumber(event: KeyboardEvent) {
    if (formatted?.value) {
        emit(
            'update:formatted',
            new AsYouType(selectedCountry.value.alpha2Code.toString() as CountryCode).input(
                phone.value as string
            )
        );
    }

    const $value = (event.target as HTMLInputElement).value;
    (event.target as HTMLInputElement).value = $value.replace(/[^0-9\.]+/g, '');

    return

}

// Emit and update the formatted number
const emitValue = (e: Event) => {
    const $value = (e.target as HTMLInputElement).value;
    if (typeof formatted?.value !== 'undefined') {
        emit('update:formatted', $value);
    }
    if (typeof intlFormat?.value !== 'undefined') {
        if (isValidPhoneNumber($value, selectedCountry.value.alpha2Code as CountryCode)) {
            emit('update:intlFormat', parsePhoneNumber($value, selectedCountry.value.alpha2Code as CountryCode).formatInternational());
        }
    }
};

// Get flag image url
function getImageUrl(name: string) {
    return new URL(`../flags/${name}.svg`, import.meta.url).href;
}

// Watcher to update phone number removingg non numeric characters
watch(phone, ($value) => {
    setFieldValue('phone', (phone.value as string).replace(/[^0-9\.]+/g, ''));
})
</script>
<template>
    <div v-if="Object.keys(selectedCountry).length">
        <div class="flex flex-col gap-1">
            <div class="flex">
                <div class="w-36">
                    <div class="flex items-center justify-center px-3 bg-[#f5f5f5] relative">
                        <img class="w-7"
                            :src="`https://flagcdn.com/w80/${selectedCountry.alpha2Code.toLowerCase()}.png`" alt="" />
                        <input id="countryElement"
                            class="px-2 w-full cursor-pointer py-3 outline-none ring-0 focus:ring-0 bg-[#f5f5f5]"
                            type="tel" readonly :value="'+' + selectedCountry.callingCodes"
                            @click="toggleCountryDropdown" />
                        <img class="absolute w-3 lg:w-4 right-0.5 lg:right-4 arrow-icon"
                            src="../assets/chevron-down.svg" alt="arrow-down">
                    </div>
                    <div ref="target" id="countryDropDown" :class="{
                        hidden: !countryDropdown,
                        block: countryDropdown
                    }" class="
                            absolute
                            bg-white
                            text-base
                            z-50
                            float-left
                            list-none
                            text-left
                            rounded
                            shadow-lg
                            overflow-y-auto
                            h-44
                            w-40
                            no-scrollbar
                        ">
                        <div class="px-3">
                            <input v-model="search" class="
                                    fixed
                                    border-2 border-[#AAA]
                                    px-2
                                    outline-none focus:ring-0 focus:border-none
                                    w-36
                                " type="text" placeholder="Search..." />
                        </div>
                        <ul class="space-y-2 text-xs pl-3 pt-6">
                            <li v-for="(c, i) in allCountries" :key="i"
                                class="py-2 flex gap-x-2 cursor-pointer hover:hoverbg" @click="onCountrySelect(c)">
                                <img class="w-4" :src="getImageUrl(c.alpha2Code.toLowerCase())" :alt="c.name" />
                                <span>{{ c.name }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <input v-model="phone" class="px-2 cursor-text focus:ring-0 focus:outline-none border w-full"
                    type="text" placeholder="Enter Phone Number" @input="emitValue($event)"
                    @keyup="formatNumber($event)" />
            </div>
        </div>
        <span v-if="errors.phone" class="text-xs text-red-500 flex gap-x-1">
            <img class="icon w-4" src="../assets/circle-exclamation.svg" alt="Error: ">
            {{ errors.phone }}</span>
    </div>
</template>

<style>
</style>