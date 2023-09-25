import { useEffect, useState } from 'react';

const useDebounce = (value, ms) => {
    const [debounceValue, setDebounceValue] = useState('');
    useEffect(() => {
        const delayId = setTimeout(() => {
            setDebounceValue(value);
        }, ms);
        return () => clearTimeout(delayId);
    }, [value, ms]);
    return debounceValue;
};

export default useDebounce;
