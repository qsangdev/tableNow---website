import {
  Avatar,
  Button,
  Input,
  Layout,
  Modal,
  Space,
  Table,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { getStaffs } from "../../API";
import {
  CloseOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons/lib/icons";

function Staffs() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { confirm } = Modal;

  const removeStaff = async (id) => {
    confirm({
      title: "Do you want to delete this staff?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        console.log("Ok", id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const showModalStaff = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getDataStaffs = () => {
    setLoading(true);
    getStaffs().then((res) => {
      setDataSource(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getDataStaffs();
  }, []);

  return (
    <Space size={20} direction="vertical">
      <Layout
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Typography.Title level={4}>Staffs</Typography.Title>
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
        <span>Photo</span>
        <Upload>
          <Button style={{ margin: 10 }}>Upload</Button>
        </Upload>
        <Input style={{ marginBottom: 5 }} placeholder="Name"></Input>
        <Input style={{ marginBottom: 5 }} placeholder="Phone"></Input>
        <Input style={{ marginBottom: 5 }} placeholder="User Name"></Input>
        <Input style={{ marginBottom: 5 }} placeholder="Password"></Input>
      </Modal>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
          },
          {
            title: "Photo",
            dataIndex: "photo",
            render: (link) => {
              return <Avatar size={70} src={link} />;
            },
          },
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Phone",
            dataIndex: "phone",
          },
          {
            title: "User Name",
            dataIndex: "userName",
          },
          {
            title: "Delete",
            dataIndex: "id",
            render: (id) => {
              return (
                <>
                  <Tooltip title="Edit">
                    <Button
                      style={{ margin: 5 }}
                      onClick={() => {}}
                      type="primary"
                      shape="circle"
                      icon={<EditOutlined />}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      style={{ margin: 5 }}
                      onClick={() => {}}
                      type="primary"
                      shape="circle"
                      danger
                      icon={<CloseOutlined />}
                    />
                  </Tooltip>
                </>
              );
            },
          },
        ]}
      ></Table>
    </Space>
  );
}
export default Staffs;
