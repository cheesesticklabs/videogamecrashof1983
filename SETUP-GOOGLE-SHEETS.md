# We can do this together tomorrow

The lesson is a static website. GitHub Pages serves its HTML, images, and JavaScript. Google Apps Script is a small receiver that writes submissions to your private Sheet. Students do not get access to the Sheet itself, and the lesson does not use a Google Form or Firebase.

**You do not need a paid server, a Google API key, npm, or an app installation.** The live Sheet connection still needs the one-time setup below. It has not been deployed or tested with your Google account yet.

## 1. Make the response Sheet

1. Create a blank Google Sheet called **Atari lesson responses** in your school account.
2. In the Sheet, choose **Extensions → Apps Script**.
3. Replace the starter code with the contents of **google-apps-script/Code.gs** from this lesson folder.
4. Find `CLASS_CODE` inside `configureSubmission` and replace `atari-class` with your chosen classroom code. It is a shared submission label, not an account password.
5. Save. Select **configureSubmission** in the function menu and click **Run**. Google will ask you to authorize the script to write to your spreadsheet. Complete the authorization yourself.
6. Return to the Sheet. There should be an **Atari responses** tab with a formatted header row. Keep those column headings intact.

## 2. Publish the receiver

1. In Apps Script, select **Deploy → New deployment**.
2. Choose **Web app** using the deployment type selector.
3. Set **Execute as: Me** so students can submit without permission to read your Sheet.
4. Set **Who has access: Anyone** if your school permits that option. Do not change the Sheet's sharing settings to public. If your school does not allow this web-app audience, stop here and we will choose a school-approved option together.
5. Click **Deploy** and copy the **Web app URL** ending in `/exec`.
6. Paste that URL and the same classroom code into the `sheets` section of **config.js**. Teacher setup can preview these settings locally; download its `config.js` and replace the file in the class folder to distribute them.

When you update receiver code later, use **Deploy → Manage deployments → Edit → New version → Deploy**. Saving code alone does not update an existing deployed version.

## 3. Put the lesson on GitHub Pages

1. Make a new repository for this lesson in the GitHub account you already use. Give it a simple name such as **atari-crash-lesson**.
2. Upload the **contents** of the lesson folder, including its asset folders. `index.html` should be at the repository root, not inside a second nested folder.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, then **main** and **/(root)**. Save.
5. Wait for GitHub to show the published site link on that page. Use that actual link for class. There is no build command.

Game files continue loading from your supplied Wix links. This package contains the emulator, not the ROM files. No student answers or Google credentials belong in the GitHub repository.

## 4. Check one test submission before class

1. Open the published lesson on a student device.
2. Reach Save & submit. Type a clearly marked test name and class. You can leave lesson questions blank; the page counts them without requiring answers.
3. Click **Submit my work**.
4. Wait for **Saved to your teacher's Sheet** and a receipt. Check that exactly one new row appeared in the Sheet.
5. Enter freeplay at the final checkpoint and confirm that the arcade opens. Earlier games remain locked after the crash.
6. If you retry an unconfirmed request without changing its answers, the receiver recognizes the same submission ID and avoids an extra row.

The lesson waits for Google's receipt to confirm a save. The arcade uses the separate teacher password freeplay. If school filtering blocks Apps Script or Wix, the saved draft remains on the student's device and the page reports that confirmation did not arrive.

The receiver only writes submissions and returns random receipt IDs and timestamps. It does not return names, responses, or spreadsheet contents. The classroom code appears in the class website and provides no authenticated student identity; students supply their names and class periods.

References: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Apps Script web apps](https://developers.google.com/apps-script/guides/web), [Google Content Service and JSONP](https://developers.google.com/apps-script/guides/content).
