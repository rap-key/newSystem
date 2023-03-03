import React, { forwardRef, useState, useEffect } from 'react'
import { Input, Form, Select } from 'antd'
const { Option } = Select
const Userform = forwardRef((props, ref) => {
    const [isDisable, setisDisable] = useState(false)
    useEffect(() => {
        setisDisable(props.isUpdateDisable
        )
    }, [props.isUpdateDisable])

    const { roleId, region } = JSON.parse(localStorage.getItem('token'))

    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }

    const checkRegionDisable = (item) => {
        if (props.isUpdate) {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                return true
            }
        } else {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                return item.value !== region
            }
        }
    }

    const checkRoleDisable = (item) => {
        if (props.isUpdate) {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                return true
            }
        } else {
            if (roleObj[roleId] === "superadmin") {
                return false
            } else {
                return roleObj[item.id] !== 'editor'
            }
        }
    }

    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '输入不合规!!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: '输入不合规!!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisable ? [] : [
                    {
                        required: true,
                        message: "输入不合规!!"
                    },
                ]}
            >
                <Select disabled={isDisable}>
                    {
                        props.regionsList.map(item =>
                            <Option value={item.value} key={item.id} disabled={checkRegionDisable(item)}>{item.title}</Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: '输入不合规！！！' }]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setisDisable(true)
                        ref.current.setFieldsValue({
                            region: '全球'
                        })
                    } else {
                        setisDisable(false)
                    }
                }}>
                    {
                        props.roleList.map(item =>
                            <Option value={item.id} key={item.id} disabled={checkRoleDisable(item)}>{item.roleName}</Option>

                        )
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})
export default Userform
