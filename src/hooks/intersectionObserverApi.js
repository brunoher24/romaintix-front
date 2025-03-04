import { useRef, useEffect, useState } from "react"

const useElementOnScreen = (options) => {
    const containerRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    const callbackFunction = (entries) => {
        const [entry] = entries
        setIsVisible(entry.isIntersecting)
    }

    useEffect(() => {
        const current = containerRef.current
        const observer = new IntersectionObserver(callbackFunction, options)
        if (current) observer.observe(current)

        return () => {
            if (current) observer.unobserve(current)
        }
    }, [containerRef, options])

    return [containerRef, isVisible]
};

export default useElementOnScreen;
