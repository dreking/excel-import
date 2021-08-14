const { parsePhoneNumberFromString } = require('libphonenumber-js');

const phone = (value) => {
    let phone = value;
    if (!value.startsWith('+')) phone = '+' + value;

    const isPhoneValid = parsePhoneNumberFromString(phone);
    if (!isPhoneValid || !isPhoneValid.isValid()) return false;

    return true;
};

module.exports = phone;
