from playwright.sync_api import sync_playwright

URL = "http://localhost:8000/"

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={"width":1200, "height":800})
    page = context.new_page()
    page.goto(URL)
    page.wait_for_load_state("networkidle")
    page.screenshot(path="home.png", full_page=True)

    # navigate to first gallery item
    href = page.eval_on_selector('#decksList', 'el => { const a = el.querySelector("a.card__link"); return a ? a.getAttribute("href") : null }')
    if href:
        page.goto(URL + href)
        page.wait_for_load_state("networkidle")
        page.screenshot(path="gallery_item.png", full_page=True)

    browser.close()
