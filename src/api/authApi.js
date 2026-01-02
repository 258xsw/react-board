//authApi.js

import { api } from "./api";

//인증 관리 api

// useMe() 커스텀 훅에서 사용
// queryKey 상수 설정.
export const ME_QUERY_KEY = ['me'];

//로컬 스토리지에서 토큰 읽어옴
export function getToken() {
    return localStorage.getItem("accessToken");

}


//로그인 성공 후 토큰 저장
export function setAuth({ accessToken }) {
    localStorage.setItem("accessToken", accessToken);
}


//로그아웃시 토큰 삭제
export function clearAuth() {
    localStorage.removeItem("accessToken");
}

//로그인한 사용자 정보 가져오기
export async function fetchMe() {
    const res = await api.get("/api/auth/myinfo");
    return res.data;
}

//로그인 요청 -> 성공하면 JWT 토큰 받음
export async function login({ email, password }) {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data; //{ accessToken : "ksdfjwp242", tokenType: "Bearer"}
}

//회원가입 요청
export async function register({ email, password, nickname }) {
    await api.post("/api/auth/signup", { email, password, nickname });
}

/*
local storage
브라우저에 데이터를 저장하는 공간
- { key-value } 값으로 데이터 저장
- 직접 삭제하기 전까진 브라우저를 닫거나 새로 고침해도 데이터 유지.
- 도메인별 저장 공간 분리
- 주로 자동 로그인, 설정 저장시 사용
*/