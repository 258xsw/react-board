import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { login, setAuth } from '../../api/authApi';

function LoginPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            setAuth(data); // 토큰 저장
            await queryClient.invalidateQueries({ queryKey: ['me'] });
            navigate('/posts'); // 사용자 정보 갱신 후 이동
        },
    });

    const handleSubmit = (evt) => {
        evt.preventDefault();
        loginMutation.reset(); // 이전 오류 초기화

        const fd = new FormData(evt.currentTarget);

        const email = String(fd.get('email') ?? '').trim();
        const password = String(fd.get('password') ?? '').trim();

        loginMutation.mutate({ email, password });
    };

    const errorMessage =
        loginMutation.error?.message || '로그인에 실패했습니다.';

    return (
        <Paper
            elevation={1}
            sx={{
                width: '100%',
                borderRadius: 5,
                px: 4,
                py: 3,
                boxShadow: '0 16px 40px #5b83abff',
            }}
        >
            {/* ✅ Typography 중첩 제거: <p> 안에 <p> 방지 */}
            <Typography variant="body2" color="text.secondary" mb={3}>
                이메일과 비밀번호를 입력해주세요.
            </Typography>

            <Box component="form" sx={{ mt: 5, mb: 2 }} onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="이메일"
                        name="email"
                        type="email"
                        placeholder="test@test.com"
                        size="small"
                        required
                        autoComplete="email"
                    />
                    <TextField
                        label="비밀번호"
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        size="small"
                        required
                        autoComplete="current-password"
                    />
                </Stack>

                {loginMutation.isError && (
                    // ✅ 에러 메시지도 단독 Typography로
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        mt: 2,
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#999' },
                    }}
                    disabled={loginMutation.isPending}
                    fullWidth
                >
                    {loginMutation.isPending ? '로그인 중...' : '로그인'}
                </Button>
            </Box>
        </Paper>
    );
}

export default LoginPage;
