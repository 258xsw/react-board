export default function ErrorMessage({ error = '알 수 없는 오류 발생' }) {
    return <p style={{ color: '#f00' }}>{error?.statusText || error?.message}</p>
}