const fs = require('fs').promises;
const { setInterval } = require('timers/promises');
const sendEmail = require("./emailer");

const notificationStack = [];

// Function to fetch data within the next 15 minutes
const fetchUpcomingNotifications = async () => {
    try {
        const data = await fs.readFile("scripts/notifydb.json", 'utf-8');
        const obj = JSON.parse(data);
        const now = Date.now();
        const fifteenMinutesLater = now + 15 * 60 * 1000;

        // Filter notifications with timestamps within the next 15 minutes
        const upcomingNotifications = obj.table.filter(entry => {
            return entry.time_stamp >= now && entry.time_stamp <= fifteenMinutesLater;
        });

        console.log(`Upcoming notifications:`, upcomingNotifications); // Debugging output
        return upcomingNotifications;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

// Function to update notifydb.json by removing processed notifications
const updateNotifyDB = async (processedEntries) => {
    try {
        const data = await fs.readFile("scripts/notifydb.json", 'utf-8');
        const obj = JSON.parse(data);

        // Filter out the processed entries
        obj.table = obj.table.filter(entry => {
            return !processedEntries.some(processed =>
                processed.time_stamp === entry.time_stamp &&
                JSON.stringify(processed.methods) === JSON.stringify(entry.methods)
            );
        });

        // Write the updated object back to the file
        const json = JSON.stringify(obj, null, 2);
        await fs.writeFile('scripts/notifydb.json', json, 'utf-8');
        console.log("Updated notifydb.json, removed processed notifications.");
    } catch (error) {
        console.error("Error updating notifydb.json:", error);
    }
};

// Function to process notifications
const processNotifications = async () => {
    // Fetch upcoming notifications and add them to the stack
    const notifications = await fetchUpcomingNotifications();

    if (notifications.length > 0) {
        notificationStack.push(...notifications);
        console.log(`Loaded ${notifications.length} notifications into the stack.`);
    }

    // Process notifications in order
    const processedEntries = []; // Keep track of processed notifications
    while (notificationStack.length > 0) {
        let notification = notificationStack.shift(); // Get the next notification

        console.log("Sending notification:", notification);

        try {
            // Ensure that methods array exists and is not empty
            if (notification.methods && notification.methods.length > 0) {
                let to = notification.methods[0].details; // Use `details` for email
                let subject = "Landsat Satellite Notification - Within the Next 24 Hours";
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
                              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${notification.lat}</td>
                              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${notification.long}</td>
                              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${notification.time_stamp}</td>
                            </tr>
                          </tbody>
                        </table>
                
                        <p style="font-size: 16px; color: #333;">Thank you for using our notification service!</p>
                      </div>
                
                      <hr style="border-top: 1px solid #ccc;" />
                
                      <footer style="text-align: center; padding: 10px 0;">
                        <p style="font-size: 14px; color: #777;">
                          If you have any questions, feel free to <a href="mailto:contact-hplrn69@gmail.com" style="color: #0056b3; text-decoration: none;">contact our support team</a>.
                        </p>
                      </footer>
                    </div>`;

                await sendEmail(to, subject, body, 'hplrn69@gmail.com', 'wgcg yvdm bral gziu');
                console.log("Email sent successfully!");
            } else {
                console.log("No valid methods defined for this notification.");
            }
        } catch (error) {
            console.log("Failed to send email.", error.message);
        }

        // Simulate sending a notification with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Store the processed notification for removal
        processedEntries.push(notification);
    }

    // Update the notifydb.json to remove processed notifications
    await updateNotifyDB(processedEntries);
};

// Main function to start the notification engine
const startNotificationEngine = async () => {
    console.log("Notification engine started. Checking every 15 minutes...");

    await processNotifications();
    setInterval(async () => {
        await processNotifications();
    }, 15 * 60 * 1000);
};

// Start the notification engine
module.exports = startNotificationEngine();
