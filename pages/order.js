import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Title from "@/components/Title";
import { withSwal } from "react-sweetalert2";

function OrdersPage({ swal }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }

  console.log(JSON.stringify(orders));

  function checkoutOrder(order) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to checkout ${order.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Checkout!",
        confirmButtonColor: "green",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = order;
          await axios.delete("/api/orders?_id=" + _id);
          fetchOrders();
        }
      });
  }

  return (
    <Layout>
      <Title>Order</Title>
      <table className="order">
        <thead>
          <tr>
            <th>Date</th>
            <th>Recipient</th>
            <th>Products</th>
            <th>Checkout</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <span className="font-bold pr-1">Name:</span>
                  {order.name} <span className="font-bold pr-1">Email:</span>{" "}
                  {order.email}
                  <br />
                  <span className="font-bold pr-1">Address:</span>
                  {order.city} {order.postalCode} {order.country}{" "}
                  {order.streetAddress}
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <>
                      {l.price_data?.product_data.name} x{l.quantity}
                      <br />
                    </>
                  ))}
                </td>
                <td>
                  <button
                    onClick={() => checkoutOrder(order)}
                    className="bg-green-500 text-white px-4 py-1 rounded-xl mx-4"
                  >
                    Done
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <OrdersPage swal={swal} />);
