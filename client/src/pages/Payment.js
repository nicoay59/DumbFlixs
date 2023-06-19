import React from 'react';
import { API } from '../config/api';
import { useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/userContext';

const Payment = () => {


    const [price, setPrice] = useState(100000)
  const [state] = useContext(UserContext)
    let navigate = useNavigate();

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
        document.body.removeChild(scriptTag);
    };
}, []);


const [booking, setBooking] = useState();
useEffect (() =>{
    setBooking({
        price: price,
    })
    
},[price])

console.log(booking,"isi bookung");



const handleBuy = useMutation(async (e) => {
    try {
        const config = {
            headers: {
                "Content-type": "multipart/form-data",
            },
        };
        const formData = new FormData() 
        formData.set("price", booking.price)
        formData.set("GrossAmt", price);


        // console.log(data, "ini kotol");

        // const body = JSON.stringify(data);

        // console.log(body,"ini isi data");

        const response = await API.post("/transaction", formData, config);
        console.log("transaction success :", response);

        const token = response.data.data.token;
        window.snap.pay(token, {
            onSuccess: function (result) {
                /* You may add your own implementation here */
                console.log(result);
                navigate("/profile");
            },
            onPending: function (result) {
                /* You may add your own implementation here */
                console.log(result);
                navigate("/profile");
            },
            onError: function (result) {
                /* You may add your own implementation here */
                console.log(result);
                navigate("/profile");
            },
            onClose: function () {
                /* You may add your own implementation here */
                alert("you closed the popup without finishing the payment");
            },
        });
    } catch (error) {
        console.log("transaction failed : ", error);
    }
})
  return (
    <React.Fragment>
      <div className="px-8 py-24 container mx-auto h-[100vh] bg-danger">
        <h2 className="text-center text-3xl font-bold">Choose You're plan!</h2>
        <div className="flex gap-x-20 px-20 mt-10">
          <div className="w-1/3 flex flex-col justify-between bg-zinc-800 shadow-md rounded-md p-3">
            <h3 className="font-bold text-md mb-5">Regular</h3>
            <p className="font-bold text-red-700 text-2xl mb-3">Rp 100K </p>
            <p className="text-justify">regular plan for a month, you can get access for limited thousand tv series and movies, auto renewal every week. cannot be cancel unless you close you're bank account.</p>
            <button onClick={(e) => handleBuy.mutate({ price: 100000 })} className="bg-red-700 text-white mt-5 py-2 rounded-md">Buy plan</button>
          </div>

          {/* <div className="w-1/3 flex flex-col justify-between bg-zinc-800 shadow-md rounded-md p-3">
            <h3 className="font-bold text-md mb-5">premium</h3>
            <p className="font-bold text-red-700 text-2xl mb-3">Rp 50K </p>
            <p className="text-justify">Best plan for a month, you can get access for limited thousand tv series and movies, but you're account could get banned in less of a month and remember we're not giving any warranty.</p>
            <button onClick={() => handleBuy.mutate({ price: 50000 })} className="bg-red-700 text-white mt-5 py-2 rounded-md">Buy plan</button>
          </div> */}

          {/* <div className="w-1/3 flex flex-col justify-between bg-zinc-800 shadow-md rounded-md p-3">
            <h3 className="font-bold text-md mb-5">King Box</h3>
            <p className="font-bold text-red-700 text-2xl mb-3">Rp 75K </p>
            <p className="text-justify">King only plan, same as before but you'll never know when your subscriptions over and when we take you're money.</p>
            <button onClick={() => handleBuy.mutate({ price: 600000 })} className="bg-red-700 text-white mt-5 py-2 rounded-md">Buy plan</button>
          </div> */}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Payment;