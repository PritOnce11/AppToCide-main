export function ManageErrorsStudent({
    names,
    surnames,
    address,
    birthDate,
    dni,
    grade,
    seguro,
  }) {

    const nameRegex = /^[a-zA-Z\s]*$/;

    switch (true) {
      case (!names || !surnames || !address || !birthDate || !dni || !grade || !seguro):
        return "Por favor, complete todos los campos.";
      case (!nameRegex.test(names) || !nameRegex.test(surnames)):
        return "Los nombres y apellidos solo pueden contener letras.";
      case (!birthDate.match(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/)):
        return "La fecha de nacimiento debe tener el formato DD-MM-YYYY.";
      case (!dni.match(/^\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/)):
        return "El DNI solo puede contener 8 digitos y una letra.";
      case (seguro == false):
        return "Por favor, acepte la politica de privacidad.";
    }
  }
  