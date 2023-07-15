import React from "react";
import { useSelector } from "react-redux";
import CartProduct from "../component/cartProduct";
import emptyCartImage from "../images/Empty.gif";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const productCartItem = useSelector((state) => state.product.cartItem);
  //console.log(productCartItem);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const totalPrice = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  );
  const totalQty = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.qty),
    0
  );

  const handlePayment = async () => {
    if (user.email) {
      const stripePromise = await loadStripe(
        process.env.REACT_APP_STRIPE_PUBLIC_KEY
      );
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/payment`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(productCartItem),
        }
      );

      if (res.statusCode === 500) return;

      const data = await res.json();
      //console.log(data);

      toast("Redirect to payment Gateway...!");
      stripePromise.redirectToCheckout({ sessionId: data });
    }
    else{
      toast("You have not login");
      setTimeout(()=>{
        navigate("/login")
      },1000)
    }
  };

  return (
    <>
      <div className="p-2 md:p-4">
        <h1 className="text-lg md:text-4xl font-bold text-center text-blue-900">
          Your Cart Items
        </h1>
        {productCartItem[0] ? (
          <div className="my-4 flex gap-4">
            {/*Cart Items*/}
            <div className="w-full max-w-3xl ">
              {productCartItem.map((el) => {
                return (
                  <CartProduct
                    key={el._id}
                    id={el._id}
                    name={el.name}
                    price={el.price}
                    category={el.category}
                    image={el.image}
                    qty={el.qty}
                    total={el.total}
                  />
                );
              })}
            </div>

            {/*Total Cart Items*/}
            <div className="w-full max-w-xl ml-auto">
              <h2 className="text-lg font-bold text-white bg-slate-500 p-2">
                Total Summary
              </h2>
              <div className="flex w-full py-2 text-lg border">
                <p>Total Quantity : </p>
                <p className="ml-auto w-32 font-bold">
                  <span className="font-medium ">₹</span>
                  {totalQty}
                </p>
              </div>
              <div className="flex w-full py-2 text-lg border">
                <p>Total Price</p>
                <p className="ml-auto w-32 font-bold">
                  <span className="font-medium ">₹</span>
                  {totalPrice}
                </p>
              </div>
              <button
                className="bg-yellow-200 w-full text-lg font-bold hover:bg-slate-300 py-2"
                onClick={handlePayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex w-full justify-center items-center">
              <img src={emptyCartImage} className="w-full max-w-lg" />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
