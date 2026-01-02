import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { register, setAuth } from '../../api/authApi';

function RegisterPage(props) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        nickname: "",
        password: "",
        rePassword: ""
    });

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: () => navigate("/posts"),
        onError: (err) => {
            console.log("register error:", err);
            alert(err?.response?.data?.message || err.message || "회원가입 실패");
        },

    })


    //이벤트 핸들러
    const handleChange = (evt) => {
        const { name, value } = evt.target;

        setForm((prev) => ({ ...prev, [name]: value })); //이전 상태 복사 후 변경된 필드만 업데이트
    }

    //데이터 전송
    const handleSubmit = (evt) => {
        console.log("payload", {
            email: form.email.trim(),
            password: form.password.trim(),
            nickname: form.nickname.trim(),
        });

        evt.preventDefault();

        //비밀번호 검증. 프론트쪽에서 검증
        if (form.password !== form.rePassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        registerMutation.mutate({
            email: form.email.trim(),
            password: form.password.trim(),
            nickname: form.nickname.trim()
        });
    }

    const errorMessage = registerMutation.error?.message || "회원가입에 실패했습니다.";

    return (
        <Container>
            <Paper elevation={1} sx={{
                width: '100%',
                borderRadius: 5,
                px: 4,
                py: 3,
                boxShadow: '0 16px 40px #5b83abff'
            }}>
                <Typography variant='h5' fontWeight='500' gutterBottom>
                    회원가입
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField label='이메일' name='email' type='email'
                            placeholder='test@test.com' size='small' required value={form.email} onChange={handleChange} />
                        <TextField label='별명' name='nickname' type='text'
                            placeholder='토마토' size='small' required value={form.nickname} onChange={handleChange} />
                        <TextField label='비밀번호' name='password' type='password'
                            placeholder='비밀번호' size='small' required value={form.password} onChange={handleChange} />
                        <TextField label='비밀번호 재확인' name='rePassword' type='password'
                            placeholder='비밀번호' size='small' required value={form.rePassword} onChange={handleChange} />

                        {
                            registerMutation.isError && (
                                <Typography variant='body2' color='error'>{errorMessage}</Typography>
                            )
                        }

                        <Button type='submit' variant='contained' sx={{
                            mt: 1, py: 1.2, borderRadius: 2,
                            textTransform: 'none', '&:hover': { backgroundColor: '#999' }
                        }} disabled={registerMutation.isPending}>{registerMutation.isPending ? '가입 중...' : '회원가입'}</Button>
                    </Stack>
                </Box>

                <Box>
                    <Typography variant='body2'>
                        계정을 가지고 있습니까? {" "}
                        <Button component={Link} to="/auth/login" size='small'>로그인</Button>
                    </Typography>
                </Box>
            </Paper>

        </Container>
    );
}

export default RegisterPage;