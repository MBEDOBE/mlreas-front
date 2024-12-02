import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export default function Login() {
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateInputs()) {
      const data = new FormData(event.currentTarget);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/threshold`,
          {
            email: data.get("email"),
            password: data.get("password"),
          }
        );
        console.log("Login successful");

        // Assuming `response.data` contains a field `token` and `role`
        const { token, role, name } = response.data;

        // Use AuthContext to set token and role
        login(token, role, name);

        // Navigate to the shared dashboard route
        navigate("/dashboard");
      } catch (err) {
        console.error(
          "Login failed:",
          err.response ? err.response.data : err.message
        );
      }
    }
  };

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card
          variant="outlined"
          sx={{ padding: 4, margin: "auto", minWidth: 400, boxShadow: 3 }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              label="Email"
              fullWidth
              required
              variant="outlined"
              autoComplete="email"
            />
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              id="password"
              type="password"
              name="password"
              label="Password"
              fullWidth
              required
              variant="outlined"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              name="remember"
              id="remember"
            />
            <Button type="submit" fullWidth variant="contained">
              Sign in
            </Button>
            <span style={{ textAlign: "center" }}>
              Don&apos;t have an account?
              <Link to="/register">Sign up</Link>
            </span>
          </Box>
        </Card>
      </SignInContainer>
    </React.Fragment>
  );
}
