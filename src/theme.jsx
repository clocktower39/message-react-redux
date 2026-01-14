import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff6b3d",
      contrastText: "#0f1115",
    },
    secondary: {
      main: "#33c5b5",
    },
    background: {
      default: "#0f1115",
      paper: "#1f2430",
    },
    text: {
      primary: "#f5f7fb",
      secondary: "#c9d2e3",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: -1.2,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: -0.8,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(120deg, #1b2030 0%, #141821 100%)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 12px 30px var(--shadow)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "linear-gradient(140deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
          border: "1px solid var(--border)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          padding: "8px 18px",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #ff6b3d, #ff8a4a)",
          boxShadow: "0 10px 18px rgba(255, 107, 61, 0.3)",
        },
        outlined: {
          borderColor: "var(--border)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 6,
          "&.Mui-selected": {
            backgroundColor: "rgba(255, 107, 61, 0.18)",
          },
          "&:hover": {
            backgroundColor: "rgba(255, 107, 61, 0.12)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& input": {
            color: "var(--text-0)",
          },
          "& label": {
            color: "var(--text-2)",
          },
          "& label.Mui-focused": {
            color: "var(--text-0)",
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(15, 17, 21, 0.65)",
            "& fieldset": {
              borderColor: "var(--border)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 107, 61, 0.4)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(255, 107, 61, 0.7)",
            },
          },
          "& .MuiSvgIcon-root": {
            color: "var(--text-1)",
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#171b24",
          border: "1px solid var(--border)",
        },
      },
    },
  },
});

export { theme };
