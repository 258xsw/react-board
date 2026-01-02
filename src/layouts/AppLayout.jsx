import { Box, Button, Container, Stack, Typography } from '@mui/material';
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router';
import { RiRobot2Line } from "react-icons/ri";
import { useQueryClient } from '@tanstack/react-query';
import { useMe } from '../hooks/useMe'
import { clearAuth } from '../api/authApi';

function AppLayout(props) {
    const queryClient = useQueryClient();
    const { data: me, isLoading: meIsLoading } = useMe();
    const navigate = useNavigate();

    //로그아웃 이벤트 핸들러
    const handleLogout = () => {
        clearAuth();
        queryClient.setQueryData(["me"], null); //즉시 UI 반영
        navigate("/posts");

    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#bde0fe' }}>
            {/* header */}
            <Box component="header" sx={{
                position: 'fixed', top: 0, zIndex: 10, bgcolor: '#a2d2ff',
                borderBottom: '1px soild #fff', width: '100%'
            }}>
                <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
                    <Box component={Link} to="/posts"
                        sx={{
                            display: 'flex',
                            alignItems: 'center', //flex 일 때 가능한 위 아래 중앙 정렬
                            textDecoration: 'none'

                        }}>
                        <Box //아이콘
                            sx={{
                                width: 40, height: 40,
                                borderRadius: '50%', //모서리 둥글게 처리
                                bgcolor: '#bde0fe',
                                display: 'grid', //바둑판 형태의 레이아웃 정렬
                                placeItems: 'center', //grid 일때만 적용 가능한 x, y 축 중앙 정렬
                                mr: 1.5
                            }}>
                            <RiRobot2Line style={{ color: '#fff', fontSize: 20 }} />
                        </Box>
                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: 30, color: '#fff', fontFamily: 'Bagel Fat One' }}>
                            게시판
                        </Typography>
                    </Box>
                    {/* 오른쪽 메뉴: 회원가입/로그인*/}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        {!meIsLoading && me ? (
                            <Button variant='text' sx={{ fontWeight: 500, color: 'inherit', fontSize: 14 }}
                                onClick={handleLogout}
                            >로그아웃</Button>
                        ) : (
                            <>

                                <Button component={Link} to="/auth/login" variant='text' sx={{ fontWeight: 500, color: 'inherit' }}>로그인</Button>
                                <Button component={Link} to="/auth/register" variant='text' sx={{ fontWeight: 500, color: 'inherit' }}>회원가입</Button>
                            </>
                        )

                        }

                    </Stack>
                </Container>
            </Box >
            {/* 자식 컴포넌트(본문) 영역 */}
            < Container maxWidth="md" sx={{ pt: 15, mb: 5 }
            }>
                <Outlet />
            </Container >
        </Box >
    );
}

export default AppLayout;