import { Box, Button } from '@mui/material';
import React from 'react';

function PostFormSubmit({ isEdit }) {
    return (
        <Box>
            <Button type='submit' variant='contained' sx={{ fontWeight: 500, color: 'inherit' }}>
                {isEdit ? "수정" : "등록"}
            </Button>
        </Box>
    );
}

export default PostFormSubmit;