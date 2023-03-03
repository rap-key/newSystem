import React, { useEffect, useState, useRef } from 'react'
import { Steps, Button, Form, Input, Select, message, notification } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import style from './News.module.css';
import axios from 'axios';
import { useNavigate,useParams } from "react-router";
import NewsEditor from '../../../component/news-manage/NewsEditor';
const { Option } = Select
export default function NewsUpdate(props) {
    const [current, setcurrent] = useState(0)
    const [categoryList, setcategoryList] = useState([])
    const [fromInfo, setfromInfo] = useState({})
    const [content, setContent] = useState("")
    const navigate = useNavigate();
    const params = useParams()


    const User = JSON.parse(localStorage.getItem("token"))

    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                // console.log(res);
                setfromInfo(res)
                setcurrent(current + 1)

            }).catch(error => {
                console.log(error);
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空")
            } else {
                setcurrent(current + 1)
            }
        }
    }

    const handlePrevious = () => {
        setcurrent(current - 1)
    }

    const NewsForm = useRef(null)

    useEffect(() => {
        axios.get('/categories').then(res => {
            setcategoryList(res.data);
        })
    }, [])

    useEffect(() => {
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            let { title, categoryId,content } = res.data
            NewsForm.current.setFieldsValue({
                title,
                categoryId,
                content
            })
            setContent(content)
            // console.log(content)
        })
    }, [params.id])


    const handleSave = (auditState) => {
        axios.patch(`/news/${params.id}`, {
            ...fromInfo,
            "content": content,
            "auditState": auditState,
        }).then(res => {
            navigate(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")

            notification.info({
                message: `通知`,
                description: `您可以到${auditState === 0 ? "草稿箱" : "审核列表"}中查看您的新闻`,
                placement: "bottomRight",
            })
        })
    }

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={() => navigate(-1)}
                suTitle="111" />
            <Steps
                current={current}
                items={[
                    {
                        title: '基本信息',
                        description: "新闻标题，新闻分类"
                    },
                    {
                        title: '新闻内容',
                        description: "新闻主题内容"
                    },
                    {
                        title: '新闻提交',
                        description: "保存草稿或者提交审核"
                    },
                ]}
            />

            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        ref={NewsForm}
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 20 }}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: '请输入新闻标题!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: '请选择新闻分类!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>

                    </Form>
                </div>
                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        // console.log(value);
                        setContent(value)
                    }} content={content}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}></div>
            </div>

            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handleSave(0)}>保存草稿</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
            </div>
        </div>
    )
}
