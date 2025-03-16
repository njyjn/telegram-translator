# Telegram Translator Bot

This project is a Telegram bot built using Next.js and Telegraf that translates messages between English and Burmese. It utilizes the Next.js app router and TypeScript for a modern development experience, leveraging the Google Cloud Translation API.

## Install Dependencies

Make sure you have Node.js installed. Then run: `npm i -D`.

## Configure Environment Variables

Create a `.env.local` file in the root directory and add your Telegram bot token and Google Cloud credentials.

Note: It's recommended to store the Google Cloud service account JSON in a separate file and reference it using the GOOGLE_APPLICATION_CREDENTIALS environment variable. However, for simpler setups, you can include the JSON directly, ensuring it's properly formatted and escaped.

## Set up Google Cloud Translation API

- Enable the Google Cloud Translation API in your Google Cloud project.
- Create a service account with the `roles/cloudtranslate.user` role.
- Download the service account key as a JSON file.
- Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of the downloaded JSON file, or embed the JSON content directly (as shown above).

## Run the Application

Start the Next.js development server: `npm run dev`.

## Set Up Webhook

You need to set up a webhook for your Telegram bot to receive updates. You can do this by sending a request to the Telegram API with your webhook URL:

```sh
curl "https://api.telegram.org/bot<BOT_TOKEN></test>/setWebhook?url=<DOMAIN>/api/webhook"
```

Note: If using the Telegram test environment, add `/test` to the path.

## Usage

Once the bot is running and the webhook is set up, it will listen for incoming messages. The bot will automatically translate messages from English to Burmese and vice versa using the Google Cloud Translation API.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

## License

This project is licensed under the MIT License.
