import {  Button, Container, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { forgotPassword } from '../authSlice'
import Toast from '../components/Toast'

const Forgotpassword = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [email,setEmail]= useState<string>("")
    const { error,message  } = useSelector((state: RootState) => state.auth);
    console.log(error,message,"error")
    const [openToast, setOpenToast] = useState<boolean>(false)
    const [toastMessage, setToastMessage] = useState<string>("")
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success')
    useEffect(() => {
        if (error) {
            setToastMessage(error)
            setToastSeverity('error')
            setOpenToast(true)
        } else if (message) {
            setToastMessage(message)
            setToastSeverity('success')
            setOpenToast(true)
        }
    }, [error, message])
    const handleForgotPassword = (e: React.FormEvent) =>{
        e.preventDefault();
        dispatch(forgotPassword({email}))
    }
    const handleCloseToast = () => {
        setOpenToast(false)
    }
  return (
    <div>
       <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Forgot Password
      </Typography>

               <Toast
                    open={openToast}
                    message={toastMessage}
                    severity={toastSeverity}
                    onClose={handleCloseToast}
                />

      <form onSubmit={handleForgotPassword}>
        <TextField
          label="Email Address"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send Password Reset Link
        </Button>
      </form>
    </Container>
    </div>
  )
}

export default Forgotpassword
