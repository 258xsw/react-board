import { Box, Button, TextField } from '@mui/material';
import React from 'react';

function PostSearch({ keyword, onSubmit, onChangeKeyword }) {
    return (
        <Box component="form"
            onSubmit={onSubmit}
            sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}
        >
            <TextField type='search'
                size='small'
                placeholder='제목 또는 내용 검색'
                value={keyword}
                onChange={(evt) => onChangeKeyword(evt.target.value)}
                sx={{ width: 260 }} />
            <Button type='submit' variant='outlined' size='small' sx={{ borderRadius: 100 }}>
                검색
            </Button>
        </Box>
    );
}

export default PostSearch;