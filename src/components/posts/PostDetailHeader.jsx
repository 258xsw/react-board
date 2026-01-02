import React from 'react';
import { Box, Chip, Typography } from '@mui/material'

function PostDetailHeader({ post }) {
  const { title, readCount, createdAt, updatedAt, author } = post;

  return (
    <>
      <Typography variant='h6' sx={{ fontWeight: 700, mb: 1.5 }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Typography variant='body2' component="div">
          작성자:
          <Chip label={author.nickname} size='small' sx={{ ml: 0.5, px: 1.5, borderRadius: 999, bgcolor: 'primary.main', color: '#fff' }} />
          <span>조회수: {readCount}</span>
        </Typography>
      </Box>
      <Typography variant='caption' sx={{ color: '#666' }}>
        작성일 : {new Date(createdAt).toLocaleString()}
        {updatedAt && <> | 수정일 : {new Date(updatedAt).toLocaleString()} </>}
      </Typography>

    </>
  );
}

export default PostDetailHeader;