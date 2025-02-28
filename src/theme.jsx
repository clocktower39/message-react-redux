import { createTheme } from "@mui/material/styles";

let theme = createTheme();

theme = createTheme(theme, {
  typography: {
    h1: {
    },
    h2: {
    },
    h3: {
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderBottomColor: "#FFF",
          "& input": {
            color: "#FFF",
          },
          "& label": {
            color: "#FFF",
          },
          "& label.Mui-focused": {
            color: "#FFF",
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#FFF",
            },
          },
          "& .MuiInput-underline:before": {
            borderBottomColor: "#FFF",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#FFF",
          },
          "& .MuiNativeSelect-select": {
            color: '#FFF',
          },
          "& .MuiNativeSelect-select option": {
            color: 'black',
          },
          "& .MuiSvgIcon-root": {
            color: '#FFF',
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: '#FFF',
          },
          "& .MuiOutlinedInput-notchedOutline:hover": {
            borderColor: '#FFF',
          }
        }
      },

    }
  },
});

export { theme };
