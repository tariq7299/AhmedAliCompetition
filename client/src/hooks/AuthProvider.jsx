import { useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { useAlert } from './AlertProvider';
import axios from 'axios';
// import { usersCatApiInstance } from '../helper/axiosInstances';
import { errorHandler } from '../helper/helperFunctions';
import { apiUrl } from '../helper/axiosInstances';

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
      console.log("loginData", loginData)
      const response = await apiUrl.post('authentication/login',
        loginData,
      );
      console.log("response", response)
      const res = response.data;
      if (!res.user_data) {
        throw new Error(res.message);
      }
      localStorage.setItem('userData', res.user_data.username);
      navigate('/');
    } catch (error) {
      console.log("error", error)
      errorHandler(error, navigate)
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

      console.log("response", response)

      const res = response.data;

      console.log("res", res)

      if (!res.user_data) {
        throw new Error(res.message);
      }

      localStorage.setItem('userData', res.user_data.username);

      navigate('/');
    } catch (error) {
      console.log("error", error)
      errorHandler(error, navigate)
    }
  }

  // THis will handle when user presses on "Exit" button
  async function logOut() {
    try {
      const response =  await axios.post(
        `${apiUrl}/logout`,
        '/logout'
      );



      if (response.status === 200 || response.status === 204) {
        console.log("response", response)
        alert(response.data.message)
        localStorage.removeItem('userData');
        navigate('/login');
      }

    } catch (error) {
      errorHandler(error, navigate)
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
