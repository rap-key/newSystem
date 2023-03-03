import NewsPublish from '../../../component/publish-manage/NewsPublish'
import usePublish from '../../../component/publish-manage/usePublish'

export default function Sunset() {
  let num = 3
  const {dataSource,setdataSource} = usePublish(num)

  return (
    <div>
      <NewsPublish dataSource={dataSource} setdataSource={setdataSource} num={num}></NewsPublish>
    </div>
  )
}
