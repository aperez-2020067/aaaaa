import Recharge from './recharge.model.js';
import Payment from '../payment/payment.model.js';

// Crear o sumar una recarga al balance
export const addRecharge = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { amount, method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid recharge amount' });
    }

    
    const payment = new Payment({
      user: userId,
      amount,
      method,
      type: 'RECHARGE',
      status: 'COMPLETED'
    });
    await payment.save();

    
    let recharge = await Recharge.findOne({ user: userId });
    if (!recharge) {
      recharge = new Recharge({ user: userId });
    }

    let number1 = recharge.balance * 1;
    let number2 = amount * 1;
    let total = number1 + number2;
    
    recharge.balance = total;
    recharge.history.push({
      amount,
      reference: payment._id
    });

    await recharge.save();

    return res.status(201).send({
      success: true,
      message: 'Recharge added successfully',
      balance: recharge.balance,
      recharge
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error adding recharge', error });
  }
};

// Obtener información del saldo y el historial
export const getRechargeInfo = async (req, res) => {
  try {
    const userId = req.user.uid;

    const recharge = await Recharge.findOne({ user: userId })
      .populate('history.reference', 'amount method createdAt');

    if (!recharge) {
      return res.send({ success: true, balance: 0, history: [] });
    }

    return res.send({ success: true, balance: recharge.balance, history: recharge.history });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error fetching recharge info', error });
  }
};

// Descontar comisión por trabajo (10%)
export const discountCommission = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { jobAmount } = req.body;

    if (!jobAmount || jobAmount <= 0) {
      return res.status(400).send({ success: false, message: 'Invalid job amount' });
    }

    const commission = jobAmount * 0.10;

    const recharge = await Recharge.findOne({ user: userId });
    if (!recharge || recharge.balance < commission) {
      return res.status(400).send({
        success: false,
        message: 'Insufficient balance to cover commission.'
      });
    }

    // Descontar del balance
    recharge.balance -= commission;
    recharge.history.push({
      amount: -commission,
      reference: null // podrías asociarlo al payment si lo deseas
    });
    await recharge.save();

    // Registrar como un nuevo Payment tipo 'COMMISSION'
    const payment = new Payment({
      user: userId,
      amount: commission,
      method: 'CARD',
      type: 'COMMISSION',
      status: 'COMPLETED'
    });
    await payment.save();

    return res.send({
      success: true,
      message: 'Commission successfully deducted.',
      newBalance: recharge.balance,
      commission,
      paymentId: payment._id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error deducting commission', error });
  }
};
