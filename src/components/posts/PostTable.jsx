import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import dayjs from 'dayjs'
import { Link } from 'react-router'

function PostTable({ posts }) {

    const lists = posts ? posts : [];
    return (
        <TableContainer>
            <Table>
                {/* 테이블 머릿말 */}
                <TableHead>
                    <TableRow sx={{
                        '&th': { //row 안에 있는 모든 <th>셀에 스타일 적용
                            borderBottom: '1px soild rgba(251, 104, 30, 1)',
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#ffc8dd'

                        }
                    }}>
                        <TableCell align='center' width={180}>번호</TableCell>
                        <TableCell align='center' width={300}>제목</TableCell>
                        <TableCell align='center' width={180}>작성자</TableCell>
                        <TableCell align='center' width={100}>조회수</TableCell>
                        <TableCell align='center' width={180}>작성일</TableCell>
                    </TableRow>
                </TableHead>
                {/* 테이블 본문 */}

                <TableBody>
                    {
                        lists.map(({ id, title, readCount, createdAt, author }) => (
                            <TableRow key={id}
                                hover sx={{ '&td': { fontSize: 15, borderBottom: '1px soild rgba(179, 213, 245, 1)' } }}>
                                <TableCell align='center'>{id}</TableCell>
                                <TableCell>
                                    <Typography component={Link} to={`/posts/${id}`}
                                        sx={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }} >
                                        {title}
                                    </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                    {
                                        author?.nickname && author.nickname !== '익명' ? (
                                            <Chip label={author.nickname} size='small' sx={{ borderRadius: 999, px: 2, height: 25, fontSize: 13, bgcolor: 'primary.main', color: '#fff' }} />
                                        ) : (
                                            <Typography sx={{ fontSize: 14 }}>{author?.nickname}</Typography>
                                        )
                                    }


                                </TableCell>
                                <TableCell align='center'>{readCount}</TableCell>
                                <TableCell align='center'>
                                    {/*new Date(createdAt).toLocaleString()*/}
                                    {dayjs(createdAt).format('YYYY년 MM월 DD일 HH:mm')}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                    {/*게시글이 하나도 없을 때 */}
                    {
                        lists.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align='center' sx={{ py: 5 }}>
                                    게시글이 없습니다.
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PostTable;