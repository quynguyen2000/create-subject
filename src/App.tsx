/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

import "./App.css";
import {
  Col,
  Row,
  Typography,
  Button,
  Form,
  Input,
  Upload,
  message,
  Space,
  Popover,
  Card,
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
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<any>();
  const [subjectImg, setSubjectImg] = useState<any>();
  const [token, setToken] = useState<string>();
  const [name, setName] = useState<string>("");

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

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Chọn Ảnh</div>
    </div>
  );

  const getToken = async () => {
    const response = await axios.post(
      "https://digieye.viotgroup.com/phpapi/common/home/openAuthorization",
      {
        app_id: import.meta.env.VITE_APP_ID,
        secret_key: import.meta.env.VITE_SECRET_KEY,
      }
    );
    const { data } = response;
    setToken(data.data.token);
  };

  useEffect(() => {
    getToken();
  }, []);

  const onFinish = async () => {
    const params = {
      subject_type_id: 2,
      store_id: 17,
      name: name,
    };
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
        setName("");
        setImageUrl(null);
        form.resetFields();
        toast.success(res.data.msg, {
          theme: "colored",
        });
      }

      return res;
    }
  };

  return (
    <div className="subject-container">
      <Card className="form__container" title="Thêm nhân viên mới">
        <Form
          form={form}
          name="basic"
          initialValues={{ store_id: "NISSEN" }}
          autoComplete="off"
          {...formItemLayout}
          onFinish={onFinish}
        >
          <Row gutter={16} style={{ padding: "2rem 2rem 0 2rem" }}>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={6}
              style={{
                width: "100%",
              }}
            >
              <Space direction="vertical" className="upload-space">
                <Row style={{ paddingBottom: "40%", height: "100%" }}>
                  <Typography.Text>
                    <span style={{ color: "#ff4d4f", margin: "5px" }}>*</span>
                    Tên nhân viên:
                  </Typography.Text>
                </Row>
                <Upload
                  accept={"image/jpeg, image/jpg"}
                  name="file"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        borderRadius: "5px",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Space>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18}>
              <Row gutter={32}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Typography.Text>
                    Chỉ hỗ trợ định dạng jpg, kích thước tệp không quá 2M, giới
                    hạn pixel hình ảnh là 960 * 960, pixel khuôn mặt không ít
                    hơn 120*120.
                  </Typography.Text>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Row gutter={16} style={{ padding: "8px" }}>
                    <Col
                      md={24}
                      lg={10}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography.Text>Ví dụ tiêu chuẩn</Typography.Text>
                    </Col>
                    <Col md={24} lg={14}>
                      <Popover
                        content={
                          <>
                            <img
                              src="https://digieye.viotgroup.com/static/img/subject.61581497.jpg"
                              alt="avatar"
                              style={{
                                width: "220px",
                                height: "260px",
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
                            width: "140px",
                            height: "180px",
                            objectFit: "cover",
                            margin: "2rem",
                          }}
                        />
                      </Popover>
                    </Col>
                  </Row>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Typography.Text>
                    Khuôn mặt phải chân thực và không qua chỉnh sửa, ưu tiên nền
                    trắng, khuôn mặt yêu cầu rõ ràng và ánh sáng đồng đều.
                  </Typography.Text>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item
                label="Tên nhân viên"
                name="name"
                rules={[
                  {
                    required: true,
                    message:
                      "Must be 2 to 60 characters, can only contain letters, digits and spaces.!",
                  },
                ]}
                style={{ marginTop: "3rem" }}
              >
                <Input
                  placeholder="Nhập tên nhân viên"
                  value={name}
                  onChange={(value) => setName(value.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item name="store_id" label="Chọn địa điểm">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row gutter={16} justify="center" style={{ marginTop: "2rem" }}>
          <Button type="primary" onClick={onFinish}>
            Thêm Nhân Viên
          </Button>
        </Row>

        <ToastContainer />
      </Card>
    </div>
  );
};
export default App;
