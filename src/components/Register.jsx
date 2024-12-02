import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import axios from "axios";

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export default function Register() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/register`,
        {
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
        }
      );
      console.log("Registration successful:", response.data);
      // Here you can add redirect logic
    } catch (err) {
      console.error(
        "Registration failed:",
        err.response ? err.response.data : err.message
      );
    }
  };

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card
          variant="outlined"
          sx={{ padding: 4, margin: "auto", minWidth: 400 }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              id="name"
              type="text"
              name="name"
              label="Name"
              fullWidth
              required
            />
            <TextField
              id="email"
              type="email"
              name="email"
              label="Email"
              fullWidth
              required
            />
            <TextField
              id="password"
              type="password"
              name="password"
              label="Password"
              fullWidth
              required
            />
            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
          </Box>
        </Card>
      </SignUpContainer>
    </React.Fragment>
  );
}
