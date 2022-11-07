import React, { useState, useEffect } from "react";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripe = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLIC
);

const createPaymentIntent = options => {
    return window
        .fetch(`${process.env.REACT_APP_STRIPE_ENDPOINT}/create-payment-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(options)
        })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                return null;
            }
        })
        .then(data => {
            if (!data || data.error) {
                console.log("API error:", { data });
                throw new Error("PaymentIntent API Error");
            } else {
                return data.client_secret;
            }
        });
};



export function Stripe({ amount, onSuccess }) {

    return (
        <Elements stripe={stripe}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} />
        </Elements>
    );
};

function CheckoutForm({ amount, onSuccess }) {

    const [clientSecret, setClientSecret] = useState();
    const stripe = useStripe();
    const elements = useElements();


    const handleSubmit = async (ev) => {
        ev.preventDefault();

        // Step 3: Use clientSecret from PaymentIntent and the CardElement
        // to confirm payment with stripe.confirmCardPayment()
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: ev.target.name.value,
                },
            },
        });

        if (payload.error) {
            console.log("[error]", payload.error);
        } else {
            console.log("[PaymentIntent]", payload.paymentIntent);
        }
    };

    useEffect(() => {
        createPaymentIntent()
            .then((clientSecret) => {
                setClientSecret(clientSecret);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <h1>
                ${amount}
            </h1>
            <h4>Order</h4>

            <div className="sr-combo-inputs">
                <div className="sr-combo-inputs-row">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        autoComplete="cardholder"
                        className="sr-input"
                    />
                </div>

                <div className="sr-combo-inputs-row">
                    <CardElement
                        className="sr-input sr-card-element"
                    />
                </div>
            </div>



            <button
                className="btn"
            >
                Pay
            </button>
        </form>
    );
}