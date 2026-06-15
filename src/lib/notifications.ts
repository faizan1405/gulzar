import { Resend } from 'resend';
import { prisma } from './db';
import { emailTemplates } from './emailTemplates';

// Use a mock SMS provider if SMS API is not configured.
const SMS_MOCK_ENABLED = process.env.SMS_PROVIDER !== 'REAL';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

// --- Base notification senders ---

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(`[Mock Email] To: ${to} | Subject: ${subject}`);
    return { id: 'mock_email_id' };
  }
  
  const response = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}

async function sendSMS(to: string, body: string) {
  if (SMS_MOCK_ENABLED) {
    console.warn(`[Mock SMS] To: ${to} | Body: ${body}`);
    return { id: 'mock_sms_id' };
  }
  
  // Real implementation would go here (e.g., Twilio, Msg91)
  throw new Error('Real SMS provider not implemented.');
}

async function logNotification(type: string, channel: string, recipient: string, status: 'SUCCESS' | 'FAILED', responseId?: string) {
  try {
    const maskedRecipient = recipient.length > 5 
      ? recipient.substring(0, 3) + '***' + recipient.substring(recipient.length - 2)
      : '***';

    await prisma.notificationLog.create({
      data: {
        type,
        channel,
        recipientMasked: maskedRecipient,
        status,
        providerResponse: responseId || null
      }
    });
  } catch (error) {
    console.error('Failed to log notification:', error);
  }
}

// --- Hooks ---

export async function notifyRegistration(userEmail: string | null, userPhone: string, userName: string) {
  // Fire and forget, don't block
  setImmediate(async () => {
    // 1. Email User
    if (userEmail) {
      try {
        const res = await sendEmail(userEmail, 'Registration Successful - Shadi Mubarak', emailTemplates.registrationSubmitted(userName));
        await logNotification('REGISTRATION_USER_EMAIL', 'EMAIL', userEmail, 'SUCCESS', res?.id);
      } catch (err: any) {
        await logNotification('REGISTRATION_USER_EMAIL', 'EMAIL', userEmail, 'FAILED', err.message);
      }
    }

    // 2. SMS User
    if (userPhone) {
      try {
        const res = await sendSMS(userPhone, `Salaam ${userName}, your Shadi Mubarak profile is submitted and under review.`);
        await logNotification('REGISTRATION_USER_SMS', 'SMS', userPhone, 'SUCCESS', res?.id);
      } catch (err: any) {
        await logNotification('REGISTRATION_USER_SMS', 'SMS', userPhone, 'FAILED', err.message);
      }
    }
  });
}

export async function notifyAdminNewProfile(profileDetails: any) {
  setImmediate(async () => {
    try {
      const settings = await prisma.globalSettings.findFirst();
      if (!settings || !settings.emailAlertsEnabled || !settings.adminEmail) return;

      const res = await sendEmail(settings.adminEmail, 'New Profile Alert', emailTemplates.adminNewProfileAlert(profileDetails));
      await logNotification('ADMIN_NEW_PROFILE_ALERT', 'EMAIL', settings.adminEmail, 'SUCCESS', res?.id);
      
      if (settings.smsAlertsEnabled && settings.adminPhone) {
        const smsRes = await sendSMS(settings.adminPhone, `New profile submitted by ${profileDetails.fullName}. Please review.`);
        await logNotification('ADMIN_NEW_PROFILE_SMS', 'SMS', settings.adminPhone, 'SUCCESS', smsRes?.id);
      }
    } catch (err: any) {
      console.error('Admin alert failed', err);
    }
  });
}

export async function notifyVerificationStatus(userEmail: string | null, userPhone: string, userName: string, status: string) {
  setImmediate(async () => {
    try {
      let html = '';
      let subject = '';
      let smsBody = '';

      if (status === 'APPROVED') {
        html = emailTemplates.profileApproved(userName);
        subject = 'Profile Approved! - Shadi Mubarak';
        smsBody = `Salaam ${userName}, your Shadi Mubarak profile is approved! You can now browse profiles.`;
      } else if (status === 'REJECTED') {
        html = emailTemplates.profileRejected(userName);
        subject = 'Profile Update Required - Shadi Mubarak';
        smsBody = `Salaam ${userName}, your Shadi Mubarak profile requires updates. Please check your account.`;
      } else if (status === 'NEEDS_FOLLOW_UP') {
        html = emailTemplates.profileNeedsFollowUp(userName);
        subject = 'Information Needed - Shadi Mubarak';
        smsBody = `Salaam ${userName}, we need some extra details for your profile. We will contact you soon.`;
      } else {
        return; // Don't notify for PENDING or other
      }

      if (userEmail) {
        const res = await sendEmail(userEmail, subject, html);
        await logNotification('VERIFICATION_UPDATE', 'EMAIL', userEmail, 'SUCCESS', res?.id);
      }
      
      if (userPhone) {
        const res = await sendSMS(userPhone, smsBody);
        await logNotification('VERIFICATION_UPDATE', 'SMS', userPhone, 'SUCCESS', res?.id);
      }
    } catch (err: any) {
      console.error('Verification notify failed', err);
    }
  });
}

export async function notifyMembership(userEmail: string | null, userPhone: string, userName: string, packageType: string) {
  setImmediate(async () => {
    try {
      if (userEmail) {
        const res = await sendEmail(userEmail, 'Membership Activated - Shadi Mubarak', emailTemplates.membershipActivated(userName, packageType));
        await logNotification('MEMBERSHIP_ACTIVATED', 'EMAIL', userEmail, 'SUCCESS', res?.id);
      }
      if (userPhone) {
        const pName = packageType.replace(/_/g, ' ');
        const res = await sendSMS(userPhone, `Salaam ${userName}, your ${pName} is now active on Shadi Mubarak.`);
        await logNotification('MEMBERSHIP_ACTIVATED', 'SMS', userPhone, 'SUCCESS', res?.id);
      }
    } catch (err: any) {
      console.error('Membership notify failed', err);
    }
  });
}
