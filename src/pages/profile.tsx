import Layout from "../components/layout";
import styles from "../styles/Profile.module.css"
import {Button, Col, Form, Input, message, Row, Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {useRequest} from "ahooks";
import {UserGetProfile, UserPutProfile} from "../app/backend/user/User";
import {useCallback, useMemo, useState} from "react";

const Profile = () => {
  const {data, error, loading, refresh} = useRequest(UserGetProfile)

  const submitForm = useCallback(async (values) => {
    await UserPutProfile({name: values.name})
    await refresh()
    message.success("Profile saved successfully!")
  }, [refresh])

  return <Layout title="Profile" >
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={!!error || loading}>
      <Row justify={"center"}>
        <Col>
          <div className={styles.profile}>
            <div className={styles.title}>Profile Settings</div>
            <Form layout={"vertical"} className={styles.form} initialValues={{username: data?.name}} onFinish={submitForm}>
              <Form.Item label="Username" name="username" rules={[
                {required: true, message: "Username is required"}
              ]}>
                <Input size={'large'} placeholder="Enter username" style={{width: "320px"}} />
              </Form.Item>
              <Form.Item style={{marginTop: "60px"}}>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </Spin>
  </Layout>
}

export default Profile
