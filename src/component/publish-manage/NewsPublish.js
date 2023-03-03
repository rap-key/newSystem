import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router";
import {Modal, Button, Table,notification} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal

export default function NewsPublish(props) {
    console.log(props.dataSource)
    const navigate = useNavigate()
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title,item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          {
            props.num===1&&<Button danger onClick={()=>handlePublish(item)}>发布</Button>
          }
          {
            props.num===2&&<Button type='primary' onClick={()=>handlePutdown(item)}>下线</Button>
          }
          {
            props.num===3&&<Button danger onClick={()=>confirmMethod(item)}>删除</Button>
          }
        </div >
      }
    },
  ];


  const handlePublish=(item)=>{
    props.setdataSource(props.dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
        "publishState":2,
        "publishTime":Date.now()
      }).then(res=>{
        // navigate(`/publish-manage/published`)
        notification.info({
            message: `通知`,
            description: `您可以到[发布管理/已发布]查看您的新闻`,
            placement: "bottomRight",
          })
      })
  }
  const handlePutdown=(item)=>{
    props.setdataSource(props.dataSource.filter(data=>data.id!==item.id))
    // console.log(dataSource)
    axios.patch(`/news/${item.id}`,{
        "publishState":3,
        "publishTime":Date.now()
      }).then(res=>{
        // navigate(`/publish-manage/sunset`)
        notification.info({
            message: `通知`,
            description: `您可以到[发布管理/已下线]查看您的新闻`,
            placement: "bottomRight",
          })
      })
  }
  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除?",
      icon: <ExclamationCircleOutlined />,
      // content: "Some descriptions",
      onOk() {
        handleDelete(item);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const handleDelete=(item)=>{
    props.setdataSource(props.dataSource.filter(item=>item.id!==props.id))
    console.log(item.id);
    axios.delete(`/news/${item.id}`,{
      }).then(res=>{
        notification.info({
            message: `通知`,
            description: `您的新闻已删除`,
            placement: "bottomRight",
          })
      })
  }

  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns}
        pagination={{
          pageSize: 5,
        }} 
        rowKey={item=>item.id}/>;
    </div>
  )
}