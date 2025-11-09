const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount, paymentMethodId, name, email, message } = req.body;

    try {
        // Create a charge
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            receipt_email: email,
            metadata: {
                donor_name: name,
                donor_message: message
            }
        });

        if (paymentIntent.status === 'succeeded') {
            return res.status(200).json({ 
                success: true,
                paymentId: paymentIntent.id 
            });
        } else {
            return res.status(400).json({ 
                success: false,
                error: 'Payment failed' 
            });
        }
    } catch (error) {
        return res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
}
