import { useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../helper/axiosInstances';
import { handleNetworkErrors, handleResponseNotification } from '../helper/helperFunctions';

const AuthContext = createContext();

// This will provide authenticatio for the whole app compoenents using Context API
function AuthProvider({ children }) {
  const navigate = useNavigate();
  // const { addAlert } = useAlert();

  function getUserData() {
    return localStorage.getItem('userData');
  }

  // Function to check if the user is authenticated
  // I could check the cookies for the stored token without sending a request to server !, but i can't !! because the backend is like a mock api without a real database !
  function checkIfAuthenticated() {
    // const token = Cookies.get('token');
    const currentUser = getUserData();
    if (!currentUser) {
      return false
    } else {
      return true
    }

  }

  // This will log the user in
  async function logIn(loginData) {

    try {

      const response = await apiUrl.post('authentication/login',
        loginData,
      );

      const res = response.data;
      
      if (!res.user_data) {
        throw new Error("Somthing went wrong ! Please contact support!"); 
      }

      const saveUesrDataInStorage = () => {
        localStorage.setItem('userData', res.user_data.username)
      }

      // console.log(response)

      handleResponseNotification(response, response?.data?.message, saveUesrDataInStorage)

      navigate('/');

    } catch (error) {

      handleNetworkErrors(error)

    }
  }

  // This will log the user in
  async function register(userData) {
    try {
      
      // TASK #1: Fetch data from an API
      // Use Axios
      // Handle errors
      const response = await apiUrl.post(
        'authentication/register',
        userData,
      );

      const res = response.data;

      if (!res.user_data) {
        throw new Error("Somthing went wrong ! Please contact support!");
      }

      const saveUesrDataInStorage = () => {
        localStorage.setItem('userData', res.user_data.username)
      }

      handleResponseNotification(response, response?.data?.message, saveUesrDataInStorage)

      navigate('/');

      localStorage.setItem('userData', res.user_data.username);

      navigate('/');
    } catch (error) {

      handleNetworkErrors(error)
    }
  }

  // THis will handle when user presses on "Exit" button
  async function logOut() {
    try {
      const response =  await apiUrl.get(
        'authentication/logout'
      );

      const removeUesrDataInStorage = () => {
        localStorage.removeItem('userData');
      }

      handleResponseNotification(response, response?.data?.message, removeUesrDataInStorage)

      navigate('/login');


    } catch (error) {

      handleNetworkErrors(error)
    }

 
  }

  return (
    <AuthContext.Provider
      value={{ checkIfAuthenticated, register,  logIn, logOut, getUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
