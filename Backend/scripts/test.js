const sendEmail=require('./emailer')
try {
    let to="11.rachitpandey@gmail.com"
    let subject="within next 24 hrs lansat is passing your target area"
    const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f7f7f7;">
      <div style="text-align: center;">
        <h2 style="color: #0056b3;">Landsat Satellite Notification</h2>
        <p style="font-size: 18px; color: #333;">Your selected coordinates will be within range of the Landsat satellite in the next 24 hours.</p>
      </div>
      
      <hr style="border-top: 1px solid #ccc;" />
      
      <div style="padding: 20px;">
        <h3 style="color: #0056b3;">Notification Details</h3>
        <p style="font-size: 16px; color: #444; line-height: 1.5;">
          We wanted to inform you that the Landsat satellite will be passing over the coordinates you selected:
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Latitude</th>
              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Longitude</th>
              <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Time Stamp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">28.902</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">266.45</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">74274892375897</td>
            </tr>
          </tbody>
        </table>

        <p style="font-size: 16px; color: #333;">
          If you wish to modify or update your selected coordinates, you can do so through our platform.
        </p>
        
        <p style="font-size: 16px; color: #333;">Thank you for using our notification service!</p>
      </div>

      <hr style="border-top: 1px solid #ccc;" />

      <footer style="text-align: center; padding: 10px 0;">
        <p style="font-size: 14px; color: #777;">
          If you have any questions, feel free to <a href="mailto:contact-hplrn69@gmail.com" style="color: #0056b3; text-decoration: none;">contact our support team</a>.
        </p>
      </footer>
    </div>
  `;
    await sendEmail(to, subject, body, 'hplrn69@gmail.com', 'wgcg yvdm bral gziu ');
    console.log("Email sent successfully!")
} catch (error) {
   console.log("Failed to send email.", error.message );
}