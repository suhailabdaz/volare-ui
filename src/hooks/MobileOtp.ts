import {
  ApplicationVerifier,
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { toast } from 'sonner';

const OTP_REQUEST_COOLDOWN = 60000; 

let lastOtpRequestTime = 0;

export const onCaptchaVerify = (auth: Auth, setotpInput: any) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          toast.success("OTP sent successfully");
          setotpInput(true);
        },
        "expired-callback": () => {
          toast.error("ReCAPTCHA expired. Please try again.");
        },
      }
    );
  }
};

export const sendOtp = async (setotpInput: any, auth: Auth, mobile: string, setConfirmationResult: any) => {
  try {
    const currentTime = Date.now();

    if (currentTime - lastOtpRequestTime < OTP_REQUEST_COOLDOWN) {
      toast.error('Please wait before requesting a new OTP.');
      return;
    }

    onCaptchaVerify(auth, setotpInput);
    const number = "+" + mobile;

    const appVerifier: ApplicationVerifier | undefined = window?.recaptchaVerifier;
    if (appVerifier !== undefined) {
      const result = await signInWithPhoneNumber(auth, number, appVerifier);
      setConfirmationResult(result);
      lastOtpRequestTime = currentTime; 
    } else {
      throw new Error("RecaptchaVerifier is not defined.");
    }
  } catch (error) {
    console.log("Error sending OTP:", error);
    if ((error as Error).message.includes("auth/too-many-requests")) {
      toast.error("Too many requests. Please wait a while before trying again.");
    } else {
      toast.error("An error occurred. Please try again.");
    }
  }
};
