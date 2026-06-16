export const emailTemplates = {
  registrationSubmitted: (name: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #6f1d35;">Salaam, ${name}!</h2>
      <p>Jazakallah Khair for registering on Shadi Mubarak. Your profile has been submitted successfully.</p>
      <p>Our admin team will review your details to ensure authenticity and Shariah compliance before it becomes publicly visible.</p>
      <p>We will notify you as soon as the review is complete.</p>
      <br />
      <p>Regards,<br/>The Shadi Mubarak Team</p>
    </div>
  `,

  profileApproved: (name: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #6f1d35;">Profile Approved!</h2>
      <p>Salaam ${name},</p>
      <p>Great news! Your profile has been approved by our admin team and is now live on Shadi Mubarak.</p>
      <p>You can now browse other verified profiles and connect with potential matches.</p>
      <br />
      <a href="https://shadimubarak.com/my-account" style="display: inline-block; padding: 10px 20px; background-color: #6f1d35; color: white; text-decoration: none; border-radius: 5px;">View My Account</a>
      <br /><br />
      <p>Regards,<br/>The Shadi Mubarak Team</p>
    </div>
  `,

  profileRejected: (name: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #d9381e;">Profile Action Required</h2>
      <p>Salaam ${name},</p>
      <p>We reviewed your submitted profile but unfortunately it was rejected at this time due to missing or incorrect information.</p>
      <p>Please log in to your account to review the guidelines and update your profile.</p>
      <br />
      <p>Regards,<br/>The Shadi Mubarak Team</p>
    </div>
  `,

  profileNeedsFollowUp: (name: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #d97706;">Additional Information Needed</h2>
      <p>Salaam ${name},</p>
      <p>Our admin team is reviewing your profile but requires some additional information to proceed with approval.</p>
      <p>We may contact you via phone shortly, or you can log in to check your account status.</p>
      <br />
      <p>Regards,<br/>The Shadi Mubarak Team</p>
    </div>
  `,

  adminNewProfileAlert: (profileDetails: any) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #6f1d35;">New Profile Submitted</h2>
      <p>A new matrimonial profile has been submitted and is pending verification.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${profileDetails.fullName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Gender:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${profileDetails.gender}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${profileDetails.phoneNumber}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Location:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${profileDetails.city || 'N/A'}, ${profileDetails.state || 'N/A'}</td></tr>
      </table>
      <br />
      <p>Please log in to the admin dashboard to review and verify.</p>
    </div>
  `,

  membershipActivated: (name: string, packageType: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #6f1d35;">Membership Activated!</h2>
      <p>Salaam ${name},</p>
      <p>Your payment was successful and your <strong>${packageType.replace(/_/g, ' ')}</strong> has been activated.</p>
      <p>You can now enjoy the premium benefits associated with your package.</p>
      <br />
      <p>Regards,<br/>The Shadi Mubarak Team</p>
    </div>
  `,

  adminNewLeadAlert: (leadDetails: any) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #6f1d35;">New Inquiry / Lead Received</h2>
      <p>A new customer inquiry has been captured on the Shadi Mubarak platform.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 150px;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${leadDetails.fullName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${leadDetails.phone}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${leadDetails.email || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>City:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${leadDetails.city}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Inquiry Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${leadDetails.inquiryType}</td></tr>
        ${leadDetails.interestedPackage ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Package:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${leadDetails.interestedPackage}</td></tr>` : ''}
        ${leadDetails.interestedProfileId ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Profile ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${leadDetails.interestedProfileId}</td></tr>` : ''}
        ${leadDetails.sourcePage ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Source Page:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${leadDetails.sourcePage}</td></tr>` : ''}
        ${leadDetails.message ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Message:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${leadDetails.message}</td></tr>` : ''}
      </table>
      <br />
      <p>Log in to the Admin Dashboard under "Leads & Inquiries" to update status, prioritize, or log notes.</p>
    </div>
  `
};

