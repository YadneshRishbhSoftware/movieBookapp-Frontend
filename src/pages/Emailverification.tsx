import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { verificationEmail } from "../authSlice";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";

const Emailverification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const { error, message } = useSelector((state: RootState) => state.auth);
  console.log(error, message, "error");
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastSeverity("error");
      setOpenToast(true);
    } else if (message) {
      setToastMessage(message);
      setToastSeverity("success");
      setOpenToast(true);
    }
  }, [error, message]);
  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastSeverity("error");
      setOpenToast(true);
    } else if (message) {
      setToastMessage(message);
      setToastSeverity("success");
      setOpenToast(true);
    }
  }, [error, message]);

  const handleOtpChange = (value: string, index: number) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input field
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length === 6) {
      dispatch(verificationEmail({ otp: otpCode }));
      navigate("/login")
    } else {
      setToastMessage("Please enter all 6 digits.");
      setToastSeverity("error");
      setOpenToast(true);
    }
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };
  return (
    <div>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Verify OTP
        </Typography>

        <Toast
          open={openToast}
          message={toastMessage}
          severity={toastSeverity}
          onClose={handleCloseToast}
        />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} justifyContent="center">
            {otp.map((digit, index) => (
              <Grid item xs={2} key={index}>
                <TextField
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    handleBackspace(e, index)
                  } // Correct type here
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "1.5rem" },
                  }}
                  variant="outlined"
                  required
                />
              </Grid>
            ))}
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px" }}
          >
            Verify OTP
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default Emailverification;
