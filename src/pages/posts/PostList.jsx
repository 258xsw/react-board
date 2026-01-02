import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../../api/postApi';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import PostSearch from '../../components/posts/PostSearch';
import PostTable from '../../components/posts/PostTable';
import PagePagination from '../../components/posts/PagePagination';
import { useMe } from '../../hooks/useMe';

function PostList() {
    // 페이지네이션, page 상태 관리
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState('');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['posts', page, keyword],
        queryFn: () => fetchPosts({ page, size: 10, keyword }),
        placeholderData: keepPreviousData, // 페이지 전환 시 기존 데이터 유지
    });

    const { data: me, isLoading: meIsLoading } = useMe();

    // ✅ 로딩/에러 처리: 첫 번째 코드처럼
    if (isLoading) return <Loader />;
    if (isError) return <ErrorMessage error={error} />;

    const { content, totalPages } = data ?? { content: [], totalPages: 0 };

    // 검색
    const handleSearch = (evt) => {
        evt.preventDefault();
        setPage(0);
    };

    // ✅ 페이지 이동: 버그 수정 (Math.max 사용)
    const handlePrev = () => {
        setPage((prev) => Math.max(prev - 1, 0));
    };

    // ✅ 페이지 이동: prev_ 오타 수정
    const handleNext = () => {
        setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
    };

    return (
        <Box>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    px: 4,
                    py: 3,
                    boxShadow: '0 16px 40px rgba(0,0,0, 0.07)',
                }}
            >
                {/* 제목 */}
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 24, mb: 3 }}>
                    게시글 목록
                </Typography>

                {/* 검색 */}
                <PostSearch
                    keyword={keyword}
                    onSubmit={handleSearch}
                    onChangeKeyword={setKeyword}
                />

                {/* 테이블 */}
                <PostTable posts={content} />

                {/* 페이지네이션 + 새 글 버튼 */}
                <PagePagination
                    page={page}
                    totalPages={totalPages}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    logined={!meIsLoading && !!me}
                />
            </Paper>
        </Box>
    );
}

export default PostList;
