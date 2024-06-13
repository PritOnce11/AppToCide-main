export function ManageErrors({
    username,
    password,
    names,
    surnames,
    address,
    birthDate,
    dni,
    grade,
    contactNames,
    contactSurnames,
    contactDni,
    contactEmail,
    IBAN, 
    seguro,
  }) {

    const nameRegex = /^[a-zA-Z\s]*$/;

    switch (true) {
      case (!username || !password || !names || !surnames || !address || !birthDate || !dni || !grade || !contactNames || !contactSurnames || !contactDni || !contactEmail || !IBAN || !seguro):
        return "Por favor, complete todos los campos.";
      case (password.length < 8):
        return "La contrasena debe tener al menos 8 caracteres.";
      case (!nameRegex.test(names) || !nameRegex.test(surnames)):
        return "Los nombres y apellidos solo pueden contener letras.";
      case (!birthDate.match(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/)):
        return "La fecha de nacimiento debe tener el formato DD-MM-YYYY.";
      case (!dni.match(/^\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/)):
        return "El DNI solo puede contener 8 digitos y una letra.";
      case (seguro == false):
        return "Por favor, acepte la politica de privacidad.";
      case(!nameRegex.test(contactNames) || !nameRegex.test(contactSurnames)):
        return "Los nombres y apellidos solo pueden contener letras.";
      case (!contactDni.match(/^\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/)):
        return "El DNI solo puede contener 8 digitos y una letra.";
      case (!contactEmail.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)):
        return "El correo electronico es invalido.";
      case (!IBAN.match(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11}$/)):
        return "El IBAN es invalido.";
    }
  }
  