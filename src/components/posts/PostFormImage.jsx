import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';

function PostFormImage({ handleChangeImage, uploading, imageName }) {
    return (
        <Box>
            <Stack direction='row' alignItems='center' spacing={2} mb={1}>
                <Button variant='outlined' component='label' size='small' disabled={uploading}>
                    이미지 선택
                    <input type='file' accept='image/*' hidden onChange={handleChangeImage} />
                </Button>
                {uploading && <Typography>업로드 중...</Typography>}
                {!uploading && imageName && <Typography>{imageName}</Typography>}
            </Stack>
        </Box>
    );
}

export default PostFormImage;