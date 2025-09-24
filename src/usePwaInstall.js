import {useEffect, useState} from 'react'

export default function usePwaInstall() {
    const [deferred, setDeferred] = useState(null)
    useEffect(() => {
        const onPrompt = (e) => {
            e.preventDefault();
            setDeferred(e)
        }
        window.addEventListener('beforeinstallprompt', onPrompt)
        return () => window.removeEventListener('beforeinstallprompt', onPrompt)
    }, [])
    const promptInstall = async () => {
        if (!deferred) return
        deferred.prompt()
        await deferred.userChoice
        setDeferred(null)
    }
    return {canInstall: !!deferred, promptInstall}
}
