import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Front from '@/views/Front.vue';

describe('Front.vue', () => {
    it('renders props.msg when passed', () => {
        const msg = 'LoginShield';
        const wrapper = shallowMount(Front, {
            propsData: { msg },
        });
        expect(wrapper.text()).to.include(msg);
    });
});
