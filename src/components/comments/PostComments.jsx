import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createComment, fetchComments, deleteComment, updateComment } from '../../api/commentsApi';
import { useState } from 'react';
import { Alert, Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { useMe } from '../../hooks/useMe';

function PostComments({ postId }) {
    const queryClient = useQueryClient();

    // 새 댓글 입력
    const [newContent, setNewContent] = useState("");
    // 수정 모드: id를 넣을 거니까 null이 정답
    const [edit, setEdit] = useState(null);
    // 수정 댓글 입력
    const [editContent, setEditContent] = useState("");

    const { data: me, isLoading: meIsLoading } = useMe();
    const isMe = !meIsLoading && !!me;

    // me의 id 키가 혹시 다를 때도 대비 (필요 없으면 me?.id만 남겨도 됨)
    const myId = me?.id ?? me?.member?.id ?? me?.userId;

    const loginEdit = (authorId) => (
        !meIsLoading &&
        myId != null &&
        authorId != null &&
        Number(authorId) === Number(myId)
    );

    // 조회: 여기서 member -> author로 정규화
    const {
        data: comments = [],
        isLoading: isCommentsLoading,
        isError: isCommentsError
    } = useQuery({
        queryKey: ['postComments', postId],
        queryFn: async () => {
            const res = await fetchComments(postId);
            const list = res?.data ?? res; // fetchComments가 뭘 리턴하든 대응
            return (list ?? []).map((c) => ({
                ...c,
                author: c.author ?? c.member, // ✅ 이제부터 comment.author로만 씀
            }));
        }
    });

    // 작성
    const createCommentMutation = useMutation({
        mutationFn: (content) => createComment(postId, { content }),
        onSuccess: () => {
            setNewContent("");
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => alert('댓글 등록에 실패했습니다.')
    });

    // 수정
    const updateCommentMutation = useMutation({
        mutationFn: ({ commentId, content }) => updateComment(postId, commentId, { content }),
        onSuccess: () => {
            setEdit(null);
            setEditContent("");
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => alert("댓글 수정에 실패했습니다.")
    });

    // 삭제
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId) => deleteComment(postId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => alert("댓글 삭제에 실패했습니다.")
    });

    // 댓글 작성
    const handleNewComment = (evt) => {
        evt.preventDefault();
        if (!isMe) return;

        const newComment = newContent.trim();
        if (!newComment) return;

        createCommentMutation.mutate(newComment);
    };

    // 수정 시작
    const handleStartEdit = (comment) => {
        if (!loginEdit(comment.author?.id)) return;

        setEdit(comment.id);
        setEditContent(comment.content);
    };

    // 수정 저장
    const handleSaveEdit = (commentId) => {
        const editComment = editContent.trim();
        if (!editComment) return;

        updateCommentMutation.mutate({ commentId, content: editComment });
    };

    // 수정 취소
    const handleCancelEdit = () => {
        setEdit(null);
        setEditContent("");
    };

    // 삭제
    const handleDeleteComment = (commentId) => {
        const comment = comments.find((elem) => Number(elem.id) === Number(commentId));
        if (!comment) return;

        if (!loginEdit(comment.author?.id)) return;
        if (!window.confirm("댓글을 삭제하겠습니까?")) return;

        deleteCommentMutation.mutate(commentId);
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 1, fontSize: 16 }}>
                댓글
            </Typography>

            {isCommentsLoading && <Loader />}
            {isCommentsError && <ErrorMessage />}

            {/* 댓글 목록 */}
            {!isCommentsLoading && !isCommentsError &&
                comments.map((comment) => {
                    const { id, content, createdAt, author } = comment;
                    const isLogin = loginEdit(author?.id);

                    return (
                        <Paper key={id} variant='outlined' sx={{ p: 2, mb: 1.5 }}>
                            {edit === id ? (
                                <>
                                    <TextField
                                        fullWidth
                                        value={editContent}
                                        onChange={(evt) => setEditContent(evt.target.value)}
                                    />
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        <Button size='small' variant='contained' onClick={() => handleSaveEdit(id)}>저장</Button>
                                        <Button size='small' variant='outlined' color='inherit' onClick={handleCancelEdit}>취소</Button>
                                    </Stack>
                                </>
                            ) : (
                                <>
                                    <Typography>{content}</Typography>

                                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                                        <Typography variant='caption'>
                                            {author?.nickname || '익명'} - {createdAt && new Date(createdAt).toLocaleString()}
                                        </Typography>

                                        {isLogin && (
                                            <Stack direction="row" spacing={1}>
                                                <Button size='small' onClick={() => handleStartEdit(comment)}>수정</Button>
                                                <Button size='small' color='error' onClick={() => handleDeleteComment(id)}>삭제</Button>
                                            </Stack>
                                        )}
                                    </Stack>
                                </>
                            )}
                        </Paper>
                    );
                })
            }

            {/* 댓글 작성 */}
            {isMe ? (
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleNewComment}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label="댓글 내용"
                        value={newContent}
                        onChange={(evt) => setNewContent(evt.target.value)}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button type='submit' variant='contained' size='small' sx={{ borderRadius: 999 }}>
                            댓글 등록
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Alert severity='info'>댓글을 작성하려면 로그인을 해주세요.</Alert>
            )}

            <Divider sx={{ mt: 2 }} />
        </Box>
    );
}

export default PostComments;
