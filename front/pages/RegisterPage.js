import { IP_MAIN } from '@env'

import { useNavigation } from '@react-navigation/native';

import { useRegisterState, useErrorStates } from '../states/index.js';
import Form from '../Maquetas/Form.js';
import ErrorModal from '../Maquetas/ErrorModal.js';
import { ManageErrors } from '../errors/ManageErrors.js';

export default function RegisterPage() {
  const navigation = useNavigation();

  const { username, setUsername, password, setPassword,
    names, setNames, surnames, setSurnames,
    address, setAddress, birthDate, setBirthDate,
    dni, setDni, grade, setGrade,
    pastGrade, setPastGrade, contactNames, setContactNames,
    contactSurnames, setContactSurnames, contactDni, setContactDni,
    contactEmail, setContactEmail, seguro, setSeguro, cuotaCide, setCuotaCide,
    familiaNumerosa, setFamiliaNumerosa, IBAN, setIBAN
  } = useRegisterState();


  const {
    errorModalVisible,
    setErrorModalVisible,
    errorMessage,
    setErrorMessage
  } = useErrorStates();

  const handleRegister = async () => {

    const validationError = ManageErrors({
      username, password, names, surnames, address, birthDate,
      dni, grade, pastGrade, contactNames, contactSurnames,
      contactDni, contactEmail, IBAN, seguro
    });

    if (validationError) {
      setErrorMessage(validationError);
      setErrorModalVisible(true);
      return; // Evita continuar con el envío de la solicitud al backend
    }

    try {
      const response = await fetch(IP_MAIN + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, password,
          names, surnames, address, birthDate, dni, grade, pastGrade,
          setPastGrade, contactNames, contactSurnames, contactDni,
          contactEmail, seguro, cuotaCide, familiaNumerosa, IBAN
        }),
      });
      const data = await response.json();
      if (response.ok) {
        navigation.navigate("LoginPage");
      } else {
        setErrorMessage(
          data.message
        );
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <Form
        setUsername={setUsername}
        setPassword={setPassword}
        setNames={setNames}
        setSurnames={setSurnames}
        setAddress={setAddress}
        setBirthDate={setBirthDate}
        setDni={setDni}
        setGrade={setGrade}
        setPastGrade={setPastGrade}
        setContactNames={setContactNames}
        setContactSurnames={setContactSurnames}
        setContactDni={setContactDni}
        setContactEmail={setContactEmail}
        setSeguro={setSeguro}
        seguro={seguro}
        setCuotaCide={setCuotaCide}
        cuotaCide={cuotaCide}
        setFamiliaNumerosa={setFamiliaNumerosa}
        familiaNumerosa={familiaNumerosa}
        setIBAN={setIBAN}
        handleRegister={handleRegister}
      />
      <ErrorModal
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => setErrorModalVisible(false)}
      />
    </>

  );
}