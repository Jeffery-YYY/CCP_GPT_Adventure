import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // 蓝色
    },
    secondary: {
      main: "#ff4081", // 粉色
    },
    background: {
      default: "#f5f5f5", // 背景灰色
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h3: {
      fontWeight: 700,
    },
    body2: {
      color: "#555", // 修改默认的 `body2` 文本颜色
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px", // 圆角卡片
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // 阴影
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // 禁用全大写
        },
      },
    },
  },
});

export default theme;