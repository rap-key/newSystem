import NewsPublish from '../../../component/publish-manage/NewsPublish'
import usePublish from '../../../component/publish-manage/usePublish'
export default function Unpublished() {
  let num = 2
  const {dataSource,setdataSource} = usePublish(num)
  return (
    <div>
      <NewsPublish dataSource={dataSource} setdataSource={setdataSource} num={num}></NewsPublish>
    </div>
  )
}
