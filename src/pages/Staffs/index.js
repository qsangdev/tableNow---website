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
  ExclamationCircleFilled,
} from "@ant-design/icons/lib/icons";

function Staffs() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [editStaff, setEditStaff] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditStaff = () => {
    setEditStaff(!editStaff);
  };

  const showModalStaff = () => {
    setIsModalOpen(true);
  };

  const handleOkDish = () => {
    setIsModalOpen(false);
  };

  const handleCancelDish = () => {
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
      <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Typography.Title level={4}>Staffs</Typography.Title>
        <Space style={{ flexDirection: "row", marginTop: 20 }}>
          {editStaff ? (
            <Button type="primary" danger onClick={handleEditStaff}>
              Done
            </Button>
          ) : (
            <Button type="primary" onClick={handleEditStaff}>
              Edit
            </Button>
          )}
          <Button type="primary" onClick={showModalStaff}>
            Create
          </Button>
        </Space>
      </Layout>
      <Modal
        title="Add new Staff"
        open={isModalOpen}
        onOk={handleOkDish}
        onCancel={handleCancelDish}
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
      {editStaff ? (
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
                  <Tooltip>
                    <Button
                      // onClick={() => removeDish(id)}
                      type="primary"
                      shape="circle"
                      danger
                      icon={<CloseOutlined />}
                    />
                  </Tooltip>
                );
              },
            },
          ]}
        ></Table>
      ) : (
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
          ]}
        ></Table>
      )}
    </Space>
  );
}
export default Staffs;
