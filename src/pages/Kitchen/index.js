import { CheckOutlined } from "@ant-design/icons";
import { Button, Layout, Space, Table, Tag, Tooltip, Typography } from "antd";
import axios from "axios";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";

const Kitchen = () => {
  const [loading, setLoading] = useState(false);
  const [dataOrdersMenu, setDataOrderMenu] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [dataMenu, setDataMenu] = useState([]);

  const [resID, setResID] = useState("");

  useEffect(() => {
    setResID(localStorage.getItem("resID"));
  }, []);

  const getDataOrder = async () => {
    resID
      ? await axios
          .get(`https://tablenow.onrender.com/api/order/get-details/${resID}`)
          .then((res) => {
            setDataOrder(res.data.data);
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
    getDataOrder();
  }, [resID]);

  const getDataMenu = async () => {
    resID
      ? await axios
          .get(`https://tablenow.onrender.com/api/dish/get/${resID}`)
          .then((res) => {
            setDataMenu(res.data.data);
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
    getDataMenu();
  }, [resID]);

  const getDataOrderMenu = async () => {
    resID && dataOrder && dataMenu
      ? await axios
          .get(`https://tablenow.onrender.com/api/order-menu/get/${resID}`)
          .then((res) => {
            setDataOrderMenu(
              res.data.data
                .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
                .sort((a, b) => (b.done === false) - (b.done === true))
                .map((e) => {
                  return {
                    ...e,
                    tableName: dataOrder.filter((i) => i._id === e.orderID)[0]
                      .tableName,
                    ordered: e.ordered.map((e) => {
                      return {
                        ...e,
                        dishName: dataMenu.filter((i) => i._id === e.dishID)[0]
                          .dishName,
                      };
                    }),
                  };
                })
            );
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
    getDataOrderMenu();
  }, [resID, dataOrder, dataMenu]);

  const checkDone = async (id) => {
    await axios
      .put(`https://tablenow.onrender.com/api/order-menu/update-status/${id}`, {
        done: true,
      })
      .then(() => getDataOrderMenu());
  };

  return (
    <Space direction="vertical">
      <Typography.Title level={4}>Kitchen</Typography.Title>
      <Layout>
        <Table
          loading={loading}
          dataSource={dataOrdersMenu.filter((e) => e.ordered.length > 0)}
          columns={[
            {
              title: "Table Name",
              dataIndex: "tableName",
            },
            {
              title: "Order List",
              dataIndex: "ordered",
              render: (list) => {
                return (
                  <span style={{ flexDirection: "column", display: "flex" }}>
                    {list.map((e) => (
                      <span>- {e.dishName}</span>
                    ))}
                  </span>
                );
              },
            },
            {
              title: "Quantity",
              dataIndex: "ordered",
              render: (list) => {
                return (
                  <span
                    style={{
                      flexDirection: "column",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {list.map((e) => (
                      <span>{e.quantity}</span>
                    ))}
                  </span>
                );
              },
            },
            {
              title: "Status",
              render: (data) => {
                return (
                  <>
                    {data.done === true ? (
                      <Tag color="green">AVAILABLE!</Tag>
                    ) : (
                      <Tooltip title="Completed">
                        <Button
                          onClick={() => checkDone(data._id)}
                          type="primary"
                          shape="circle"
                          icon={<CheckOutlined />}
                        />
                      </Tooltip>
                    )}
                  </>
                );
              },
            },
          ]}
        ></Table>
      </Layout>
    </Space>
  );
};

export default Kitchen;
