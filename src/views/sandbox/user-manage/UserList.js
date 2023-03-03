import React, { useEffect, useState, useRef } from 'react'
import Userform from '../../../component/user_manage/Userform';
import { Button, Table, Modal, Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal
export default function UserList() {

  const [dataSource, setdataSource] = useState([])

  const [roleList, setroleList] = useState([])

  const [regionsList, setregionsList] = useState([])

  const [open, setOpen] = useState(false);

  const [isUpdataOpen, setisUpdataOpen] = useState(false)

  const [isUpdateDisable, setisUpdateDisable] = useState(false)

  const addFrom = useRef(null)

  const updataFrom = useRef(null)

  const [current, setcurrent] = useState(null)

  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))


  useEffect(() => {

    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }

    axios.get('/users?_expand=role').then(res => {
      const list = res.data
      setdataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
      ])
    })
  }, [roleId, region, username])


  useEffect(() => {
    axios.get('/roles').then(res => {
      const list = res.data
      setroleList(list)
    })
  }, [])


  useEffect(() => {
    axios.get('/regions').then(res => {
      const list = res.data
      setregionsList(list)
    })
  }, [])




  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionsList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ''
        }
        return item.region === value
      },
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch
          checked={roleState}
          disabled={item.default}
          onChange={() => handleChange(item)}>
        </Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />}
            onClick={() => confirmMethod(item)} disabled={item.default}></Button>
          <Button
            type='primary'
            shape='circle'
            icon={< UnorderedListOutlined />}
            disabled={item.default}
            onClick={() => handleUpdate(item)}
          />
        </div >
      }
    },
  ];



  const handleUpdate = (item) => {
    setisUpdataOpen(true)
    // isUpdateVisible
    if (item.roleId === 1) {
      //禁用
      setisUpdateDisable(true)
    } else {
      // 取消禁用
      setisUpdateDisable(false)
    }
    setTimeout(() => {
      // 设定值s
      updataFrom.current.setFieldsValue(item)
    })
    setcurrent(item)
  }



  const handleChange = (item) => {
    console.log(item)
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }


  // 删除确认
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

  // 删除
  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }


  const UpdataFormOK = () => {
    updataFrom.current.validateFields().then(value => {
      console.log(value);
      setisUpdataOpen(false)
      setdataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      setisUpdateDisable(!isUpdateDisable)
      axios.patch(`/users/${current.id}`, value)
    }
    )
  }




  const addFormOK = () => {
    addFrom.current.validateFields().then(value => {
      console.log(value);
      setOpen(false)
      // 重置
      addFrom.current.resetFields()
      // 先生成ID
      axios.post(`/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        console.log(res.data)
        setdataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })

    }).catch(err => {
      console.log(err);
    })
  }



  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={item => item.id} />;
      <Modal
        open={open}
        // isAddVisible
        title="添加用户 "
        okText="确定"
        cancelText="取消"
        onCancel={() => { setOpen(false) }}
        onOk={() => addFormOK()}
      >
        <Userform regionsList={regionsList} roleList={roleList} ref={addFrom}></Userform>
      </Modal>
      <Modal
        // isUpdateVisible
        open={isUpdataOpen}
        title="更新用户 "
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setisUpdataOpen(false)
          setisUpdataOpen(!setisUpdataOpen)
        }}
        onOk={() => UpdataFormOK()}
      >
        <Userform regionsList={regionsList} roleList={roleList} ref={updataFrom} isUpdateDisable={isUpdateDisable} isUpdate={true}></Userform>
      </Modal>
    </div>
  )
}