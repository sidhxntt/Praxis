import axios from "axios";

export const onLogin = async (
  data,
  setServerError,
  reset,
  router
) => {
  setServerError(null); // Clear previous errors

  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_LOGIN_ROUTE, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Login Success:", response.data);
    reset();
    router.push("/dashboard");
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    setServerError(
      error.response?.data?.error || "An unexpected error occurred."
    );
    reset();
  }
};


export const onSignup = async (
  data,
  setServerError,
  reset,
  router
) => {
  setServerError(null); // Clear previous errors
  try {
    console.log(data);
    const response = await axios.post(process.env.NEXT_PUBLIC_SIGNUP_ROUTE, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Server Response:", response.data);
    if (response) {
      reset(); // Reset form fields after successful signup
      router.push("/dashboard");
    }
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    setServerError(
      error.response?.data?.message || "An unexpected error occurred."
    );
    reset();
  }
};
