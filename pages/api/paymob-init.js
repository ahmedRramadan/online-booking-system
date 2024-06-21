import axios from 'axios';

const PAYMOB_API_KEY = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1Rnd01UVTVMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuOGJYa3JuMjBveUJoQ1l4YjlqbWdfVnYtYmloOEhDbllwVXlwNHp1VUY3V1JLR2c5Y3hNSU1BVC1LNkNnajVELXNibWhhM2tDNV9ubDZfakNVQnVWOEE=';
const PAYMOB_INTEGRATION_ID = '4591990';
const PAYMOB_IFRAME_ID = '850681';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, eventId, price } = req.body;

    if (!price || isNaN(price) || price <= 0) {
      res.status(400).json({ error: 'Invalid price' });
      return;
    }

    try {
      // Step 1: Authentication
      const authResponse = await axios.post('https://accept.paymobsolutions.com/api/auth/tokens', {
        api_key: PAYMOB_API_KEY,
      });
      const token = authResponse.data.token;

      // Step 2: Order Registration API
      const orderResponse = await axios.post('https://accept.paymobsolutions.com/api/ecommerce/orders', {
        auth_token: token,
        delivery_needed: false,
        amount_cents: parseInt(price) * 100, // استخدام السعر من الطلب وتحويله إلى سنتات
        currency: 'EGP',
        items: [],
      });
      const orderId = orderResponse.data.id;

      // Step 3: Payment Key Request
      const paymentKeyResponse = await axios.post('https://accept.paymobsolutions.com/api/acceptance/payment_keys', {
        auth_token: token,
        amount_cents: parseInt(price) * 100, // استخدام السعر من الطلب وتحويله إلى سنتات
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: 'NA',
          email: 'example@example.com',
          floor: 'NA',
          first_name: 'NA',
          street: 'NA',
          building: 'NA',
          phone_number: '+201234567890',
          shipping_method: 'NA',
          postal_code: 'NA',
          city: 'NA',
          country: 'NA',
          last_name: 'NA',
          state: 'NA',
        },
        currency: 'EGP',
        integration_id: PAYMOB_INTEGRATION_ID,
      });
      const paymentKey = paymentKeyResponse.data.token;

      // Step 4: Generate payment URL
      const paymentUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
      res.status(200).json({ paymentUrl });
    } catch (error) {
      console.error('Error processing payment:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Error processing payment', details: error.response ? error.response.data : error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
