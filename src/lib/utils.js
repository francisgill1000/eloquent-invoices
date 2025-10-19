import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const parseApiError = (error) => {
  console.log("🚀 ~ parseApiError ~ error:", error)
  if (error.response) {

    const status = error.response.status;
    const responseData = error.response.data;

    if (status === 422) {
      return (
        responseData.message || "Validation failed. Please check the form fields for errors."
      );

      // You may also want to integrate responseData.errors with react-hook-form's setError here

    } else if (status >= 500) {
      // 500: Server error
      return ("A critical server error occurred. Please try again later.");
    } else {
      // Other errors (401, 403, 404, etc.)
      return (responseData.message || `An error occurred with status ${status}.`);
    }

  } else {
    // Network error
    return ("Network error: Could not connect to the API.");
  }
}