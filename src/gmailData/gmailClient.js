// gmailClient.js

const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "src",
  "gmailData",
  "credentials.json"
);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Get the body of the email from the payload.
 *
 * @param {Object} payload Email payload from Gmail API response.
 * @returns {string} The email body.
 */
function getBody(payload) {
  if (!payload) return "";

  if (payload.body && payload.body.data) {
    return Buffer.from(payload.body.data, "base64").toString();
  } else if (payload.parts) {
    // If the email has multiple parts (e.g., text and HTML), use the first text part.
    const textPart = payload.parts.find(
      (part) => part.mimeType === "text/plain"
    );
    if (textPart && textPart.body && textPart.body.data) {
      return Buffer.from(textPart.body.data, "base64").toString();
    }
  }

  return "";
}

/**
 * Get the text after "Bet on" from the email body.
 *
 * @param {Object} payload Email payload from Gmail API response.
 * @returns {string} The text after "Bet on" in the email body until "odds on" is seen.
 */
function getBetOnText(body) {
  if (!body) return "";

  // Use a regular expression to find the text between "Bet on" and "odds on" in the email body.
  const regex = /(?:Bet on\s)(.*?)(?:\sodds on)/;
  const matches = body.match(regex);
  if (matches && matches.length >= 2) {
    return matches[1].trim();
  }

  return "";
}

/**
 * Lists the subjects, senders, bodies, and recommended bet amount of all the unread emails from the specified sender in the user's inbox, and marks them as read.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listAndMarkUnreadEmails(auth) {
  const results = [];
  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.messages.list({
    userId: "me",
    q: "is:unread in:inbox from:notifications@oddsjam.com", // Query to filter only unread emails from the specified sender in the inbox.
  });
  const emails = res.data.messages;
  if (!emails || emails.length === 0) {
    console.log(
      "No unread emails from notifications@oddsjam.com found in the inbox."
    );
    return [];
  }

  // console.log("Unread emails from notifications@oddsjam.com in the inbox:");
  for (const email of emails) {
    try {
      const message = await gmail.users.messages.get({
        userId: "me",
        id: email.id,
        format: "full", // Fetch the full email to get the sender and body.
      });
      const headers = message.data.payload.headers;
      const subject = headers.find((header) => header.name === "Subject");
      const from = headers.find((header) => header.name === "From");
      const body = getBody(message.data.payload);

      // console.log(body);

      // console.log("Subject:", subject.value);
      // console.log("From:", from.value);

      // Check if the email body contains the word "Fliff"
      const containsFliff = body.includes("Fliff");

      // Display "Fliff" if present in the email body
      if (containsFliff) {
        //console.log("Fliff");
      }

      // Check if the email body contains a percentage
      const percentageRegex = /(\d+(\.\d+)?)%/;
      const percentageMatches = body.match(percentageRegex);
      const eventName = body.substring(0, percentageMatches.index).trim();
      //console.log(eventName);

      // Extract the event date from the email body
      const eventDateRegex = /Date of Event:\s*(.*?),/;
      const eventDateMatches = body.match(eventDateRegex);
      const eventDate =
        eventDateMatches && eventDateMatches[1]
          ? eventDateMatches[1].trim()
          : null;
      //console.log(eventDate);

      // Display the text after "Bet on" in the email body until "odds on" is seen
      const betOnText = getBetOnText(body);
      if (betOnText) {
        //console.log(betOnText);

        // Look for all recommended bet amounts with a $ sign followed by a number
        const betAmountRegex = /\$(\d+(\.\d+)?)/g;
        let betAmountMatches;
        const recommendedBetAmounts = [];
        while ((betAmountMatches = betAmountRegex.exec(body))) {
          const recommendedBetAmount = betAmountMatches[1];
          if (recommendedBetAmount) {
            recommendedBetAmounts.push(parseFloat(recommendedBetAmount));
          }
        }
        //console.log(recommendedBetAmounts);

        const betAmt = String(recommendedBetAmounts[0]);
        results.push({
          book: "Fliff",
          event: eventName,
          date: eventDate,
          edge: percentageMatches[0],
          bet: betOnText,
          betSize: betAmt,
        });
      } else {
        console.log(
          'Text after "Bet on" until "odds on" not found in the email body.'
        );
      }

      // Mark the email as read
      await gmail.users.messages.modify({
        userId: "me",
        id: email.id,
        requestBody: {
          removeLabelIds: ["UNREAD"],
        },
      });
    } catch (error) {
      console.error("Error fetching or marking email as read:", error);
    }
  }
  console.log(results.length);
  return results;
}

module.exports = {
  authorize,
  listAndMarkUnreadEmails,
};
