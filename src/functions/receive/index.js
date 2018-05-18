import Joi from 'joi'; // validation

// Local objects
import config from '../../config';
import {handleResponse} from '../../lib/util';
import Telegram from '../../lib/telegram';

const _bodySchema = Joi.object(); // Check telegram object exists

/**
 * Webhook handler for incoming Telegram messages
 * @function telegramWebhook
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Function} callback - Callback
 */
export default async (event, context, callback) => {
  try {
    console.log('Lambda handler loading');
    console.log('Incoming payload: ', event.body);
    // Validate body
    const payload = await Joi.validate(event.body, _bodySchema);

    // Class
    const telegram = new Telegram(config);

    // Send reply message
    const result = await telegram.sendReply(payload.message);
    handleResponse(callback, 200, result);
    console.log('Message sent');
  } catch (err) {
    if (err.isJoi) {
      handleResponse(callback, 400, err.details[0].message);
      console.log('Validation error: ' + err.details[0].message);
    } else {
      handleResponse(callback, 500, err.message);
    }
  }
};
