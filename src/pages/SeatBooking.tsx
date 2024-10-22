import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { bookMovie, fetchBookedSeats } from "../bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useLocation, useNavigate } from "react-router-dom";
// import { handlePaymentFailure, handlePaymentSuccess, initiatePayment } from '../paymentSlice';

const seatClasses = {
  Platinum: {
    price: 800,
    seats: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
  },
  Gold: { price: 500, seats: ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"] },
  Silver: {
    price: 300,
    seats: ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"],
  },
  Executive: {
    price: 200,
    seats: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"],
  },
};

const SeatBooking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const bookedSeats = useSelector(
    (state: RootState) => state.booking.seats as string[]
  );
  const paymentData = useSelector(
    (state: RootState) => state.payment?.paymentData?.payURequestPayload
  );
  console.log(paymentData, "paymentData");
  const userId = useSelector((state: RootState) => state.auth.userInfo?._id);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  useEffect(() => {
    // Fetch booked seats for the movie
    dispatch(fetchBookedSeats(location?.state));
  }, [dispatch, location?.state]);
  useEffect(() => {
    // Calculate total price whenever selected seats change
    let newTotal = 0;
    selectedSeats.forEach((seat) => {
      Object.values(seatClasses).forEach((seatClass) => {
        if (seatClass.seats.includes(seat)) {
          newTotal += seatClass.price;
        }
      });
    });
    setTotalPrice(newTotal);

    if (selectedSeats.length > 0) {
      setSnackbarOpen(true);
    }
  }, [selectedSeats]);

  const handleSeatClick = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleContinue = (currentSelectedSeats: string[]) => {
    const movieId = location?.state; // Replace with actual movie ID

    navigate("/bookuserInfo", {
      state: {
        selectedSeats: currentSelectedSeats,
        totalPrice,
        movieId,
        userId,
      },
    });
    // Book the movie first
    dispatch(
      bookMovie({ movieId, userId, selectedSeats: currentSelectedSeats })
    )
  };
  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h4" mb={4}>
        Select Your Seats
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>  
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" mb={2}>
              Seat Guide
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "primary.main",
                  mr: 1,
                  opacity: 0.6, // Make it look disabled
                  pointerEvents: "none", // Disable interactions
                }}
              />
              <Typography color="text.secondary">Booked Seat</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "inherit",
                  border: "1px solid",
                  mr: 1,
                }}
              />
              <Typography>Available Seat</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={10}>
          {Object.entries(seatClasses).map(([className, classInfo]) => (
            <Box key={className} mb={4}>
              <Typography variant="h6" gutterBottom>
                {className} Class - ₹{classInfo.price}
              </Typography>
              <Grid container justifyContent="center" spacing={2}>
                {classInfo.seats.map((seat) => (
                  <Grid item key={seat}>
                    <Button
                      variant={
                        selectedSeats.includes(seat) ||
                        bookedSeats.includes(seat)
                          ? "contained"
                          : "outlined"
                      }
                      color={
                        selectedSeats.includes(seat) ||
                        bookedSeats.includes(seat)
                          ? "primary"
                          : "inherit"
                      }
                      disabled={bookedSeats.includes(seat)}
                      onClick={() => handleSeatClick(seat)}
                      sx={{
                        minWidth: 50,
                        minHeight: 50,
                        backgroundColor: bookedSeats.includes(seat)
                          ? "primary.main"
                          : "inherit",
                        color: bookedSeats.includes(seat) ? "#fff" : "inherit",
                      }}
                    >
                      {seat}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 2 }} />
            </Box>
          ))}
        </Grid>
      </Grid>
      {selectedSeats.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={() => handleContinue([...selectedSeats])}
        >
          Continue
        </Button>
      )}

      <Box mt={6} sx={{ position: "relative", height: 50 }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "100%",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: "#ddd",
            textAlign: "center",
            lineHeight: "50px",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Screen
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: "100%" }}
        >
          Total Price: ₹{totalPrice}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SeatBooking;
