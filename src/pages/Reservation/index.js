import { Layout, Space, Table, Typography } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Reservation = () => {
  const [loading, setLoading] = useState(false);
  const [dataOrders, setDataOrders] = useState([]);

  const [resID, setResID] = useState("");

  useEffect(() => {
    setResID(localStorage.getItem("resID"));
  }, []);

  const getDataOrder = async () => {
    resID
      ? await axios
          .get(`http://localhost:3001/api/order/get-details/${resID}`)
          .then((res) => {
            setDataOrders(res.data.data);
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

  return (
    <Space direction="vertical">
      <Typography.Title level={4}>Reservation</Typography.Title>
      <Layout>
        <Table
          loading={loading}
          dataSource={dataOrders}
          columns={[
            {
              title: "Date Order",
              dataIndex: "dateOrder",
            },
            {
              title: "Time Order",
              dataIndex: "timeOrder",
            },
            {
              title: "Table Name",
              dataIndex: "tableName",
            },
            {
              title: "Guest Name",
              dataIndex: "guestName",
            },
            {
              title: "Guest Phone",
              dataIndex: "guestPhone",
            },
            {
              title: "Number Of People",
              dataIndex: "numberOfPeople",
            },
            {
              title: "Completly Payment",
              dataIndex: "completed",
              render: (status) => {
                if (status === true) {
                  return <span>True</span>
                } else return <span>False</span>
              },
            },
            {
              title: "Cancelled",
              dataIndex: "cancelled",
              render: (status) => {
                if (status === true) {
                  return <span>True</span>
                } else return <span>False</span>
              },
            },
          ]}
        ></Table>
      </Layout>
    </Space>
  );
};

export default Reservation;
