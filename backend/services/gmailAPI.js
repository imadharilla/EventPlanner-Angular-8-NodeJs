const fs = require('fs');

const {google} = require('googleapis');
/* const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'jwt.keys.json'),
    scopes: 'https://www.googleapis.com/auth/drive.readonly',
  });
*/
const TOKEN_PATH = 'token.json';



let to ="";
let subject = "";
let message = "";


function makeBody(to, from, subject, message) {
  var str = ["Content-Type: text/html; charset=\"UTF-8\"\n",
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      "to: ", to, "\n",
      "from: ", from, "\n",
      "subject: ", subject, "\n\n",
      message
  ].join('');

  var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
      return encodedMail;
}



/**
* @param {google.auth.OAuth2} auth

*/

//const auth = new google.auth.OAuth2 ;
//let auth =  google.auth.getAccessToken()
//console.log(auth)
 function sendEmail(auth)   {
  const gmail = google.gmail({version: 'v1', auth});

// Load client secrets from a local file.


  var raw = makeBody(to, 'imadharilla@gmail.com', subject, message);
    gmail.users.messages.send({
        auth: auth,
        userId: 'me',
        resource: {
            raw: raw
        }
    }, function(err, response) {
        console.log(err)
    })
    console.log("Done")

}

exports.sendEmail = (to1, subject1, message1) => { fs.readFile('credentials.json', (err, content) => {
  to = to1; subject = subject1; message= message1
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), sendEmail);
});
}


function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}
