export default function Page({ params }: { params: { serial_number: string } }) {
    return <div>My Process: {params.serial_number}</div>
}