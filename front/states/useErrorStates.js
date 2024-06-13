import { useState } from "react";

export const useErrorStates = () => {
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    return { errorModalVisible, setErrorModalVisible, 
        errorMessage, setErrorMessage };
}
