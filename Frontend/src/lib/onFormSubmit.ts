import axios from "axios";

interface LoginFormInputs {
  email: string;
  password: string;
}
interface SignupFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export const onLogin = async (
  data: LoginFormInputs,
  setServerError: (error: string | null) => void,
  reset: () => void,
  navigate: (path: string) => void
) => {
  setServerError(null); // Clear previous errors

  try {
    const response = await axios.post(import.meta.env.VITE_LOGIN_ROUTE, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Login Success:", response.data);
    reset();
    navigate("/dashboard");
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
    setServerError(
      error.response?.data?.error || "An unexpected error occurred."
    );
    reset();
  }
};

export const onSignup = async (
  data: SignupFormInputs,
  setServerError: (error: string | null) => void,
  reset: () => void,
  navigate: (path: string) => void
) => {
  setServerError(null); // Clear previous errors
  try {
    console.log(data);
    const response = await axios.post(import.meta.env.VITE_SIGNUP_ROUTE, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Server Response:", response.data);
    if (response) {
      reset(); // Reset form fields after successful signup
      navigate("/dashboard");
    }
  } catch (error: any) {
    console.error("Signup Error:", error.response?.data || error.message);
    setServerError(
      error.response?.data?.message || "An unexpected error occurred."
    );
    reset();
  }
};
