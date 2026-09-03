import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const ADMIN_EMAIL = 'nexoraofficial1207@gmail.com';

export async function POST(req: Request) {
  try {
    const { email, name, sector } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const studentName = name || 'Student';
    const targetSector = sector || 'ENGINEERING & TECH';
    const regDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. ADMIN REGISTRATION ALERT HTML EMAIL TEMPLATE
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #030712; color: #f8fafc; margin: 0; padding: 20px; }
          .card { max-width: 600px; margin: 0 auto; background: #0b0f19; border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 20px; padding: 30px; }
          .header { border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: 900; color: #00F0FF; margin: 0; letter-spacing: 1px; }
          .badge { display: inline-block; background: rgba(0, 240, 255, 0.15); color: #00F0FF; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-top: 5px; }
          .detail-row { margin: 12px 0; font-size: 14px; color: #cbd5e1; }
          .label { color: #94a3b8; font-weight: 700; width: 120px; display: inline-block; }
          .val { font-weight: 800; color: #ffffff; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 11px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">🎉 NEW STUDENT REGISTRATION</h1>
            <span class="badge">NEXORA PLATFORM ALERT</span>
          </div>
          <div class="detail-row"><span class="label">Student Name:</span> <span class="val">${studentName}</span></div>
          <div class="detail-row"><span class="label">Email Address:</span> <span class="val">${email}</span></div>
          <div class="detail-row"><span class="label">Track Sector:</span> <span class="val">${targetSector}</span></div>
          <div class="detail-row"><span class="label">Time (IST):</span> <span class="val">${regDate}</span></div>
          <div class="footer">
            Official Admin Alert • Nexora Education Technologies (nexoraedu.co.in)
          </div>
        </div>
      </body>
      </html>
    `;

    // 2. OFFICIAL STUDENT WELCOME HTML EMAIL TEMPLATE
    const studentWelcomeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #030712; color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 620px; margin: 0 auto; background: #0b0f19; border: 1px solid rgba(0, 240, 255, 0.25); border-radius: 24px; padding: 35px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .brand { font-size: 26px; font-weight: 900; color: #00F0FF; letter-spacing: 2px; text-decoration: none; }
          .tagline { font-size: 11px; font-weight: 800; color: #a855f7; text-transform: uppercase; margin-top: 2px; }
          .hero { margin: 25px 0; background: linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(168, 85, 247, 0.1)); border: 1px solid rgba(0, 240, 255, 0.2); padding: 20px; border-radius: 16px; }
          .hero-title { font-size: 18px; font-weight: 900; color: #ffffff; margin: 0 0 8px 0; }
          .hero-desc { font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.6; }
          .feature-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 15px; border-radius: 14px; margin-bottom: 12px; }
          .feature-title { font-size: 14px; font-weight: 800; color: #00F0FF; margin-bottom: 4px; }
          .feature-desc { font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5; }
          .btn-wrap { text-align: center; margin: 30px 0 20px 0; }
          .btn { display: inline-block; background: linear-gradient(90deg, #00F0FF, #3B82F6); color: #030712; font-weight: 900; font-size: 13px; padding: 14px 32px; border-radius: 14px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(0, 240, 255, 0.3); }
          .footer { margin-top: 35px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; text-align: center; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div>
            <div class="brand">NEXORA</div>
            <div class="tagline">Student Academic &amp; Career Command Hub</div>
          </div>

          <div class="hero">
            <h2 class="hero-title">Welcome to Nexora, ${studentName}! 🚀</h2>
            <p class="hero-desc">Your official student clearance account is verified and activated. Nexora provides you with intelligent career pathfinding, partner college cutoffs, encrypted document vaulting, and AI academic assistance.</p>
          </div>

          <div style="margin-bottom: 20px;">
            <div class="feature-box">
              <div class="feature-title">🤖 Nexus AI Copilot &amp; Multi-Modal OCR</div>
              <p class="feature-desc">Ask complex academic queries or upload photos of handwritten assignment notes, math derivations, and timetables for instant AI decoding.</p>
            </div>

            <div class="feature-box">
              <div class="feature-title">🔒 Encrypted Document Vault</div>
              <p class="feature-desc">Store your marks memos, timetables, certificates, and study notes in your private 512 MB database locker.</p>
            </div>

            <div class="feature-box">
              <div class="feature-title">🏛️ Partner Colleges Directory</div>
              <p class="feature-desc">Explore verified college cutoffs, fee structures, scholarship perks, and direct admission tokens.</p>
            </div>
          </div>

          <div class="btn-wrap">
            <a href="https://www.nexoraedu.co.in/dashboard" class="btn">LAUNCH NEXORA DASHBOARD</a>
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} Nexora Education Technologies • nexoraedu.co.in</p>
            <p>Need assistance? Contact us at nexoraofficial1207@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 3. DISPATCH EMAILS VIA RESEND API IF KEY EXISTS
    let adminEmailSent = false;
    let studentEmailSent = false;

    if (RESEND_API_KEY) {
      try {
        // Send Admin Alert Email
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Nexora Onboarding <onboarding@resend.dev>',
            to: ADMIN_EMAIL,
            subject: `🎉 New Student Registration: ${studentName}`,
            html: adminEmailHtml
          })
        });
        adminEmailSent = true;

        // Send Student Welcome Email
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Nexora Student Hub <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to Nexora — Your Student Academic & Career Command Hub 🚀',
            html: studentWelcomeHtml
          })
        });
        studentEmailSent = true;
      } catch (emailErr) {
        console.error('Resend Dispatch Error:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      adminNotification: adminEmailSent ? 'Sent to nexoraofficial1207@gmail.com' : 'Logged locally (Add RESEND_API_KEY to send live)',
      studentWelcome: studentEmailSent ? `Sent to ${email}` : 'Logged locally'
    });

  } catch (error: any) {
    console.error('Registration Notify API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
