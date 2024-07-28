export default function ResetPassword({ params }: { params: { token: string } }) {
    return <div>My token: {params.token}</div>
}