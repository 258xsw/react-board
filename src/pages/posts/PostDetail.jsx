import { Box, Paper } from '@mui/material';
import React from 'react';
//import PostDetailContent from './PostDetailContent';
//import PostDetailButtons from './PostDetailButtons';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePost, fetchPostsDetail } from '../../api/postApi';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import PostDetailHeader from '../../components/posts/PostDetailHeader';
import PostDetailButtons from '../../components/posts/PostDetailButtons';
import PostDetailContent from '../../components/posts/PostDetailContent';
import PostComments from '../../components/comments/PostComments';
import { useMe } from '../../hooks/useMe';

/* Url에서 id를 읽고 서버에서 해당 데이터를  가져옴
화면에 내용을 보여주고 삭제 버튼 클릭시 API 함수 호출후 목록으로 돌아감
수정 버튼 클릭시 수정 페이지 이동*/
function PostDetail() {

    const { id } = useParams();
    const postId = Number(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const apiBasic = import.meta.env.VITE_API_BASE_URL;

    const { data: me, isLoading: meIsLoading } = useMe();

    // Api 관련 Tanstack Query ====
    //상세 내용 조회
    const { data: post, isLoading, isError, error } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => fetchPostsDetail(postId)
    });

    const deleteMutation = useMutation({
        mutationFn: () => deletePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            navigate('/posts');
        },

        onError: () => {
            alert('게시글 삭제에 실패했습니다.');
        }
    });

    if (isLoading) return <Loader />
    if (isError || !post) return <ErrorMessage error={error} />

    //본인 글 확인
    const myId = me?.id;
    const authorId = post?.author?.id;
    const loginedEdit = !meIsLoading &&
        myId != null &&
        authorId != null &&
        Number(authorId) === Number(myId);

    return (
        <Box>
            <Paper sx={{
                width: '100%',
                borderRadius: 3,
                px: 4,
                py: 3,
                boxShadow: '0 16px 40px rgba(0,0,0, 0.07)'
            }}>
                {/* 머릿말: 제목, 작성자, 작성일, 수정일 등.. */}
                <PostDetailHeader post={post} />
                {/* content */}
                <PostDetailContent post={post} apiBasic={apiBasic} />

                {/* 댓글 */}
                <PostComments postId={postId} />
                {/* 수정 / 삭제 버튼 */}
                <PostDetailButtons id={postId} deleteMutation={deleteMutation} loginedEdit={loginedEdit} />
            </Paper>
        </Box>
    );
}

export default PostDetail;