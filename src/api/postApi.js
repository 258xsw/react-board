//postApi.js
import { api } from "./api";
//게시글 목록(조회), PostList.jsx -> posts -> ({바로 매개변수 구조분해 + 기본값})
export async function fetchPosts({ page = 0, size = 10, keyword = '' }) {

    const params = { page, size };

    if (keyword && keyword.trim() !== '') params.keyword = keyword;
    //axios.get(url, {params}); GET 요청을 보낼 때 Axios가 자동으로 쿼리 스트링을 붙여줌
    const res = await api.get(`/api/posts`, { params });
    return res.data; //서버에서 받은 데이터를 JSON으로 반환
}
//게시글 상세 내용, PostDetail.jsx
export async function fetchPostsDetail(id) {
    const res = await api.get(`/api/posts/${id}`);
    return res.data;
}

//게시글 생성
export async function createPost(payload) {
    const res = await api.post(`/api/posts`, payload);
    return res.data;

}

//게시글 수정
export async function updatePost(id, payload) {
    const res = await api.put(`/api/posts/${id}`, payload);
    return res.data;
}

//게시글 삭제
export async function deletePost(id) {
    await api.delete(`api/posts/${id}`);
}