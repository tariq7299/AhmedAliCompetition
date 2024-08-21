import { useState, useEffect, useState } from 'react'
import useAuth from './useAuth'
import { handleNetworkErrors, handleResponseNotification } from '../helper/helperFunctions'
import useApp from './useApp'

const useAxiosFetch = ({ reqOptions, trigger, message, loader, successCallback, errCallback }) => {
    const { setMainLoader } = useApp()
    const { axiosPrivate } = useAuth()
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        let isMounted = true
        const controller = new AbortController()

        async function fetchData() {
            setIsLoading(true)
            if (loader) {
                setMainLoader(true, loader?.msg, loader?.icon)
            }

            try {
                const response = await axiosPrivate({
                    method: reqOptions?.method || 'GET',
                    ...reqOptions
                }, { signal: controller.signal })
                handleResponseNotification(response, message || '', function () {
                    setData(response?.data)
                    successCallback && successCallback(response?.data)
                }, function () {
                    errCallback && errCallback(response?.data)
                })
            } catch (err) {
                handleNetworkErrors(err)
            } finally {
                setIsLoading(false)
                setMainLoader(false, '', null)
            }
        }

        if (trigger) {
            fetchData()
        }

        return () => {
            isMounted = false
            controller.abort()
        }

    }, [trigger])

    return { data, isLoading }
}


export default useAxiosFetch
