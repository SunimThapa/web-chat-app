const Joi = require('joi');

const SendMessageDTO = Joi.object({
  chatId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/) // Valid MongoDB ObjectId
    .messages({
      'string.empty': 'Chat ID is required',
      'string.pattern.base': 'Invalid chat ID format'
    }),
  
  content: Joi.string()
    .required()
    .trim()
    .min(1)
    .max(500)
    .messages({
      'string.empty': 'Message content is required',
      'string.min': 'Message cannot be empty',
      'string.max': 'Message is too long (max 500 characters)'
    }),
  
  messageType: Joi.string()
    .valid('text')
    .default('text')
    .messages({
      'any.only': 'Message type must be text for this endpoint'
    }),
  
  replyTo: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null)
    .messages({
      'string.pattern.base': 'Invalid reply message ID format'
    })
});

const SendMessageWithFileDTO = Joi.object({
  chatId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'Chat ID is required',
      'string.pattern.base': 'Invalid chat ID format'
    }),
  
  content: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Caption is too long (max 1000 characters)'
    }),
  
  messageType: Joi.string()
    .valid('file', 'image')
    .required()
    .messages({
      'string.empty': 'Message type is required',
      'any.only': 'Message type must be either file or image'
    }),
  
  replyTo: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null)
    .messages({
      'string.pattern.base': 'Invalid reply message ID format'
    })
});
const ToggleReactionDTO = Joi.object({
  emoji: Joi.string()
    .required()
    .min(1).max(4)
    .messages({
      'string.empty': 'Emoji is required',
      'string.min': 'Emoji cannot be empty',
      'string.max': 'Invalid emoji format'
    })
});



module.exports = {SendMessageDTO, SendMessageWithFileDTO, ToggleReactionDTO};