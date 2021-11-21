import { App } from 'vue';
import { PhoneInput } from '../components';

export const VuePhoneInput = {
    install(app: App): void {
        app.component(PhoneInput.name, PhoneInput);
    }
};
