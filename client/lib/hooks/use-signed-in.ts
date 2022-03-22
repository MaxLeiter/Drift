import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const useSignedIn = () => {
    const [signedIn, setSignedIn] = useState(typeof window === 'undefined' ? false : !!Cookies.get("drift-token"));
    const token = Cookies.get("drift-token")

    useEffect(() => {
        if (token) {
            setSignedIn(true);
        } else {
            setSignedIn(false);
        }
    }, [token]);

    return { signedIn, token };
}

export default useSignedIn;
