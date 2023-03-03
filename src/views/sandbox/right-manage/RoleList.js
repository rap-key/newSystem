import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal
export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const [RightList, setRightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    axios.get('/roles').then(res => {
      // console.log(res.data);
      setdataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      // console.log(res.data);
      setRightList(res.data)
    })
  }, [])
  const showModal = (item) => {
    setIsModalOpen(true);
    setcurrentRights(item.rights)
    setcurrentId(item.id)
  };
  const handleOk = () => {
    setIsModalOpen(false);
    // 同步darasource
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return{
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    })
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCheck=(checkedKeys)=>{
    setcurrentRights(checkedKeys.checked)
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      return: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' shape='circle' icon={<UnorderedListOutlined />} onClick={()=>{showModal(item)}} />
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => { confirmMethod(item) }}></Button>
        </div >
      }
    },
  ]
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
  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        rowKey={(item) => item.id}></Table>
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          onCheck={onCheck}
          checkedKeys={currentRights} 
          checkStrictly={true}       
          treeData={RightList}
        />
      </Modal>

    </div>
  )
}
