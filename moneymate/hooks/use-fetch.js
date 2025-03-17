import { toast } from "sonner";

const { useState } = require("react")

const useFetch = (cb) => {
    const [data, setData] = useState(undefined);
    const [loding, setLoding] = useState(null);
    const [error, setError] = useState(null);

    const fn = async(...args) => {

        setLoding(true);
        setError(null);

        try {
            const response = await cb(...args);
            setData(response);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        }finally{
            setLoding(false);
        }

    }
    return {data, loding, error , fn , setData};
}

export default useFetch;