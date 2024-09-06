export default function Page({ params }: { params: { id: string } }) {
    return <div>My Process: {params.id}</div>
}