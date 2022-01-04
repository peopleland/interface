import Layout from "../components/layout";
import styles from "../styles/Profile.module.css"
import {Button, Col, Form, Input, message, Row, Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {useRequest} from "ahooks";
import {UserGetProfile, UserPutProfile} from "../app/backend/user/User";
import {useCallback, useEffect, useMemo} from "react";
import {getJWTExpired, getJWTLocalStorage, saveUserProfile} from "../lib/helper";
import {useWeb3React} from "@web3-react/core";
import {useRouter} from "next/router";
import {actionModal} from "../store/walletModal";
import {actionSign} from "../store/signAction";
import {useAppDispatch} from "../store/hooks";

const Profile = () => {
  const router = useRouter()
  const {active} = useWeb3React()
  const dispatch = useAppDispatch();

  const {data, error, loading, refresh, run} = useRequest(UserGetProfile, {manual: true})

  useEffect(() => {
    if (!active) {
      dispatch(actionModal({visible: true, thenSign: true, callback: "/profile"}))
      return
    }
    if (getJWTExpired() || !getJWTLocalStorage()) {
      dispatch(actionSign({action: true, callback: "/profile"}))
      return
    }
    run()
  }, [active, dispatch, router, run])

  const [form] = Form.useForm();
  useEffect(() => {
    if (data) {
      saveUserProfile(data)
      form.setFieldsValue({
        name: data.name
      })
    }
  }, [data, form])

  const submitForm = useCallback(async (values) => {
    await UserPutProfile({name: values.name})
    await refresh()
    message.success("Profile saved successfully!")
  }, [refresh])

  return useMemo(() => {
    return <Layout title="Profile" >
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={!!error || loading}>
        <Row justify={"center"}>
          <Col span={12}>
            <div className={styles.profile}>
              <div className={styles.title}>Profile Settings</div>
              <Form form={form} layout={"vertical"} className={styles.form} onFinish={submitForm}>
                <Form.Item label="Username" name="name" rules={[
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
  }, [error, form, loading, submitForm])
}

export default Profile
