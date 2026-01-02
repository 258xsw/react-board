import { Stack, Box, Paper, Typography } from '@mui/material'
import PostFormFields from '../../components/posts/PostFormFields';
import PostFormImage from '../../components/posts/PostFormImage';
import PostFormSubmit from '../../components/posts/PostFormSubmit';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, fetchPostsDetail, updatePost } from '../../api/postApi'
import { useNavigate, useParams } from 'react-router';
import { uploadImage } from '../../api/fileApi'
import Loader from '../../components/common/Loader'
import ErrorMessage from '../../components/common/ErrorMessage'

// props mode가 create: 새 글 작성, edit: 글 수정
function PostForm({ mode }) {

    const isEdit = mode === 'edit'; // true면 수정 모드, false면 작성 모드
    const queryClient = useQueryClient(); // React Query에서 캐시 무효화 할 때 사용 - 생성 성공했을 때 캐시를 다시 불러와줘야 함
    const navigate = useNavigate(); // 페이지 이동할 때 쓰는 훅
    const { id } = useParams(); // URL에서 :id같은 동적 파라미터 값을 가져옴
    const postId = Number(id); // 문자열 → 숫자

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [imageName, setImageName] = useState("")

    // Api 관련 TanStack Query =================================
    // 생성 Mutation
    const createMutation = useMutation({
        mutationFn: createPost,
        // 서버에서 데이터 저장 -> 성공(id 생성)
        onSuccess: (payload) => { // 서버에 저장된 데이터의 id를 불러와 적용
            // 캐시 무효화 후 데이터 다시 불러옴
            queryClient.invalidateQueries({ queryKey: ['posts'] });

            // 이동 (홈으로 갈건지, 입력한 정보 볼건지 등)
            navigate(`/posts/${payload.id}`);
        },
        onError: () => {
            alert('게시글 등록에 실패했습니다.');
        }
    });

    // 수정 모드일 때 기존 데이터 가져오기
    const { data: post, isLoading, isError } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => fetchPostsDetail(postId),
        enabled: isEdit // isEdit가 true 수정일 때만 이 함수 조회
    })



    // 수정 Mutation
    const updateMutation = useMutation({
        mutationFn: (payload) => updatePost(postId, payload),
        onSuccess: (update) => { // res.data가 이 update가 되
            // 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            // 상세 내용 무효화
            queryClient.invalidateQueries({ queryKey: ['posts', postId] });
            // 이동
            navigate(`/posts/${update.id}`);
        },
        onError: () => {
            alert('게시글 등록에 실패했습니다.');
        }
    });

    // side effect: 렌더링 후 하는 부가 작업
    // useEffect(() => {},[]); 콜백함수, [변경값] 기본 형태
    useEffect(() => {
        if (isEdit && post) { // 수정 상태 && 데이터가 있음
            setTitle(post.title);
            setContent(post.content);
            setImageUrl(post.imageUrl);
        }
    }, [isEdit, post]); // [isEdit, post]의 상태가 변경되면 업데이트


    //이미지 업로드 Mutation
    const uploadMutation = useMutation({
        mutationFn: (file) => uploadImage(file),
        onSuccess: (result) => {
            setImageUrl(result.imageUrl)
        },
        onError: () => {
            alert('이미지 업로드 실패');
        }
    });
    if (isEdit && isLoading) return <Loader />
    if (isEdit && isError) return <ErrorMessage error={error} />


    //=========== 이벤트 핸들러 =================================
    //이미지 업로드
    const handleChangeImage = async (evt) => {
        const file = evt.target.files?.[0];
        if (!file) return;

        setImageName(file.name);

        if (file.size > 5 * 1024 * 1024) {
            alert('이미지는 5MB 이하만 가능합니다.');
            return;
        }

        uploadMutation.mutate(file);
        /*
                try {
                    setUploading(true);
                    const result = await uploadImage(file);
                    console.log("upload result =", result);
                    console.log("imageUrl in result =", result?.imageUrl);
        
                    setImageUrl(result.imageUrl);
                }
                catch (err) {
        
                    console.error(err);
                    console.log("status:", err?.response?.status);
                    console.log("data:", err?.response?.data);
                    alert('이미지 업로드에 실패했습니다.');
                }
                finally {
                    setUploading(false);
                }
                    */

    }

    // 폼 전송
    const handleSubmit = (evt) => {
        evt.preventDefault();

        const payload = {
            title: title.trim(),
            content: content.trim(),
            imageUrl: imageUrl || null
        }

        // 검증
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용은 필수입니다.');
            return; // 빠져나올 수 있게
        }

        //이미지 업로드 중이면 저장 막기
        if (uploadMutation.isPending) {
            alert("이미지 업로드 중입니다.");
            return;
        }
        // 받은 props에 따라 생성/수정 mutation 호출
        if (isEdit) {
            updateMutation.mutate(payload);
        } else {
            createMutation.mutate(payload);
        }
    }

    //=========================================================

    return (
        <Box>
            <Paper sx={{
                width: '100%',
                borderRadius: 3,
                px: 4,
                py: 3,
                boxShadow: '0 16px 40px rgba(0,0,0,0.07)'
            }}>
                {/* 제목: 새 글 작성 / 글 수정 */}
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 3 }}>
                    {isEdit ? '게시글 수정' : '새 글 작성'}
                </Typography>

                <Box component='form' onSubmit={handleSubmit}>
                    <Stack spacing={2.5}>
                        {/* 입력 필드 */}
                        <PostFormFields
                            title={title}
                            content={content}
                            onChangeTitle={setTitle}
                            onChangeContent={setContent} />

                        {/* 이미지 업로드 */}
                        <PostFormImage
                            handleChangeImage={handleChangeImage}
                            uploading={updateMutation.isPending}
                            imageName={imageName}
                        />

                        {/* 등록 / 수정 버튼 */}
                        <PostFormSubmit isEdit={isEdit} />

                    </Stack>
                </Box>

            </Paper>
        </Box>
    );
}

export default PostForm;