import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// Generic send email function
async function sendEmail(
  template: (email: string, ...args: any[]) => any,
  email: string,
  ...args: any[]
) {
  try {
    const mailOptions = template(email, ...args);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }
}

// Email templates
export function orderRequestSuccessTemplate(
  email: string,
  username: string,
  orderId: string,
  orderDate: string,
  orderItems: any[],
  totalAmount: number
) {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "Order Request Successful",
    text: `Dear ${username}, your order #${orderId} placed on ${orderDate} has been received.`,
    // HTML format can be added here as needed
  };
}

export function orderAcceptedTemplate(
  email: string,
  username: string,
  orderId: string,
  orderDate: string,
  orderItems: any[],
  totalAmount: number
) {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "Order Accepted",
    text: `Dear ${username}, your order #${orderId} placed on ${orderDate} has been accepted.`,
  };
}

export function orderRejectedTemplate(
  email: string,
  username: string,
  orderId: string,
  orderDate: string,
  orderItems: any[],
  totalAmount: number
) {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: "Order Rejected",
    text: `Dear ${username}, your order #${orderId} placed on ${orderDate} has been rejected.`,
  };
}

// Specific functions to send emails
export async function orderRequestSuccessEmail(
  email: string,
  username: string,
  orderId: string,
  orderDate: Date,
  orderItems: { name: string; quantity: number; price: number }[],
  totalAmount: number
) {
  await sendEmail(
    orderRequestSuccessTemplate,
    email,
    username,
    orderId,
    orderDate.toISOString(),
    orderItems,
    totalAmount
  );
}

export async function orderAcceptedEmail(
  email: string,
  username: string,
  orderId: string,
  orderDate: Date,
  orderItems: { name: string; quantity: number; price: number }[],
  totalAmount: number
) {
  await sendEmail(
    orderAcceptedTemplate,
    email,
    username,
    orderId,
    orderDate.toISOString(),
    orderItems,
    totalAmount
  );
}

export async function orderRejectedEmail(
  email: string,
  username: string,
  orderId: string,
  orderDate: Date,
  orderItems: { name: string; quantity: number; price: number }[],
  totalAmount: number
) {
  await sendEmail(
    orderRejectedTemplate,
    email,
    username,
    orderId,
    orderDate.toISOString(),
    orderItems,
    totalAmount
  );
}
