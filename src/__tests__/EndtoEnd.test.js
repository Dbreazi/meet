import puppeteer from 'puppeteer';

describe('show/hide event details', () => {
  let browser;
  let page;

  // Runs once before all tests to set up the browser and page
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // Headless mode for faster performance
      slowMo: 250,     // Slowing down to observe actions (optional)
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.eventSummary'); // Wait for event summary to be visible
  });

  // Runs once after all tests to close the browser
  afterAll(async () => {
    await browser.close();
  });

  test('An event element is collapsed by default', async () => {
    // Check that the event details are not visible by default
    const eventDetails = await page.$('.eventDetails');
    expect(eventDetails).toBeNull(); // Event details should be collapsed initially
  });

  test('User can expand an event to see its details', async () => {
    // Click the "Show Details" button
    await page.click('.show-details-btn');
    
    // Wait for the event details to be visible after click
    const eventDetails = await page.$('.eventDetails');
    expect(eventDetails).toBeDefined(); // Event details should be visible now
  });
  
  test('User can collapse an event to hide details', async () => {
    // Click the "Hide Details" button
    await page.click('.show-details-btn');
    
    // Wait for the event details to be hidden again
    const eventDetails = await page.$('.eventDetails');
    expect(eventDetails).toBeNull(); // Event details should be collapsed
  });
});
