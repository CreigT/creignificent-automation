/***** NATIONWIDE GOV CONTRACT MATCHMAKER - GOOGLE STACK MVP *****/

const SHEET_NAMES = {
  SETTINGS: 'Settings',
  CONTRACTS: 'Master Contracts',
  MATCHES: 'Matches',
  LOGS: 'Logs'
};

const SERVICE_TO_NAICS = {
  'Janitorial': ['561720'],
  'Construction': ['236220', '237310', '238990'],
  'IT': ['541511', '541512', '541519'],
  'Professional Services': ['541611', '541618', '541990'],
  'Manufacturing': ['332999', '333999', '339999']
};

function getSetting(key) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAMES.SETTINGS);
  const values = sheet.getDataRange().getValues();
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === key) return values[i][1];
  }
  return '';
}

function logEvent(message) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAMES.LOGS);
  sheet.appendRow([new Date(), message]);
}

function setupHeaders() {
  const ss = SpreadsheetApp.getActive();
  ss.getSheetByName(SHEET_NAMES.CONTRACTS).clear().appendRow([
    'Pulled At','Title','Notice ID','Type','Set Aside','NAICS','State','City','Posted Date','Response Deadline','Agency','Description','URL'
  ]);
  ss.getSheetByName(SHEET_NAMES.MATCHES).clear().appendRow([
    'Matched At','Business Name','Email','ZIP','Service','Certifications','Contract Title','NAICS','State','Deadline','Gemini Explanation','Contract URL'
  ]);
  logEvent('Headers created.');
}

function getSAMData() {
  const apiKey = getSetting('SAM_API_KEY');
  if (!apiKey) throw new Error('Missing SAM_API_KEY in Settings tab.');

  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAMES.CONTRACTS);
  sheet.clear().appendRow([
    'Pulled At','Title','Notice ID','Type','Set Aside','NAICS','State','City','Posted Date','Response Deadline','Agency','Description','URL'
  ]);

  const today = new Date();
  const from = new Date();
  from.setDate(today.getDate() - 7);
  const postedFrom = Utilities.formatDate(from, Session.getScriptTimeZone(), 'MM/dd/yyyy');
  const postedTo = Utilities.formatDate(today, Session.getScriptTimeZone(), 'MM/dd/yyyy');

  const states = ['CA', 'TX', 'LA'];
  const naicsList = ['561720', '236220', '541511', '541611'];

  states.forEach(state => {
    naicsList.forEach(naics => {
      const url = 'https://api.sam.gov/prod/opportunities/v2/search'
        + '?api_key=' + encodeURIComponent(apiKey)
        + '&limit=100'
        + '&postedFrom=' + encodeURIComponent(postedFrom)
        + '&postedTo=' + encodeURIComponent(postedTo)
        + '&ptype=o'
        + '&naics=' + encodeURIComponent(naics)
        + '&state=' + encodeURIComponent(state);

      try {
        const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
        if (response.getResponseCode() !== 200) {
          logEvent('SAM error ' + response.getResponseCode() + ': ' + response.getContentText());
          return;
        }
        const data = JSON.parse(response.getContentText());
        const opportunities = data.opportunitiesData || [];
        opportunities.forEach(item => {
          sheet.appendRow([
            new Date(), item.title || '', item.noticeId || '', item.type || '',
            item.typeOfSetAsideDescription || item.typeOfSetAside || '', item.naicsCode || '',
            item.placeOfPerformance?.state?.code || '', item.placeOfPerformance?.city?.name || '',
            item.postedDate || '', item.responseDeadLine || '', item.fullParentPathName || '',
            item.description || '', item.uiLink || ''
          ]);
        });
        logEvent('Pulled ' + opportunities.length + ' opps for ' + state + ' / NAICS ' + naics);
      } catch (err) {
        logEvent('Fetch failed: ' + err.message);
      }
    });
  });
}

function onFormSubmit(e) {
  const named = e.namedValues;
  const businessName = named['Business Name']?.[0] || '';
  const email = named['Contact Email']?.[0] || '';
  const zip = named['ZIP Code']?.[0] || '';
  const service = named['What do you do?']?.[0] || '';
  const certifications = named['Certifications']?.join(', ') || '';
  const state = getStateFromZip(zip);
  const naicsMatches = SERVICE_TO_NAICS[service] || [];

  const rows = SpreadsheetApp.getActive().getSheetByName(SHEET_NAMES.CONTRACTS).getDataRange().getValues().slice(1);
  const matches = rows.filter(row => {
    const contractNAICS = String(row[5]);
    const contractState = String(row[6]);
    const setAside = String(row[4]).toLowerCase();
    const naicsMatch = naicsMatches.includes(contractNAICS);
    const stateMatch = contractState === state || contractState === '';
    const certMatch = certifications.includes('None') || certifications.includes('Small Business') || setAside === '' || certifications.toLowerCase().includes(setAside.toLowerCase());
    return naicsMatch && stateMatch && certMatch;
  }).slice(0, 5);

  if (matches.length === 0) {
    GmailApp.sendEmail(email, 'Your Government Contract Matches', 'Hello ' + businessName + ',\n\nNo strong matches were found today. Your profile is saved. Check again after the next daily refresh.\n\n- Nationwide Gov Contract Matchmaker');
    logEvent('No matches for ' + businessName);
    return;
  }

  let emailBody = 'Hello ' + businessName + ',\n\nHere are your top government contract matches:\n\n';
  matches.forEach((row, index) => {
    const contract = { title: row[1], setAside: row[4], naics: row[5], state: row[6], city: row[7], deadline: row[9], agency: row[10], description: row[11], url: row[12] };
    const explanation = explainWithGemini(businessName, service, certifications, contract);
    SpreadsheetApp.getActive().getSheetByName(SHEET_NAMES.MATCHES).appendRow([
      new Date(), businessName, email, zip, service, certifications, contract.title, contract.naics, contract.state, contract.deadline, explanation, contract.url
    ]);
    emailBody += 'MATCH #' + (index + 1) + '\nTitle: ' + contract.title + '\nNAICS: ' + contract.naics + '\nSet-Aside: ' + contract.setAside + '\nDeadline: ' + contract.deadline + '\nLink: ' + contract.url + '\n\n' + explanation + '\n\n-----------------------------\n\n';
  });
  GmailApp.sendEmail(email, 'Your Government Contract Matches', emailBody);
  logEvent('Sent matches to ' + businessName + ' / ' + email);
}

function getStateFromZip(zip) {
  try {
    const response = UrlFetchApp.fetch('https://api.zippopotam.us/us/' + encodeURIComponent(zip), { muteHttpExceptions: true });
    if (response.getResponseCode() !== 200) return '';
    return JSON.parse(response.getContentText()).places[0]['state abbreviation'] || '';
  } catch (err) {
    logEvent('ZIP lookup failed: ' + err.message);
    return '';
  }
}

function explainWithGemini(businessName, service, certifications, contract) {
  const apiKey = getSetting('GEMINI_API_KEY');
  if (!apiKey) return 'Gemini explanation skipped because GEMINI_API_KEY is missing.';
  const prompt = 'You are a PTAC counselor helping a small business understand a federal contract opportunity. Use plain English. Do not promise they will win.\n\nBusiness Name: ' + businessName + '\nBusiness Service: ' + service + '\nBusiness Certifications: ' + certifications + '\n\nContract Title: ' + contract.title + '\nSet Aside: ' + contract.setAside + '\nNAICS: ' + contract.naics + '\nState: ' + contract.state + '\nCity: ' + contract.city + '\nAgency: ' + contract.agency + '\nDeadline: ' + contract.deadline + '\nDescription: ' + contract.description + '\n\nReturn exactly this format:\nYou may qualify:\nWhat it is:\nHow to respond:\nWatch out for:';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey);
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  try {
    const response = UrlFetchApp.fetch(url, { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload), muteHttpExceptions: true });
    const data = JSON.parse(response.getContentText());
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Gemini returned no explanation.';
  } catch (err) {
    logEvent('Gemini failed: ' + err.message);
    return 'Gemini explanation failed.';
  }
}

function createDailyTrigger() {
  ScriptApp.newTrigger('getSAMData').timeBased().everyDays(1).atHour(3).create();
  logEvent('Daily SAM.gov pull trigger created.');
}
