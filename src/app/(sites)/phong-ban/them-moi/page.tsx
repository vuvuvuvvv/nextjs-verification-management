import { getUsersByPhongBanStatus } from "@/app/api/phongban/route"


export default async function createPhongBanPage(){
    const res = await getUsersByPhongBanStatus();


    return <></>
}