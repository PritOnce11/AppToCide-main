import { useState } from "react";

export const useRegisterState = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [names, setNames] = useState("");
  const [surnames, setSurnames] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [dni, setDni] = useState("");
  const [grade, setGrade] = useState("");
  const [pastGrade, setPastGrade] = useState("");
  const [contactNames, setContactNames] = useState("");
  const [contactSurnames, setContactSurnames] = useState("");
  const [contactDni, setContactDni] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [seguro, setSeguro] = useState(true);
  const [cuotaCide, setCuotaCide] = useState(true);
  const [familiaNumerosa, setFamiliaNumerosa] = useState(false);

  const [IBAN, setIBAN] = useState("");

  return {
    username,
    setUsername,
    password,
    setPassword,
    names,
    setNames,
    surnames,
    setSurnames,
    address,
    setAddress,
    birthDate,
    setBirthDate,
    dni,
    setDni,
    grade,
    setGrade,
    pastGrade,
    setPastGrade,
    contactNames,
    setContactNames,
    contactSurnames,
    setContactSurnames,
    contactDni,
    setContactDni,
    contactEmail,
    setContactEmail,
    seguro,
    setSeguro,
    cuotaCide,
    setCuotaCide,
    familiaNumerosa,
    setFamiliaNumerosa,
    IBAN,
    setIBAN
  };
};
