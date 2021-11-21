<script lang="ts">
export default {
    name: 'PhoneInput',
    inheritAttrs: false,
    customOptions: {}
};
</script>

<script setup lang="ts">
import { computed, ref, withDefaults } from 'vue';
import { AsYouType, parsePhoneNumber, CountryCode } from 'libphonenumber-js';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { createPopper } from '@popperjs/core';
import { onClickOutside } from '@vueuse/core';
import all from '../utils/allcountries.json';
import type { CountryType } from '../utils/types';

interface Props {
    inputClassNames?: string;
    divBackgroundColor?: string;
    inputBackgroundColor?: string;
    modelValue?: string;
    placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
    inputClassNames: 'w-full cursor-pointer py-3 outline-none ring-0 focus:ring-0',
    divBackgroundColor: 'div__bg',
    inputBackgroundColor: 'div__bg',
    modelValue: '',
    placeholder: 'Enter phone number'
});

const emit = defineEmits(['update:modelValue']);

const selectedCountry = ref<number | any>(162);
const countryDropdown = ref(false);
const countries: Array<CountryType> = all;
const search = ref('');
const target = ref(null);

const allCountries = computed(() => {
    if (search.value.length) {
        return countries.filter((country) => {
            return country.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase());
        });
    }
    return countries;
});

const schema = yup.object({
    phone: yup.string().required()
});

const { errors } = useForm({
    validationSchema: schema
});

const { value: phone } = useField('phone');

const intlFormat = computed(() => {
    if (phone.value) {
        const phoneNumber = parsePhoneNumber(
            // phone.value,
            countries[selectedCountry.value].alpha2Code
        );

        return phoneNumber?.number;
    }
    return false;
});

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

onClickOutside(target, (event) => {
    if (countryDropdown) countryDropdown.value = false;
});

/**
 * @params countryIndex Hide country dropdown and assign selected country index to countryIndex
 */
function onCountrySelect(countryIndex: number) {
    countryDropdown.value = false;
    selectedCountry.value = countryIndex;
}

// Format number to international format
function formatNumber(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    emit(
        'update:modelValue',
        new AsYouType(countries[selectedCountry.value].alpha2Code.toString() as CountryCode).input(
            props.modelValue
        )
    );
}

const emitValue = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
};

function getImageUrl(name: string) {
    return new URL(`../flags/${name}.svg`, import.meta.url).href;
}
</script>

<template>
    <div>
        <div class="flex flex-col gap-1">
            <div class="flex">
                <div class="w-32">
                    <div
                        class="flex items-center justify-center px-3"
                        :class="props.divBackgroundColor"
                    >
                        <img
                            class="w-7"
                            :src="`https://flagcdn.com/w80/${countries[
                                selectedCountry
                            ].alpha2Code.toLowerCase()}.png`"
                            alt=""
                        />
                        <input
                            id="countryElement"
                            class="px-2 border-r"
                            :class="[props.inputClassNames, props.inputBackgroundColor]"
                            type="tel"
                            readonly
                            :value="`+${countries[selectedCountry].callingCodes}`"
                            @click="toggleCountryDropdown"
                        />
                    </div>
                    <div
                        ref="target"
                        id="countryDropDown"
                        :class="{
                            hidden: !countryDropdown,
                            block: countryDropdown
                        }"
                        class="
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
                            h-40
                            w-40
                            no-scrollbar
                        "
                    >
                        <div class="px-3">
                            <input
                                v-model="search"
                                class="
                                    fixed
                                    border-2 border-[#AAA]
                                    px-2
                                    outline-none
                                    focus:ring-0 focus:border-none
                                    w-36
                                "
                                type="text"
                                placeholder="Search..."
                            />
                        </div>
                        <ul class="space-y-2 text-xs pl-3 pt-5">
                            <li
                                v-for="(c, i) in allCountries"
                                :key="i"
                                class="py-2 flex gap-x-2 cursor-pointer hover:hoverbg"
                                @click="onCountrySelect(i)"
                            >
                                <img
                                    class="w-4"
                                    :src="getImageUrl(c.alpha2Code.toLowerCase())"
                                    :alt="c.name"
                                />
                                <!-- :src="`https://flagcdn.com/w80/${c.alpha2Code.toLowerCase()}.png`"-->
                                <span>{{ c.name }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <input
                    :value="props.modelValue"
                    class="px-2 cursor-text"
                    :class="[props.inputClassNames, props.inputBackgroundColor]"
                    type="text"
                    :placeholder="props.placeholder"
                    @input="emitValue($event)"
                    @keyup="formatNumber($event)"
                />
            </div>
        </div>
        <span v-if="errors.phone" class="text-xs text-red-500"
            ><i class="far fa-exclamation-triangle text-yellow-400 pr-2"></i>
            {{ errors.phone }}</span
        >
    </div>
</template>

<style lang="scss" scoped>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

.div__bg {
    background-color: #f5f5f5;
}

.hoverbg {
    background: #c5c5c5;
}
</style>
