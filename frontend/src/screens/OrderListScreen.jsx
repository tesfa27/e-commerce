import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchOrderList, deleteOrder } from '../redux/orderListSlice';

export default function OrderListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, orders, loadingDelete } = useSelector((state) => state.orderList);
  const { userInfo } = useSelector((state) => state.user);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await dispatch(deleteOrder(order._id)).unwrap();
        toast.success('Order deleted successfully');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  useEffect(() => {
    dispatch(fetchOrderList());
  }, [dispatch]);

  const deliverHandler = async (order) => {
    try {
      setLoadingDeliver(true);
      await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoadingDeliver(false);
      toast.success('Order delivered successfully');
      dispatch(fetchOrderList());
    } catch (error) {
      setLoadingDeliver(false);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loadingDeliver && <LoadingBox />}
      {loadingDelete && <LoadingBox />}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.name : 'DELETED USER'}</td>
                <td>{order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}</td>
                <td>${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</td>
                <td>{order.isPaid && order.paidAt ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered && order.deliveredAt
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </Button>
                  {' '}
                  {order.isPaid && !order.isDelivered && (
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deliverHandler(order)}
                    >
                      Deliver
                    </Button>
                  )}
                  {' '}
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(order)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}