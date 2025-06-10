import { getUsersByPhongBanStatus } from "@lib/api/phongban"


export default async function createPhongBanPage(){
    const res = await getUsersByPhongBanStatus();


    return <></>
}