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
  message,
} from "antd";
import {
  CloseOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
} from "@ant-design/icons/lib/icons";
import { useEffect, useState } from "react";
import axios from "axios";

function Menu() {
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(false);
  const [dataDish, setDataDish] = useState([]);
  const [dataDrink, setDataDrink] = useState([]);

  const [isModalDish, setIsModalDish] = useState(false);
  const [isModalDrink, setIsModalDrink] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);

  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const [resID, setResID] = useState("");
  useEffect(() => {
    setResID(localStorage.getItem("resID"));
  }, []);

  const showModalDish = () => {
    setIsModalDish(true);
  };

  const showModalDrink = () => {
    setIsModalDrink(true);
  };

  const showModalEdit = async (id) => {
    setId(id);
    setIsModalEdit(true);
    await axios
      .get(`http://localhost:3001/api/dish/get-details/${id}`)
      .then((res) => {
        setName(res.data.data[0].dishName);
        setPrice(res.data.data[0].dishPrice);
        setDes(res.data.data[0].dishDescribe);
        setDiscount(res.data.data[0].dishDiscount);
      });
  };

  const handleOkEdit = async (id) => {
    messageApi.open({
      type: "loading",
      content: "Updating..",
    });
    await axios
      .put(`http://localhost:3001/api/dish/update/${id}`, {
        dishName: name,
        dishDescribe: des,
        dishPrice: price,
        dishDiscount: discount,
      })
      .then((res) => {
        if (res.data.status === "ERR") {
          return message.error(res.data.message, 2.5);
        } else {
          message.success(res.data.message, 2.5);
          setIsModalEdit(false);
          getDataDish();
          setName("");
          setPrice("");
          setDes("");
          setDiscount("");
        }
      });
  };

  const handleCancelEdit = () => {
    setIsModalEdit(false);
    setName("");
    setPrice("");
    setDes("");
    setDiscount("");
  };

  const handleOkDish = async () => {
    messageApi.open({
      type: "loading",
      content: "Creating..",
    });
    await axios
      .post("http://localhost:3001/api/dish/create", {
        restaurantID: resID,
        dishName: name,
        dishType: "Dish",
        dishDescribe: des,
        dishPrice: price,
        dishDiscount: discount,
      })
      .then((res) => {
        if (res.data.status === "ERR") {
          return message.error(res.data.message, 2.5);
        } else {
          message.success(res.data.message, 2.5);
          setIsModalDish(false);
          getDataDish();
          setName("");
          setPrice("");
          setDes("");
          setDiscount("");
        }
      })
      .catch((err) => {
        if (err.response.data.message.name === "ValidationError") {
          return message.error(
            "You know where to enter letters and where to enter numbers, right?",
            2.5
          );
        } else console.log(err);
      });
  };

  const handleCancelDish = () => {
    setIsModalDish(false);
    setName("");
    setPrice("");
    setDes("");
    setDiscount("");
  };

  const handleOkDrink = async () => {
    messageApi.open({
      type: "loading",
      content: "Creating..",
    });
    await axios
      .post("http://localhost:3001/api/dish/create", {
        restaurantID: resID,
        dishName: name,
        dishType: "Drink",
        dishDescribe: des,
        dishPrice: price,
        dishDiscount: discount,
      })
      .then((res) => {
        if (res.data.status === "ERR") {
          return message.error(res.data.message, 2.5);
        } else {
          message.success(res.data.message, 2.5);
          setIsModalDrink(false);
          getDataDish();
          setName("");
          setPrice("");
          setDes("");
          setDiscount("");
        }
      })
      .catch((err) => {
        if (err.response.data.message.name === "ValidationError") {
          return message.error(
            "You know where to enter letters and where to enter numbers, right?",
            2.5
          );
        } else console.log(err);
      });
  };

  const handleCancelDrink = () => {
    setIsModalDrink(false);
    setName("");
    setPrice("");
    setDes("");
    setDiscount("");
  };

  const { confirm } = Modal;

  const removeDish = async (id) => {
    confirm({
      title: "Do you want to delete this dish?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        axios
          .delete(`http://localhost:3001/api/dish/delete/${id}`)
          .then(() => getDataDish());
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const getDataDish = async () => {
    setLoading(true);
    resID
      ? await axios
          .get(`http://localhost:3001/api/dish/get/${resID}`)
          .then((res) => {
            setDataDish(res.data.data.filter((e) => e.dishType === "Dish"));
            setDataDrink(res.data.data.filter((e) => e.dishType === "Drink"));
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
    getDataDish();
  }, [resID]);

  const handleUpload = (e) => {
    if (!(e.event instanceof ProgressEvent)) return;
    let bodyFormData = new FormData();
    bodyFormData.append("dishImage", e.file.originFileObj);
    messageApi.open({
      type: "loading",
      content: "Uploading image..",
      duration: 2.5,
    });
    axios
      .post(`http://localhost:3001/api/dish/upload/${id}`, bodyFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        message.success("Uploading finished", 2.5);
        getDataDish();
      });
  };

  return (
    <>
      {contextHolder}
      <Layout
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginLeft: -10,
        }}
      >
        <Space direction="vertical" style={{ margin: 20 }}>
          <Layout
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Typography.Title level={4}>Dish</Typography.Title>
            <Button type="primary" onClick={showModalDish}>
              Create
            </Button>
          </Layout>
          <Modal
            title="Add new Dish"
            open={isModalDish}
            onOk={handleOkDish}
            onCancel={handleCancelDish}
          >
            <Input
              value={name}
              style={{ marginBottom: 10 }}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            ></Input>
            <Input
              value={des}
              style={{ marginBottom: 10 }}
              placeholder="Description"
              onChange={(e) => setDes(e.target.value)}
            ></Input>
            <Input
              value={price}
              style={{ marginBottom: 10 }}
              placeholder="Price"
              suffix="$"
              onChange={(e) => setPrice(e.target.value)}
            ></Input>
            <Input
              value={discount}
              style={{ marginBottom: 10 }}
              placeholder="Discount"
              suffix="%"
              onChange={(e) => setDiscount(e.target.value)}
            ></Input>
          </Modal>

          <Table
            loading={loading}
            columns={[
              {
                title: "Image",
                dataIndex: "dishImage",
                render: (link) => {
                  if (link.length > 0) {
                    return <Avatar size={90} src={link[0]} />;
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
                title: "Title",
                dataIndex: "dishName",
              },
              {
                title: "Price",
                dataIndex: "dishPrice",
                render: (value) => <span>${value}</span>,
              },
              {
                title: "Description",
                dataIndex: "dishDescribe",
              },
              {
                title: "Discount",
                dataIndex: "dishDiscount",
                render: (value) => <span>{value}%</span>,
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
                          onClick={() => removeDish(id)}
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
            dataSource={dataDish}
            pagination={{
              pageSize: 5,
            }}
          ></Table>
        </Space>
        <Space direction="vertical" style={{ margin: 20 }}>
          <Layout
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Typography.Title level={4}>Drink</Typography.Title>
            <Button type="primary" onClick={showModalDrink}>
              Create
            </Button>
          </Layout>
          <Modal
            title="Add new Drink"
            open={isModalDrink}
            onOk={handleOkDrink}
            onCancel={handleCancelDrink}
          >
            <Input
              value={name}
              style={{ marginBottom: 10 }}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            ></Input>
            <Input
              value={des}
              style={{ marginBottom: 10 }}
              placeholder="Description"
              onChange={(e) => setDes(e.target.value)}
            ></Input>
            <Input
              value={price}
              style={{ marginBottom: 10 }}
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
              suffix="$"
            ></Input>
            <Input
              value={discount}
              style={{ marginBottom: 10 }}
              placeholder="Discount"
              onChange={(e) => setDiscount(e.target.value)}
              suffix="%"
            ></Input>
          </Modal>
          <Table
            loading={loading}
            columns={[
              {
                title: "Image",
                dataIndex: "dishImage",
                render: (link) => {
                  if (link.length > 0) {
                    return <Avatar size={90} src={link[0]} />;
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
                title: "Title",
                dataIndex: "dishName",
              },
              {
                title: "Price",
                dataIndex: "dishPrice",
                render: (value) => <span>${value}</span>,
              },
              {
                title: "Description",
                dataIndex: "dishDescribe",
              },
              {
                title: "Discount",
                dataIndex: "dishDiscount",
                render: (value) => <span>{value}%</span>,
              },
              {
                title: "Tools",
                dataIndex: "_id",
                render: (id) => {
                  return (
                    <div key={id}>
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
                          onClick={() => removeDish(id)}
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
                    </div>
                  );
                },
              },
            ]}
            dataSource={dataDrink}
            pagination={{
              pageSize: 5,
            }}
          ></Table>
          <Modal
            title="Edit"
            open={isModalEdit}
            onOk={() => handleOkEdit(id)}
            onCancel={handleCancelEdit}
          >
            <Input
              value={name}
              style={{ marginBottom: 10 }}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            ></Input>
            <Input
              value={des}
              style={{ marginBottom: 10 }}
              placeholder="Description"
              onChange={(e) => setDes(e.target.value)}
            ></Input>
            <Input
              value={price}
              style={{ marginBottom: 10 }}
              placeholder="Price"
              suffix="$"
              onChange={(e) => setPrice(e.target.value)}
            ></Input>
            <Input
              value={discount}
              style={{ marginBottom: 10 }}
              placeholder="Discount"
              suffix="%"
              onChange={(e) => setDiscount(e.target.value)}
            ></Input>
          </Modal>
        </Space>
      </Layout>
    </>
  );
}
export default Menu;
