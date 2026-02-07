import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// This pulls the key we just put in your .env
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');
    const blueprint = data.get('blueprint') as File;

    // Convert the file to a buffer for Resend
    const buffer = Buffer.from(await blueprint.arrayBuffer());

    const { error } = await resend.emails.send({
      from: '3D Floor Plans <quotes@3dfloorplans.com.au>',
      to: 'matt@3dfloorplans.com.au', // Your new professional Gmail
      reply_to: email as string,
      subject: `New Quote Request: ${name}`,
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Client:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Details:</strong> ${message}</p>
      `,
      attachments: [
        {
          filename: blueprint.name,
          content: buffer,
        },
      ],
    });

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: "Server Error" }), { status: 500 });
  }
};