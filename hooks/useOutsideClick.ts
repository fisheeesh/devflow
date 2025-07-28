import { useEffect, useRef } from "react"

export const useOutsideClick = (handler: () => void, listenCapturing = true) => {
    const ref = useRef(null)

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            // @ts-expect-error Property 'contains' does not exist on type 'EventTarget | null'.
            if (ref.current && !ref.current.contains(event.target)) {
                handler()
            }
        }

        document.addEventListener('click', handleClick, listenCapturing)

        return () => {
            document.removeEventListener('click', handleClick, listenCapturing)
        }
    }, [handler, listenCapturing])

    return ref
}