import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Card,
  Layout,
  Space,
  Statistic,
  Table,
  Typography,
  Spin,
  Tag,
} from "antd";
import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Orders() {
  const [loading, setLoading] = useState(false);
  const [dataBill, setDataBill] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [dataStaff, setDataStaff] = useState([]);
  const [resID, setResID] = useState("");
  const [order, setOrder] = useState("");
  const [staffRevenue, setStaffRevenue] = useState([]);

  useEffect(() => {
    setResID(localStorage.getItem("resID"));
  }, []);

  const getDataOrder = async () => {
    resID
      ? await axios
          .get(`https://tablenow.onrender.com/api/order/get-details/${resID}`)
          .then((res) => {
            setOrder(res.data.data.length);
            setDataOrder(res.data.data.filter((e) => e.completed === true));
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

  const getDataStaff = async () => {
    resID
      ? await axios
          .get(`https://tablenow.onrender.com/api/staffs/get-staff/${resID}`)
          .then((res) => {
            setDataStaff(res.data.data);
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
    getDataStaff();
  }, [resID]);

  const getDataBill = async () => {
    resID && dataOrder && dataStaff
      ? await axios
          .get(`https://tablenow.onrender.com/api/bill/get-details/${resID}`)
          .then((res) => {
            setDataBill(
              res.data.data
                .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
                .map((e) => {
                  return {
                    ...e,
                    guestName: dataOrder.filter((i) => i._id === e.orderID)[0]
                      .guestName,
                    guestPhone: dataOrder.filter((i) => i._id === e.orderID)[0]
                      .guestPhone,
                    numberOfPeople: dataOrder.filter(
                      (i) => i._id === e.orderID
                    )[0].numberOfPeople,
                    staffName: dataStaff.filter((i) => i._id === e.staffID)[0]
                      .staffName,
                  };
                })
            );

            const total = res.data.data.reduce((acc, curr) => {
              const index = acc.findIndex(
                (item) => item.staffID === curr.staffID
              );
              if (index !== -1) {
                acc[index].totalPay += curr.totalPay;
              } else {
                acc.push(curr);
              }
              return acc;
            }, []);

            setStaffRevenue(
              total.map((e) => {
                return {
                  staffName: dataStaff.filter((i) => i._id === e.staffID)[0]
                    .staffName,
                  revenue: e.totalPay,
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
    getDataBill();
  }, [resID, dataOrder, dataStaff]);

  const [reveneuData, setReveneuData] = useState({
    labels: [],
    datasets: [],
  });

  const revenue = () => {
    const labels = staffRevenue.map((cart) => {
      return `Staff: ${cart.staffName}`;
    });

    const data = staffRevenue.map((cart) => {
      return cart.revenue;
    });

    const dataSource = {
      labels,
      datasets: [
        {
          label: "Dollar",
          data: data,
          backgroundColor: "#1777FF",
        },
      ],
    };

    setReveneuData(dataSource);
  };

  useEffect(() => {
    revenue();
  }, [staffRevenue]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "By Employee",
      },
    },
  };

  function calculateSum(array, property) {
    const total = array.reduce((accumulator, object) => {
      return accumulator + object[property];
    }, 0);

    return total;
  }

  function DashboardCard({ title, value, icon }) {
    return (
      <Card>
        <Space direction="horizontal">
          {icon}
          <Statistic title={title} value={value} />
        </Space>
      </Card>
    );
  }

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Revenue</Typography.Title>
      {loading === true ? (
        <Spin />
      ) : (
        <Layout
          style={{ flexDirection: "row", justifyContent: "space-evenly" }}
        >
          <DashboardCard
            icon={
              <ShoppingCartOutlined
                style={{
                  color: "green",
                  backgroundColor: "rgba(0,255,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                  width: "52px",
                }}
              />
            }
            title={"Booked Tables"}
            value={order}
          />

          <DashboardCard
            icon={
              <UserOutlined
                style={{
                  color: "purple",
                  backgroundColor: "rgba(0,255,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                  width: "52px",
                }}
              />
            }
            title={"Customers"}
            value={calculateSum(dataBill, "numberOfPeople")}
          />
          <DashboardCard
            icon={
              <DollarCircleOutlined
                style={{
                  color: "red",
                  backgroundColor: "rgba(255,0,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                  width: "52px",
                }}
              />
            }
            title={"Revenue"}
            value={`$${calculateSum(dataBill, "totalPay")}`}
          />
        </Layout>
      )}

      <Typography.Title level={5}>Revenue Statistics</Typography.Title>

      <Card>
        <Bar options={options} data={reveneuData} />
      </Card>
      <Typography.Title level={5}>Bills</Typography.Title>
      <Table
        columns={[
          {
            title: "Time",
            dataIndex: "createdAt",
            render: (time) => {
              return <span>{moment(time).format("HH:mm DD/MM/YYYY")}</span>;
            },
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
            title: "Peoples",
            dataIndex: "numberOfPeople",
          },
          {
            title: "Order List",
            dataIndex: "orderList",
            render: (list) => {
              return (
                <span style={{ flexDirection: "column", display: "flex" }}>
                  {list.map((e) => (
                    <span>
                      - {e.dishName} ({e.quantity})
                    </span>
                  ))}
                </span>
              );
            },
          },
          {
            title: "Payment Staff",
            dataIndex: "staffName",
          },
          {
            title: "Payment Method",
            dataIndex: "paymentMethod",
          },
          {
            title: "Total Pay",
            dataIndex: "totalPay",
            render: (total) => {
              return <Tag color="green">${total}</Tag>;
            },
          },
        ]}
        loading={loading}
        dataSource={dataBill}
        pagination={{ pageSize: 5 }}
      ></Table>
    </Space>
  );
}

export default Orders;
