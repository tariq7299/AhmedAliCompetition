import { useState } from "react"
import { handleNetworkErrors, handleResponseErrors } from "../helpers/errorHandling"
import useAuth from "./useAuth"
import useApp from "./useApp"

function useAxiosSend() {
    const { setMainLoader } = useApp()
    const { axiosPrivate } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [resData, setResData] = useState(null)


    async function sendAxiosRequest({ reqOptions, message, loader, successCallback, errCallback, networkErrorCallback, finalCallback }) {
        setIsLoading(true)
        if (loader) {
            setMainLoader(true, loader?.msg, loader?.icon)
        }
        try {
            const response = await axiosPrivate({
                ...reqOptions,
                method: reqOptions?.method || 'POST'
            })
            handleResponseErrors(response, response?.data?.message || message, function () {
                setResData(response?.data)
                successCallback && successCallback(response?.data)
            }, function () {
                errCallback && errCallback(response?.data)
            })
        } catch (err) {
            handleNetworkErrors(err)
            networkErrorCallback && networkErrorCallback()
        } finally {
            finalCallback && finalCallback()
            setIsLoading(false)
            setMainLoader(false, '', null)
        }
    }


    return { resData, isLoading, sendAxiosRequest }

}


export default useAxiosSend
