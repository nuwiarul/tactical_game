package api

import (
	"strings"
	"unicode"

	"github.com/go-playground/validator/v10"
)

func validateUsername(fl validator.FieldLevel) bool {
	value := fl.Field().String()

	// 1. The string must have at least one character.
	if len(value) == 0 {
		return false
	}

	// 2. Check if the first character is a letter.
	firstChar := rune(value[0])
	if !unicode.IsLetter(firstChar) {
		return false
	}

	// 3. Check if all characters are lowercase.
	if value != strings.ToLower(value) {
		return false
	}

	return true
}
