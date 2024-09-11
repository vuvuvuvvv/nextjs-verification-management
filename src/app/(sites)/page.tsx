import DeviceInfo from '@/components/DeviceInfo';
import { Metadata } from 'next'
// export const metadata: Metadata = {
//     title: "Trang chủ",
// }

export default function Home() {
  return (
    <>
      <h2>Trang chủ</h2>
      <DeviceInfo />
    </>
  );
}
