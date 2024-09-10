import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { XMarkIcon } from '@heroicons/react/24/solid'; 
import { Toaster, toast } from 'sonner';
// import { createAxios } from "../../../../../../services/axios/UserAxios";
// import { userEndpoints } from '../../../../../../services/endpoints/UserEndpoints';
// import { login as userLogin } from '../../../../../../redux/slices/userSlice';
// import * as Yup from 'yup';
import {
  ConfirmationResult,
} from "firebase/auth";
import { FormikErrors, useFormik } from "formik";

interface OtpModalProps {
  closeModal: () => any,
  openModal: (modalName :string) => any  
  confirmationResult:ConfirmationResult | null;
  sendOtp:()=>any
}

interface FormValues {
  otp: string[];
}

const validate = (values: FormValues) => {
  const errors: FormikErrors<FormValues> = {};
  if (values.otp.some((data) => data === "")) {
    errors.otp = "This field is required";
  }
  return errors;
};

const OtpModal: React.FC<OtpModalProps> = ({ closeModal ,openModal,sendOtp }) => {
  // const userEmail = sessionStorage.getItem('userEmail')
  // const dispatch = useDispatch()

  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(30);
  const [, setShowResendButton] = useState(false);
  const [confirmationResult, ] = useState<ConfirmationResult | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      otp: Array(6).fill(""),
    },
    validate,
    onSubmit: async (values) => {
      try {
        const otp = values.otp
        if (otp && confirmationResult) {
          const otpValue: string = otp.toString();
          confirmationResult
            .confirm(otpValue)
            .then(async () => {
              toast.success("login success");
            })
            .catch(() => {
              toast.error("Enter a valid otp");
            });
        } else {
          toast.error("Enter a valid otp");
        }
      } catch (error) {
        toast.error('An error occurred. Please try again');
      }
    },
  });

  const pasteText = useCallback(
    (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData("text") || "";
      const fieldValue: string[] = pastedText.split("").slice(0, 6);
      formik.setValues({ otp: fieldValue });
      if (inputRef.current[5]) {
        inputRef.current[5].focus();
      }
    },
    [formik]
  );

  useEffect(() => {
    const firstInput = inputRef.current[0];
    if (firstInput) {
      firstInput.addEventListener("paste", pasteText);
    }
    return () => {
      if (firstInput) {
        firstInput.removeEventListener("paste", pasteText);
      }
    };
  }, [pasteText]);

  useEffect(() => {
    setCountdown(30); // Reset countdown to 30 when modal opens
    setShowResendButton(false);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowResendButton(true);
    }
  }, [countdown]);

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return;

    const currentOtp = [...formik.values.otp];
    currentOtp[index] = value.slice(-1);

    formik.setValues((prev) => ({
      ...prev,
      otp: currentOtp,
    }));
    if (value && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleBackSpace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && !formik.values.otp[index]) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
                            sendOtp();
                            toast.success('OTP resent successfully')
                            
      formik.resetForm();
      setCountdown(30);
      setShowResendButton(false);
      if (inputRef.current[0]) {
        inputRef.current[0].focus();
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
      openModal("otp")
    }
  };

  const renderInput = () => {
    return formik.values.otp.map((value, index) => (
      <input
        key={index}
        ref={(element) => (inputRef.current[index] = element)}
        type="text"
        name={`otp${index}`}
        value={value}
        className="w-2/5 mb-5 shadow-md sm:w-9 md:w-14 lg:w-16 h-12 rounded-md mr-2 text-center text-xl border border-zinc-200"
        onChange={(e) => handleChange(e, index)}
        onKeyDown={(e) => handleBackSpace(e, index)}
        maxLength={1}
      />
    ));
  };

  return (
    <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 shadow-lg w-1/3 rounded-lg">
        <div className='flex justify-end'>
          <button className='' onClick={() => closeModal()}>
            <XMarkIcon className="h-8 w-8 text-slate-700 hover:text-gray-400" />
          </button>
        </div>
        
        <h2 className="text-2xl mb-1 text-center font-bold">Enter OTP</h2>
        <p className="text-base mb-4 text-center font-normal">OTP has been sent to your MOBILE </p>
        
        <form onSubmit={formik.handleSubmit} className="w-full">
          <div className="flex items-center justify-center">
            {renderInput()}
          </div>
          {formik.errors.otp && (
            <p className="mt-3 text-sm text-red-400 text-center">
              Please fill all fields
            </p>
          )}
          {countdown > 0 ? (
            <div className='flex justify-center'>
            <button
              type="submit"
              className="mt-4 w-4/5 py-3 text-white rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 hover:scale-105"
            >
              Submit
            </button>
            </div>
          ) : (
            <p></p>
          )}
        </form>
        
        {countdown > 0 ? (
          <p className="text-center mt-4">Resend OTP in {countdown} seconds</p>
        ) : (
          <div className='flex justify-center'>
            <button
              type="submit"
              onClick={handleResendOtp}
              className="mt-4 w-4/5 py-3 text-white rounded-lg font-PlusJakartaSans font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all ease-in-out delay-50 duration-500 hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 hover:scale-105"
            >
              Resend Otp
            </button>
            </div>
        )}
      </div>
      <Toaster position="top-center" expand={false} richColors />
    </div>
  );
};

export default OtpModal;
