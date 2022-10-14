import Onyx from 'react-native-onyx';

/**
 * @param {String} formID
 * @param {Boolean} isLoading
 */
function setIsLoading(formID, isLoading) {
    Onyx.merge(formID, {isLoading});
}

/**
 * @param {String} formID
 * @param {Object} errors
 */
function setErrors(formID, errors) {
    Onyx.merge(formID, {errors});
}

/**
 * @param {String} formID
 * @param {Object} draftValues
 */
function setDraftValues(formID, draftValues) {
    Onyx.merge(`${formID}DraftValues`, draftValues);
}

/**
 * @param {String} formID
 * @returns {String}
 */
function getDraftValuesKey(formID) {
    return `${formID}DraftValues`;
}

export {
    getDraftValuesKey,
    setIsLoading,
    setErrors,
    setDraftValues,
};
