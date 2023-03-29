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
import {
  CloseOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons/lib/icons";
import { useEffect, useState } from "react";
import { getDish, getDrink } from "../../API";
import axios from "axios";

function Menu() {
  const [loading, setLoading] = useState(false);
  const [dataDish, setDataDish] = useState([]);
  const [dataDrink, setDataDrink] = useState([]);
  const [editDish, setEditDish] = useState(false);
  const [editDrink, setEditDrink] = useState(false);
  const [isModalDish, setIsModalDish] = useState(false);
  const [isModalDrink, setIsModalDrink] = useState(false);

  const handleEditDish = () => {
    setEditDish(!editDish);
  };

  const handleEditDrink = () => {
    setEditDrink(!editDrink);
  };

  const showModalDish = () => {
    setIsModalDish(true);
  };

  const showModalDrink = () => {
    setIsModalDrink(true);
  };

  const handleOkDish = () => {
    setIsModalDish(false);
  };

  const handleCancelDish = () => {
    setIsModalDish(false);
  };

  const handleOkDrink = () => {
    setIsModalDrink(false);
  };

  const handleCancelDrink = () => {
    setIsModalDrink(false);
  };

  const { confirm } = Modal;

  const removeDish = async (id) => {
    confirm({
      title: "Do you want to delete this dish?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        axios.delete(`http://localhost:3000/dish/${id}`).then(getDataDish());
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const removeDrink = async (id) => {
    confirm({
      title: "Do you want to delete this drink?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        axios.delete(`http://localhost:3000/drink/${id}`).then(getDataDrink());
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const getDataDish = () => {
    setLoading(true);
    getDish().then((res) => {
      setDataDish(res.data);
      setLoading(false);
    });
  };

  const getDataDrink = () => {
    setLoading(true);
    getDrink().then((res) => {
      setDataDrink(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getDataDish();
  }, []);

  useEffect(() => {
    getDataDrink();
  }, []);

  return (
    <Space size={20} direction="vertical" style={{ marginRight: 10 }}>
      <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Typography.Title level={4}>Dish</Typography.Title>
        <Space style={{ flexDirection: "row", marginTop: 20 }}>
          {editDish ? (
            <Button type="primary" danger onClick={handleEditDish}>
              Done
            </Button>
          ) : (
            <Button type="primary" onClick={handleEditDish}>
              Edit
            </Button>
          )}
          <Button type="primary" onClick={showModalDish}>
            Create
          </Button>
        </Space>
      </Layout>
      <Modal
        title="Add new Dish"
        open={isModalDish}
        onOk={handleOkDish}
        onCancel={handleCancelDish}
      >
        <span>Image</span>
        <Upload>
          <Button style={{ margin: 10 }}>Upload</Button>
        </Upload>
        <Input style={{ marginBottom: 5 }} placeholder="Name"></Input>
        <Input style={{ marginBottom: 5 }} placeholder="Price"></Input>
        <Input style={{ marginBottom: 5 }} placeholder="Description"></Input>
        <Input style={{ marginBottom: 5 }} placeholder="Discount"></Input>
      </Modal>

      {editDish ? (
        <Table
          loading={loading}
          columns={[
            {
              title: "Image",
              dataIndex: "image",
              render: (link) => {
                return <Avatar size={70} src={link} />;
              },
            },
            {
              title: "Title",
              dataIndex: "title",
            },
            {
              title: "Price",
              dataIndex: "price",
              render: (value) => <span>${value}</span>,
            },
            {
              title: "Description",
              dataIndex: "description",
            },
            {
              title: "Discount",
              dataIndex: "discount",
              render: (value) => <span>{value}%</span>,
            },
            {
              title: "Delete",
              dataIndex: "id",
              render: (id) => {
                return (
                  <Tooltip>
                    <Button
                      onClick={() => removeDish(id)}
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
          dataSource={dataDish}
          pagination={{
            pageSize: 5,
          }}
        ></Table>
      ) : (
        <Table
          loading={loading}
          columns={[
            {
              title: "Image",
              dataIndex: "image",
              render: (link) => {
                return <Avatar size={70} src={link} />;
              },
            },
            {
              title: "Title",
              dataIndex: "title",
            },
            {
              title: "Price",
              dataIndex: "price",
              render: (value) => <span>${value}</span>,
            },
            {
              title: "Description",
              dataIndex: "description",
            },
            {
              title: "Discount",
              dataIndex: "discount",
              render: (value) => <span>{value}%</span>,
            },
          ]}
          dataSource={dataDish}
          pagination={{
            pageSize: 5,
          }}
        ></Table>
      )}
      <Layout style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Typography.Title level={4}>Drink</Typography.Title>
        <Space style={{ flexDirection: "row", marginTop: 20 }}>
          {editDrink ? (
            <Button type="primary" danger onClick={handleEditDrink}>
              Done
            </Button>
          ) : (
            <Button type="primary" onClick={handleEditDrink}>
              Edit
            </Button>
          )}
          <Button type="primary" onClick={showModalDrink}>
            Create
          </Button>
        </Space>
      </Layout>
      <Modal
        title="Add new Drink"
        open={isModalDrink}
        onOk={handleOkDrink}
        onCancel={handleCancelDrink}
      >
        <span>Image</span>
        <Upload>
          <Button style={{ margin: 10 }}>Upload</Button>
        </Upload>
        <Input style={{ marginBottom: 5 }} placeholder="Name"></Input>
        <Input style={{ marginBottom: 5 }} placeholder="Price"></Input>
        <Input style={{ marginBottom: 5 }} placeholder="Description"></Input>
        <Input style={{ marginBottom: 5 }} placeholder="Discount"></Input>
      </Modal>
      {editDrink ? (
        <Table
          loading={loading}
          columns={[
            {
              title: "Image",
              dataIndex: "image",
              render: (link) => {
                return <Avatar size={70} src={link} />;
              },
            },
            {
              title: "Title",
              dataIndex: "title",
            },
            {
              title: "Price",
              dataIndex: "price",
              render: (value) => <span>${value}</span>,
            },
            {
              title: "Description",
              dataIndex: "description",
            },
            {
              title: "Discount",
              dataIndex: "discount",
              render: (value) => <span>{value}%</span>,
            },
            {
              title: "Delete",
              dataIndex: "id",
              render: (id) => {
                return (
                  <Tooltip>
                    <Button
                      onClick={() => removeDrink(id)}
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
          dataSource={dataDrink}
          pagination={{
            pageSize: 5,
          }}
        ></Table>
      ) : (
        <Table
          loading={loading}
          columns={[
            {
              title: "Image",
              dataIndex: "image",
              render: (link) => {
                return <Avatar size={70} src={link} />;
              },
            },
            {
              title: "Title",
              dataIndex: "title",
            },
            {
              title: "Price",
              dataIndex: "price",
              render: (value) => <span>${value}</span>,
            },
            {
              title: "Description",
              dataIndex: "description",
            },
            {
              title: "Discount",
              dataIndex: "discount",
              render: (value) => <span>{value}%</span>,
            },
          ]}
          dataSource={dataDrink}
          pagination={{
            pageSize: 5,
          }}
        ></Table>
      )}
    </Space>
  );
}
export default Menu;
