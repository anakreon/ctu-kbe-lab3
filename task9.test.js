import chai from 'chai';
import { getXorKey, hex2txt } from './task9.js';

const { expect } = chai;

describe('getXorKey', () => {   
    it('', () => {
        const plaintext = 'Welcome <b>hulamart</b>, this is your first secret message.';
        const base64hashed = 'LwoePAQIHH8PUQlZKgcDCD5ARA4fGlFefx8NECwTWkQRJgQXF39UWUBDDE8BOggXHCsTXlJCLAoFAHE=';
        const expectedKey = '786f725f6b65795f333337315f6b62655f32303230786f725f6b65795f333337315f6b62655f32303230786f725f6b65795f333337315f6b62655f';
        const result = getXorKey(plaintext, base64hashed);
        expect(result).to.equal(expectedKey);
    }); 
    it('', () => {
        const plaintext = '<a href="index.php?code">Here</a> you can find your secure code.';
        const base64hashed = 'RA5SNxkAH2IUWllVOhNMFTdCD1FfHApVYSMACzoPHFYPfxINEH9RUVwQHgYcO0scFipBE0RUPB4QAH9RX1ZVVg==';
        const expectedKey = '786f725f6b65795f363337315f6b62655f32303230786f775f6b65795f333337315f6b62655f32303230786f725f6b65795f333337315f6b62655f3230323078';
        const result = getXorKey(plaintext, base64hashed);
        expect(result).to.equal(expectedKey);
    });
    it('', () => {
        const plaintext = 'Well, that\'s all for now. Stay tuned for the next challenges.';
        const base64hashed = 'LwoeM0dFDTdSRxBCfwoOCX9UX0AQFgAFcUs2DT5KE0NEMQ4GRTldQhJEEApSMQ4dDX9QW1ZdMw4MAjpBHg==';
        const expectedKey = '786f725f6b65795f333337315f6b62655f32303230786f725f6b65795f333337315f6b62655f32303230786f725f6b65795f333337315f6b62655f3230';
        const result = getXorKey(plaintext, base64hashed);
        expect(result).to.equal(expectedKey);
    });
});

describe('hex2txt', () => {
    it('', () => {
        const hex = '786f725f6b65795f333337315f6b62655f32303230';
        const expectedText = 'xor_key_3371_kbe_2020';
        const result = hex2txt(hex);
        expect(result).to.equal(expectedText);
    });
});
