/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

import "./App.css";
import {
  Col,
  Row,
  Typography,
  Divider,
  Button,
  Checkbox,
  Form,
  Input,
  Upload,
  message,
  Space,
  Popover,
} from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import axios from "axios";
import { createSign } from "./helpers/createSign";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<any>();
  const [subjectImg, setSubjectImg] = useState<any>();
  const [token, setToken] = useState<string>();
  const [params, setParams] = useState({
    name: "",
    subject_type_id: 2,
    store_id: 17,
  });

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return true;
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    setSubjectImg(info.file.originFileObj);
    getBase64(info.file.originFileObj as RcFile, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const getToken = () => {
    return axios.post(
      "https://digieye.viotgroup.com/phpapi/common/home/openAuthorization",
      {
        app_id: import.meta.env.VITE_APP_ID,
        secret_key: import.meta.env.VITE_SECRET_KEY,
      }
    );
  };

  useEffect(() => {
    getToken().then((res) => {
      const { data } = res;
      setToken(data.data.token);
    });
  }, []);

  const onFinish = async () => {
    const sign = createSign(params, String(token));

    if (token && sign && subjectImg) {
      const res = await axios({
        method: "post",
        url: "https://digieye.viotgroup.com/phpapi/aiApplication/subject/addSubject",
        data: { ...params, subjectImg },
        headers: {
          "Content-Type": "multipart/form-data",
          Token: token,
          Sign: sign as any,
        },
      });

      if (res.data.code !== 1000) {
        toast.error(res.data.msg);
      } else {
        setParams({ ...params, name: "" });
        setImageUrl(null);
        toast.success(res.data.msg, {
          theme: "colored",
        });
      }

      return res;
    }
  };

  return (
    <div className="subject-container">
      <Row className="form__container">
        <Col xs={24} sm={24} md={24}>
          <Row className="header__container">
            <Col xs={24} sm={24} md={24}>
              <Typography.Text className="form__title">
                Add New Subject
              </Typography.Text>
              <Divider />
            </Col>
          </Row>
          <Row className="content__container">
            <Col xs={24} sm={24} md={24}>
              <Form
                name="basic"
                initialValues={{ store_id: "ST Demo" }}
                autoComplete="off"
                {...formItemLayout}
                onFinish={onFinish}
              >
                <Form.Item label="Select Picture" required>
                  <Form.Item
                    name="subjectImg"
                    valuePropName="subjectImg"
                    getValueFromEvent={normFile}
                    noStyle
                    style={{ width: "100px" }}
                  >
                    <Space direction="horizontal">
                      <Upload
                        accept={"image/jpeg, image/jpg"}
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="avatar"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                      <Space direction="vertical">
                        <Typography.Text>
                          Only support jpg format, file size not more than 2M,
                          picture pixel limit is 960*960, face pixel not less
                          than 120*120.
                        </Typography.Text>
                        <Space direction="horizontal">
                          <Typography.Text>Standard Example</Typography.Text>
                          <Popover
                            content={
                              <>
                                <img
                                  src="https://digieye.viotgroup.com/static/img/subject.61581497.jpg"
                                  alt="avatar"
                                  style={{
                                    width: "200px",
                                    height: "240px",
                                    objectFit: "cover",
                                  }}
                                />
                              </>
                            }
                          >
                            <img
                              src="https://digieye.viotgroup.com/static/img/subject.61581497.jpg"
                              alt="avatar"
                              style={{
                                width: "100px",
                                height: "140px",
                                objectFit: "cover",
                              }}
                            />
                          </Popover>
                        </Space>
                        <Typography.Text>
                          The face must be authentic and without retouching, the
                          white background is preferred, the face is required to
                          be clear and the light is uniform.
                        </Typography.Text>
                      </Space>
                    </Space>
                  </Form.Item>
                </Form.Item>

                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message:
                        "Must be 2 to 60 characters, can only contain letters, digits and spaces.!",
                    },
                  ]}
                >
                  <Input
                    value={params.name}
                    onChange={(e) => {
                      setParams({ ...params, name: e.target.value });
                    }}
                  />
                </Form.Item>
                <Form.Item name="store_id" label="Select Location">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="subject_type_id" label="Select Group" required>
                  <Checkbox
                    value={2}
                    style={{ lineHeight: "32px" }}
                    disabled
                    checked
                  >
                    ST
                  </Checkbox>
                </Form.Item>
              </Form>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button type="primary" onClick={onFinish}>
                Add Subject
              </Button>
            </Col>
          </Row>
        </Col>
        <ToastContainer />
      </Row>
    </div>
  );
};
export default App;
