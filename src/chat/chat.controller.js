import Chat from './chat.model.js';
import User from '../user/user.model.js';

// 1. Crear o reutilizar un chat entre dos usuarios
export const createOrGetChat = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).send({ success: false, message: 'Participant ID is required' });
    }

    // Buscar si ya existe un chat entre ambos
    const existingChat = await Chat.findOne({
      participants: { $all: [userId, participantId], $size: 2 }
    });

    if (existingChat) {
      return res.send({ success: true, chat: existingChat });
    }

    // Si no existe, crear uno nuevo
    const newChat = new Chat({
      participants: [userId, participantId],
      messages: []
    });

    await newChat.save();
    return res.status(201).send({ success: true, message: 'Chat created', chat: newChat });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error creating chat', error });
  }
};

// 2. Enviar un mensaje
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { chatId, text } = req.body;

    if (!text || !chatId) {
      return res.status(400).send({ success: false, message: 'Message text and chat ID are required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).send({ success: false, message: 'Not authorized or chat not found' });
    }

    const message = {
      sender: userId,
      text,
      timestamp: new Date()
    };

    chat.messages.push(message);
    await chat.save();

    return res.send({ success: true, message: 'Message sent', chat });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error sending message', error });
  }
};

// 3. Obtener todos los chats del usuario (último mensaje + participantes)
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.uid;

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'username name')
      .sort({ updatedAt: -1 });

    const formattedChats = chats.map(chat => ({
      _id: chat._id,
      participants: chat.participants,
      lastMessage: chat.messages[chat.messages.length - 1] || null
    }));

    return res.send({ success: true, chats: formattedChats });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error fetching chats', error });
  }
};

// 4. Obtener un chat específico por ID
export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.uid;

    const chat = await Chat.findById(chatId)
      .populate('participants', 'username name')
      .populate('messages.sender', 'username name');

    if (!chat || !chat.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).send({ success: false, message: 'Access denied' });
    }

    return res.send({ success: true, chat });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'Error retrieving chat', error });
  }
};
