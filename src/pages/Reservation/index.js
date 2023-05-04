import { Layout, Space, Table, Tag, Typography } from "antd";
import axios from "axios";
import moment from "moment";
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
          .get(`https://tablenow.onrender.com/api/order/get-details/${resID}`)
          .then((res) => {
            setDataOrders(
              res.data.data.sort(
                (a, b) => moment(b.createdAt) - moment(a.createdAt)
              )
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
    getDataOrder();
  }, [resID]);

  return (
    <Space direction="vertical">
      <Typography.Title level={4}>Reservation</Typography.Title>
      <Layout>
        <Table
          loading={loading}
          dataSource={dataOrders}
          pagination={{ pageSize: 10 }}
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
              title: "Completed Payment",
              dataIndex: "completed",
              render: (status) => {
                let color = status === true ? "geekblue" : "red";
                if (status === true) {
                  return <Tag color={color}>TRUE</Tag>;
                } else return <Tag color={color}>FALSE</Tag>;
              },
            },
            {
              title: "Cancelled",
              dataIndex: "cancelled",
              render: (status) => {
                let color = status === true ? "geekblue" : "red";
                if (status === true) {
                  return <Tag color={color}>TRUE</Tag>;
                } else return <Tag color={color}>FALSE</Tag>;
              },
            },
          ]}
        ></Table>
      </Layout>
    </Space>
  );
};

export default Reservation;
