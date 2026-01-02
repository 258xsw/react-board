// useMe.js
import { useQuery } from "@tanstack/react-query"
import { fetchMe, getToken, ME_QUERY_KEY } from "../api/authApi";

// 로그인한 사용자 정보를 가져오는 커스텀 훅
export function useMe() {
    const token = getToken();

    return useQuery({
        queryKey: ME_QUERY_KEY,
        queryFn: fetchMe,
        enabled: !!token, // 토큰이 있을 때만 실행, 그냥 넣으면 문자열인데 부정연산자 붙이면 true/false가 나옴 -> 부정의 부정으로 
        retry: false, // 재시도 x -> 인증과 관련되어 실패해도 재시도는 하지 않는다. 보안이 뚫릴 수도 있음
        staleTime: 1000 * 60
    });
}