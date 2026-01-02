import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, //실패시 재시도 횟수
      staleTime: 1000 * 60 * 5 //데이터 유지 시간
    }
  }
});

//mui 스타일 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffafcc'
    },
    secondary: {
      main: '#5797d7ff'
    }
  },
  typography: {

    fontFamily: ["Gugi", "Bagel Fat One", "Moirai One", "Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "Roboto", "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "sans-serif"].join(',')
  }
})

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>

)
