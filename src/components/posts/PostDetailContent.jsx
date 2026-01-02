import { Box, Divider, Typography } from '@mui/material';
import React from 'react';

function PostDetailContent({ post, apiBasic }) {

  const { content, imageUrl } = post;
  const imageSrc = imageUrl ? `${apiBasic}${imageUrl}` : null;

  return (
    <>
      {
        imageSrc && (
          <Box>
            <img src={imageSrc} alt='이미지를 찾을 수 없습니다.' style={{ maxWidth: 400, display: 'block' }} />
          </Box>
        )
      }
      <Typography sx={{ p: 2, lineHeight: 1.6, mb: 4 }}>
        {content}
      </Typography>

      <Divider sx={{ my: 2 }} />
    </>
  );
}

export default PostDetailContent;