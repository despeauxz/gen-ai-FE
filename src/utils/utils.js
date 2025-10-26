export function capitalizeFirstLetter(sentence) {
    if (typeof sentence !== 'string' || sentence.length === 0) {
        return sentence; // Handle empty strings or non-string inputs
    }
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}