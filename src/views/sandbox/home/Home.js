import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import 'antd/dist/reset.css';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as Echarts from 'echarts'
import _ from "lodash"
const { Meta } = Card;
export default function Home() {
  const [viewList, setviewList] = useState([])
  const [satrList, setsatrList] = useState([])
  const [open, setOpen] = useState(false);
  const [allList, setallList] = useState([])
  const [pieChart, setpieChart] = useState(null)
  const pieRef = useRef()
  const barRef = useRef()
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
      setviewList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=star&_limit=6").then(res => {
      setsatrList(res.data)
    })
  }, [])


  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      // lodash.groupBy以category.title进行分组
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])


  const renderBarView = (obj) => {
    // 放到barRef这个容器中
    var myChart = Echarts.init(barRef.current);
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45",
          // 设置为0表示强制显示所有标签
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [{
        name: '数量',
        type: 'bar',
        data: Object.values(obj).map(item => item.length)
      }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    // 给window绑定resize
    window.onresize = () => {
      myChart.resize()
    }
  }
  const renderPieView = (obj) => {
    //数据处理工作
    // 筛选出该作者发布的新闻
    var currentList = allList.filter(item => item.author === username)
    var groupObj = _.groupBy(currentList, item => item.category.title)
    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }
    var myChart;
    if (!pieChart) {
      // 只做一次初始化
      myChart = Echarts.init(pieRef.current);
      setpieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: '纯属虚构',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    option && myChart.setOption(option);
  }


  const { username, region, role: { roleName }
  } = JSON.parse(localStorage.getItem("token"))

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={viewList}
              renderItem={(item) => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={satrList}
              renderItem={(item) => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="" bordered={false}>
            <Card
              style={{
                padding: "0px",
                margin: "0px"

              }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <SettingOutlined key="setting" onClick={() => {
                  setTimeout(() => {
                    renderPieView()
                  }, 0);
                  setOpen(true)
                }} />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                title={username}
                description={
                  <div>
                    <b>{region ? region : "全球"}</b>
                    <span style={
                      { paddingLeft: "30px" }
                    }>{roleName}</span>
                  </div>
                }
              />
            </Card>
          </Card>
        </Col>
      </Row>

      <Drawer
        width='500px'
        title="个人新闻分类"
        placement="right"
        closable={true}
        onClose={() => {
          setOpen(false)
        }}
        open={open}
      >
        <div ref={pieRef} style={{
          width: '100%',
          height: "400px",
          marginTop: "30px"
        }}></div>
      </Drawer>

      <div ref={barRef} style={{ width: '100%', height: "400px", marginTop: "30px" }}></div>

    </div>
  )
}
