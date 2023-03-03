import React, { useEffect, useState } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal
export default function RightList() {
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      const list = res.data
      list[0].children = ''
      setdataSource(list)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      return: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color='yellow'>{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Popover content={<div style={{ textAlign: "center" }}>
            <Switch checked={item.pagepermisson} onChange={()=>
              switchMethod(item)
            }></Switch>
          </div>} title="页面配置项" trigger={item.pagepermisson === undefined ? '' : "click"}>
            <Button type='primary' shape='circle' icon={< EditOutlined />} disabled={item.pagepermisson === undefined} />
          </Popover>
          <Button danger shape='circle' icon={<DeleteOutlined />}
            onClick={() => confirmMethod(item)}></Button>
        </div >
      }
    },
  ];

  const switchMethod = (item)=>{
    item.pagepermisson = item.pagepermisson===1?0:1
    setdataSource([...dataSource])
    if(item.grade===1){
      axios.patch(`/rights/${item.id}`,{pagepermisson:item.pagepermisson})
    }else{
      axios.patch(`/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
    console.log(item.pagepermisson);
  }
  // 删除确认
  const deleteMethod = (item) => {
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/children/${item.id}`)
    } else {
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setdataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }
  }
  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除?",
      icon: <ExclamationCircleOutlined />,
      // content: "Some descriptions",
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5,
        }} />;
    </div>
  )
}