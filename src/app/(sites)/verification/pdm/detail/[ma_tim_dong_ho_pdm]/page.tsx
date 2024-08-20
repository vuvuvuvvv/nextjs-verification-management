export default function Page({ params }: { params: { ma_tim_dong_ho_pdm: string } }) {
    return <div>My PDM: {params.ma_tim_dong_ho_pdm}</div>
}