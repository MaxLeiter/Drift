import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const useSignedIn = () => {
    const [signedIn, setSignedIn] = useState(typeof window === 'undefined' ? false : !!Cookies.get("drift-token"));

    useEffect(() => {
        if (Cookies.get("drift-token")) {
            setSignedIn(true);
        } else {
            setSignedIn(false);
        }
    }, []);

    return signedIn;
}

export default useSignedIn;
