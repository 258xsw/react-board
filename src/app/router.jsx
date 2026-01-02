//라우터 트리 + loader
import { createBrowserRouter, Navigate } from 'react-router'
import AppLayout from '../layouts/AppLayout';
import PostList from '../pages/posts/PostList';
import PostForm from '../pages/posts/PostForm';
import PostDetail from '../pages/posts/PostDetail';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                //사용자가 /로 들어오면 자동으로 /posts로 이동
                element: <Navigate to="posts" replace />
            },
            {
                path: 'posts',
                element: <PostList />
            },
            {
                path: 'posts/new',
                //PostForm 컴포넌트가 mode를 props로 받아 create면 새 글 작성
                element: <PostForm mode="create" />
            },
            {
                path: 'posts/:id', //:id 동적 파라미터, useParams() 훅으로 id 값을 가져옴
                element: <PostDetail />
            },
            {
                path: 'posts/:id/edit',
                element: <PostForm mode="edit" />
            },
            {
                path: 'auth/login',
                element: <LoginPage />
            },
            {
                path: 'auth/register',
                element: <RegisterPage />
            }
        ]
    }
]);