import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router';

function PagePagination({ page, totalPages, onPrev, onNext, logined }) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.6}>

                <Button sx={{ fontSize: 25 }}
                    disabled={page === 0}
                    onClick={onPrev}
                >←</Button>
                <Typography variant='body2' >
                    {1 + page} / {totalPages}
                </Typography>
                <Button sx={{ fontSize: 25 }}
                    disabled={page + 1 >= totalPages}
                    onClick={onNext}
                >→</Button>

            </Stack>
            {/* 새 글 작성 버튼 */}
            {logined &&
                <Button component={Link} to='/posts/new' variant='contained' size='small'
                    sx={{ borderRadius: 999, px: 3, fontWeight: 100, color: '#fff' }}>새 글 작성</Button>
            }
        </Stack >
    );
}

export default PagePagination;