import { toast } from 'react-toastify'

export const errorHandler = (error, addAlert, navigate) => {
    if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.message === 'Invalid token'
    ) {
        // Redirect to login page or handle unauthorized access
        alert('Unauthorized access, please log in first !!')
        // addAlert('Unauthorized access, please log in first !!', 'error');
        navigate('/login');
    } else if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.message === 'Invalid credentials'
    ) {
        alert('username/password is wrong ⛔');
    } else {
        // Handle other errors (e.g., show an error message)
        console.error('Something bad happened! Please contact support.');
        alert('Something bad happened ! Please contact support !');
    }
};




export function handleResponseErrors(response, message, successCallback, errorCallback) {

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
    if (err?.response?.status === 419 || err?.response?.status === 401) {
        toast.error('انتهت صلاحية دخولك، برجاء تسجيل الدخول مرة أخرى')
        setTimeout(() => {
            window.location.href = '/login'
        }, 4000)
    } else if (err?.response?.status === 422) {
        toast.error(err?.response?.data?.message)
    } else {
        err?.code !== 'ERR_CANCELED' && (
            toast.error(err?.response?.data?.message || 'حدث خطأ ما، برجاء المحاولة لاحقًا')
        )
    }
}
