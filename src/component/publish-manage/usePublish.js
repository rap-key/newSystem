import axios from 'axios'
import React, { useEffect ,useState} from 'react'

export default function usePublish(type) {

const { username } = JSON.parse(localStorage.getItem("token"))

const [dataSource, setdataSource] = useState([])

useEffect(() => {
  axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
    // console.log(res.data);
    setdataSource(res.data)
  })
}, [username,type])
  return {
    setdataSource,
    dataSource
  }
}
