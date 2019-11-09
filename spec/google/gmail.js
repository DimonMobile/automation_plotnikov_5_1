const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';

exports.authorize = function authorize(logger) {
    let content = fs.readFileSync('credentials.json')
    const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    let token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    const gmail = google.gmail({ version: 'v1', oAuth2Client });
    return oAuth2Client;
}

function parseDeadLine(body) {
    let pattern = /(\d+\s[А-Яа-я]+,\s\d+:\d+)/;
    let match = body.match(pattern);
    return match[0];
}

function getSubject(messageData) {
    let messageSubject = undefined;
    for (let { name, value } of messageData.data.payload.headers) {
        if (name == 'Subject') {
            messageSubject = value;
            break;
        }
    }
    return messageSubject;
}

function getBody(messageData) {
    let messageFullBody = '';
    for (let { body } of messageData.data.payload.parts) {
        if (body.data != undefined) {
            let data = Buffer.from(body.data, 'base64');
            messageFullBody += data.toString();
        }
    }
    return messageFullBody;
}

async function logMessageData(logger, messageId, auth) {
    logger.debug('started logMessageData(logger, messageId, auth)');
    const gmail = google.gmail({ version: 'v1', auth });

    let messageData = await gmail.users.messages.get({
        userId: 'me',
        id: messageId
    });

    let messageSubject = getSubject(messageData);
    logger.debug(messageSubject);

    if (messageSubject.includes('Automation')) {
        logger.debug('Subject appropriate');
        let messageFullBody = getBody(messageData);
        logger.info(`Задание: ${messageSubject}. Срок выполнения: ${parseDeadLine(messageFullBody)}\r\nТело письма:\r\n${messageFullBody}`);
    } else {
        logger.warn('Subject is inappropriate');
    }
    logger.debug('end of logMessageData(logger, messageId, auth)');
}

exports.getMessagesList = async function listLabels(logger, auth) {
    logger.debug(`started listLabels(logger, auth)`);
    const gmail = google.gmail({ version: 'v1', auth });

    let messagesList = await gmail.users.messages.list({ userId: 'me' });
    logger.debug(messagesList.data);

    // retrieving each message
    for (let { id } of messagesList.data.messages) {
        await logMessageData(logger, id, auth);
    }

    logger.debug(`end of listLabels(logger, auth)`);
    return messagesList.data.messages.length;
}