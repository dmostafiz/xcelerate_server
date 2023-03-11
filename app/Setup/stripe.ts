import Stripe from 'stripe'

const stripe = new Stripe('sk_test_51IoxonJIHTD5XjxgOOGG949cLV4bxxI8AAWWo0H4dH8Io74aJgtl8ZXF7Vqq660rBvtZqBZXtoklgBK61d0yFZuq00YQUIgnXJ', {apiVersion: '2022-11-15'});

export default stripe
