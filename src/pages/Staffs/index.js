import {
  Avatar,
  Button,
  Input,
  Layout,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import { useEffect, useState } from "react";
import {
  CloseOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
} from "@ant-design/icons/lib/icons";
import axios from "axios";

function Staffs() {
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(false);
  const [dataStaffs, setDataStaffs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [id, setId] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sex, setSex] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCf, setPasswordCf] = useState("");

  const [resID, setResID] = useState("");
  useEffect(() => {
    setResID(localStorage.getItem("resID"));
  }, []);

  const { confirm } = Modal;

  const removeStaff = async (id) => {
    confirm({
      title: "Do you want to delete this staff?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        axios
          .delete(`https://tablenow.onrender.com/api/staffs/delete/${id}`)
          .then(() => getDataStaffs());
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const showModalStaff = () => {
    setIsModalOpen(true);
  };

  const showModalEdit = async (id) => {
    setId(id);
    setIsModalEdit(true);
    await axios
      .get(`https://tablenow.onrender.com/api/staffs/get-details/${id}`)
      .then((res) => {
        setSex(res.data.data.staffSex);
        setName(res.data.data.staffName);
        setPhone(res.data.data.staffPhone);
        setUserName(res.data.data.accountName);
      });
  };

  const handleOk = async () => {
    messageApi.open({
      type: "loading",
      content: "Creating..",
    });
    await axios
      .post("https://tablenow.onrender.com/api/staffs/create", {
        restaurantID: resID,
        staffName: name,
        staffPhone: phone,
        staffSex: sex,
        accountName: userName,
        accountPassword: password,
        confirmPassword: passwordCf,
      })
      .then((res) => {
        if (res.data.status === "ERR") {
          return message.error(res.data.message, 2.5);
        } else {
          message.success(res.data.message, 2.5);
          setIsModalOpen(false);
          getDataStaffs();
          setName("");
          setPassword("");
          setPasswordCf("");
          setPhone("");
          setSex("");
          setUserName("");
        }
      })
      .catch((err) => {
        if (err.response.data.message.includes("duplicate")) {
          return message.error(
            "User name or phone number is already available",
            2.5
          );
        }
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    getDataStaffs();
    setName("");
    setPassword("");
    setPasswordCf("");
    setPhone("");
    setSex("");
    setUserName("");
  };

  const getDataStaffs = async () => {
    setLoading(true);
    resID
      ? await axios
          .get(`https://tablenow.onrender.com/api/staffs/get-staff/${resID}`)
          .then((res) => {
            setDataStaffs(res.data.data);
            setLoading(false);
          })
          .catch((err) => {
            if (err.code === "ERR_BAD_REQUEST") {
              return setLoading(false);
            } else console.log(err);
          })
      : setLoading(true);
  };

  useEffect(() => {
    getDataStaffs();
  }, [resID]);

  const handleOkEdit = async (id) => {
    messageApi.open({
      type: "loading",
      content: "Updating..",
    });
    await axios
      .put(`https://tablenow.onrender.com/api/staffs/update/${id}`, {
        staffSex: sex,
        staffName: name,
        staffPhone: phone,
        accountName: userName,
      })
      .then((res) => {
        if (res.data.status === "ERR") {
          return message.error(res.data.message, 2.5);
        } else {
          message.success(res.data.message, 2.5);
          setIsModalEdit(false);
          getDataStaffs();
          setSex("");
          setName("");
          setPhone("");
          setUserName("");
        }
      })
      .catch((err) => {
        if (err.response.data.message.status === "ERR") {
          return message.error(err.response.data.message.message, 2.5);
        }
      });
  };

  const handleCancelEdit = () => {
    setIsModalEdit(false);
    setName("");
    setPhone("");
    setSex("");
    setUserName("");
  };

  const handleUpload = (e) => {
    if (!(e.event instanceof ProgressEvent)) return;
    let bodyFormData = new FormData();
    bodyFormData.append("staffPhoto", e.file.originFileObj);
    messageApi.open({
      type: "loading",
      content: "Uploading image..",
      duration: 2.5,
    });
    axios
      .post(`https://tablenow.onrender.com/api/staffs/upload/${id}`, bodyFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        message.success("Uploading finished", 2.5);
        getDataStaffs();
      });
  };

  return (
    <>
      {contextHolder}

      <Space size={20} direction="vertical">
        <Layout
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Typography.Title level={4}>
            Staffs (Minimum 3 staffs)
          </Typography.Title>
          <Button type="primary" onClick={showModalStaff}>
            Create
          </Button>
        </Layout>
        <Modal
          title="Add new Staff"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Select
            style={{ marginBottom: 10, width: "470px" }}
            placeholder="Select gender"
            options={[
              {
                value: "male",
                label: "Male",
              },
              {
                value: "female",
                label: "Female",
              },
            ]}
            onChange={(e) => setSex(e)}
          />
          <Input
            style={{ marginBottom: 10 }}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Input>
          <Input
            style={{ marginBottom: 10 }}
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          ></Input>
          <Input
            style={{ marginBottom: 10 }}
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          ></Input>
          <Input
            style={{ marginBottom: 10 }}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <Input
            style={{ marginBottom: 10 }}
            placeholder="Password Comfirm"
            type="password"
            value={passwordCf}
            onChange={(e) => setPasswordCf(e.target.value)}
          ></Input>
        </Modal>
        <Table
          loading={loading}
          dataSource={dataStaffs}
          columns={[
            {
              title: "Photo",
              dataIndex: "staffPhoto",
              render: (link) => {
                if (link) {
                  return <Avatar size={90} src={link} />;
                } else
                  return (
                    <Avatar
                      size={90}
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
                    />
                  );
              },
            },
            {
              title: "Name",
              dataIndex: "staffName",
            },
            {
              title: "Phone",
              dataIndex: "staffPhone",
            },
            {
              title: "User Name",
              dataIndex: "accountName",
            },
            {
              title: "Tools",
              dataIndex: "_id",
              render: (id) => {
                return (
                  <>
                    <Tooltip title="Edit">
                      <Button
                        style={{ margin: 5 }}
                        onClick={() => {
                          showModalEdit(id);
                        }}
                        type="primary"
                        shape="circle"
                        icon={<EditOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        style={{ margin: 5 }}
                        onClick={() => removeStaff(id)}
                        type="primary"
                        shape="circle"
                        danger
                        icon={<CloseOutlined />}
                      />
                    </Tooltip>
                    <Tooltip title="Upload image">
                      <Upload
                        key="upload-image"
                        showUploadList={false}
                        multiple={false}
                        onChange={handleUpload}
                      >
                        <Button
                          style={{ margin: 5 }}
                          type="primary"
                          shape="circle"
                          icon={<UploadOutlined />}
                          onClick={() => setId(id)}
                        />
                      </Upload>
                    </Tooltip>
                  </>
                );
              },
            },
          ]}
        ></Table>
        <Modal
          title="Edit"
          open={isModalEdit}
          onOk={() => handleOkEdit(id)}
          onCancel={handleCancelEdit}
        >
          <Select
            style={{ marginBottom: 10, width: "472px" }}
            defaultValue="male"
            options={[
              {
                value: "male",
                label: "Male",
              },
              {
                value: "female",
                label: "Female",
              },
            ]}
            onChange={(e) => setSex(e)}
          />
          <Input
            value={name}
            style={{ marginBottom: 10 }}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          ></Input>
          <Input
            value={phone}
            style={{ marginBottom: 10 }}
            placeholder="Phone Number"
            onChange={(e) => setPhone(e.target.value)}
          ></Input>
          <Input
            value={userName}
            style={{ marginBottom: 10 }}
            placeholder="User Name"
            onChange={(e) => setUserName(e.target.value)}
          ></Input>
        </Modal>
      </Space>
    </>
  );
}
export default Staffs;
