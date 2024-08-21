import { toast } from 'react-toastify'

export function handleResponseNotification(response, message, successCallback, errorCallback) {

    console.log("message", message)
    

    // ... In Case of a success response
    if (response?.data?.success) {
        message && toast.success(message)
        successCallback && successCallback()
    }

    // ... In case of a validation error
    if (!response?.data?.success && response?.data?.errors) {

        // ... Errors are array
        if (Array.isArray(response?.data?.errors) && response?.data?.errors?.length > 0) {
            response?.data?.errors?.map(item => (
                toast.error(item)
            ))

            // ... Errors are object
        } else if (!Array.isArray(response?.data?.errors) && response?.data?.errors?.length > 0) {
            toast.error(response?.data?.errors)
        } else {
            Object.keys(response?.data?.errors)?.map(key => (
                Array.isArray(response?.data?.errors[key]) &&
                toast.error(response?.data?.errors[key]?.join(','))
            ))
        }

        errorCallback && errorCallback()
    } else if (!response?.data?.success && !response?.data?.errors) {
        errorCallback && errorCallback()
    }
}


export function handleNetworkErrors(err) {
    if (err?.response?.status === 401) {
        toast.error('Please log in!')

        setTimeout(() => {
            window.location.href = '/login'
        }, 4000)

    } else if (err?.response?.status === 403) {
        toast.error(err?.response?.data?.message)
    } else {
        err?.code !== 'ERR_CANCELED' && (
            toast.error(err?.response?.data?.message || 'Something bad happend! Please try again later')
        )
    }
}
